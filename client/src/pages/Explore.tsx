import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import * as THREE from "three";

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>;

const MODEL_URL = "https://piraeusgate.b-cdn.net/azel-web-v2.glb";

const buildings = [
  { key: "N1", label: "Building N1", kind: "New residential" },
  { key: "N2", label: "Building N2", kind: "New residential" },
  { key: "N3", label: "Building N3", kind: "New residential" },
  { key: "N4", label: "Building N4", kind: "New residential" },
  { key: "N5", label: "Building N5", kind: "New residential" },
  { key: "K1", label: "Building K1", kind: "Preserved building" },
  { key: "K2", label: "Building K2", kind: "Preserved building" },
];

// Indicative ranges from the client's pricing sheet (€4,000–5,000/m²); the same for every new building
// until a per-unit list replaces them.
const unitTypes = [
  { name: "Studio", size: "30–38 m²", ticket: "€120,000 – €190,000" },
  { name: "1-Bedroom", size: "40–55 m²", ticket: "€160,000 – €275,000" },
  { name: "2-Bedroom", size: "56–75 m²", ticket: "€224,000 – €375,000" },
  { name: "3-Bedroom", size: "76–92 m²", ticket: "€304,000 – €460,000" },
];

const HIGHLIGHT = new THREE.Color("#c76242");
const NONE = new THREE.Color("#000000");

// Node names come from the architect's export, e.g. R01_ARCHITECTURAL_PROPOSAL_N3_WALLS__M0008.
function buildingOf(name: string) {
  return name.match(/PROPOSAL_(N\d+)/)?.[1] ?? name.match(/PRESERVED_BUILDINGS_(K\d+)/)?.[1] ?? null;
}

type Frame = { center: THREE.Vector3; radius: number };

function Model({ selected, onSelect, onReady }: { selected: string | null; onSelect: (key: string) => void; onReady: (site: Frame, perBuilding: Map<string, Frame>) => void }) {
  const { scene } = useGLTF(MODEL_URL);

  const meshesByBuilding = useMemo(() => {
    const map = new Map<string, THREE.Mesh[]>();
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      let key: string | null = null;
      for (let o: THREE.Object3D | null = mesh; o && !key; o = o.parent) key = buildingOf(o.name);
      if (!key) {
        // Context/landscape is never clickable; skipping its raycast keeps clicks fast on 1M+ triangles.
        mesh.raycast = () => {};
        return;
      }
      // Clone so tinting one building doesn't bleed into others sharing the same material.
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map((m) => m.clone()) : mesh.material.clone();
      mesh.userData.building = key;
      map.set(key, [...(map.get(key) ?? []), mesh]);
    });
    return map;
  }, [scene]);

  useEffect(() => {
    // World matrices aren't computed until the first render; bounds need the export's node scale applied.
    scene.updateMatrixWorld(true);
    const frameOf = (box: THREE.Box3): Frame => ({ center: box.getCenter(new THREE.Vector3()), radius: box.getSize(new THREE.Vector3()).length() / 2 });
    const site = new THREE.Box3();
    const perBuilding = new Map<string, Frame>();
    meshesByBuilding.forEach((meshes, key) => {
      const box = new THREE.Box3();
      meshes.forEach((m) => box.expandByObject(m));
      site.union(box);
      perBuilding.set(key, frameOf(box));
    });
    onReady(frameOf(site), perBuilding);
  }, [scene, meshesByBuilding, onReady]);

  useEffect(() => {
    meshesByBuilding.forEach((meshes, key) => {
      const color = key === selected ? HIGHLIGHT : NONE;
      meshes.forEach((mesh) => {
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          if (!mat.emissive) return;
          mat.emissive.copy(color);
          mat.emissiveIntensity = key === selected ? 0.45 : 0;
        });
      });
    });
  }, [meshesByBuilding, selected]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const key = event.object.userData.building as string | undefined;
    // Ignore clicks that were really the end of an orbit drag.
    if (!key || event.delta > 4) return;
    event.stopPropagation();
    onSelect(key);
  };

  return <primitive object={scene} onClick={handleClick} />;
}

function CameraRig({ target, controls }: { target: Frame | null; controls: React.RefObject<OrbitControlsImpl | null> }) {
  const goal = useRef<Frame | null>(null);
  const animating = useRef(false);
  const placed = useRef(false);
  useEffect(() => {
    goal.current = target;
    animating.current = !!target;
  }, [target]);

  useFrame((state, delta) => {
    const c = controls.current;
    const g = goal.current;
    if (!g || !c || !animating.current) return;
    const cam = state.camera as THREE.PerspectiveCamera;
    // Fit the bounding sphere to whichever field of view is narrower, so portrait phones don't crop it.
    const vfov = THREE.MathUtils.degToRad(cam.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * cam.aspect);
    const desired = (g.radius / Math.sin(Math.min(vfov, hfov) / 2)) * 1.05;

    if (!placed.current) {
      // First frame after load: jump straight to a three-quarter view instead of flying in from afar.
      placed.current = true;
      c.target.copy(g.center);
      cam.position.copy(g.center).add(new THREE.Vector3(1, 0.55, 1).setLength(desired));
      c.update();
      animating.current = false;
      return;
    }

    const t = 1 - Math.exp(-Math.min(delta, 0.1) * 3);
    c.target.lerp(g.center, t);
    const offset = cam.position.clone().sub(c.target);
    offset.setLength(THREE.MathUtils.lerp(offset.length(), desired, t));
    cam.position.copy(c.target).add(offset);
    c.update();
    // Hand control back to the user once the move has settled.
    if (c.target.distanceTo(g.center) < g.radius * 0.01 && Math.abs(offset.length() - desired) < desired * 0.01) animating.current = false;
  });
  return null;
}

function Loader() {
  const { progress, active } = useProgress();
  if (!active && progress >= 100) return null;
  return (
    <div className="explore-loader">
      <span>Loading 3D model</span>
      <div className="explore-loader-bar"><i style={{ width: `${progress}%` }} /></div>
      <span>{Math.round(progress)}%</span>
    </div>
  );
}

class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: unknown) { console.error("[Explore] failed to load 3D model", error); }
  render() {
    if (this.state.failed) return <div className="explore-loader"><span>The 3D model could not be loaded. Please try again later.</span></div>;
    return this.props.children;
  }
}

export default function Explore() {
  const controls = useRef<OrbitControlsImpl>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [site, setSite] = useState<Frame | null>(null);
  const [frames, setFrames] = useState<Map<string, Frame>>(new Map());

  const handleReady = useMemo(() => (siteFrame: Frame, perBuilding: Map<string, Frame>) => {
    setSite(siteFrame);
    setFrames(perBuilding);
  }, []);

  const target = (selected && frames.get(selected)) || site;
  const active = buildings.find((b) => b.key === selected);

  return (
    <main className="explore-shell">
      <header className="explore-bar">
        <Link href="/" className="explore-back"><ArrowLeft size={16} /> Back to site</Link>
        <span className="explore-title">Urban Piraeus Oasis — 3D</span>
      </header>

      <div className="explore-stage">
        <ModelErrorBoundary>
          <Canvas camera={{ position: [400, 300, 400], fov: 40, near: 1, far: 20000 }} dpr={[1, 2]}>
            <color attach="background" args={["#ede6da"]} />
            <hemisphereLight args={["#fff8ee", "#8a8172", 1.1]} />
            <directionalLight position={[300, 600, 200]} intensity={1.6} />
            <Suspense fallback={null}>
              <Model selected={selected} onSelect={setSelected} onReady={handleReady} />
            </Suspense>
            <OrbitControls ref={controls} makeDefault enableDamping maxPolarAngle={Math.PI / 2.1} />
            <CameraRig target={target} controls={controls} />
          </Canvas>
          <Loader />
        </ModelErrorBoundary>

        <aside className="explore-panel">
          <p className="explore-eyebrow">Select a building</p>
          <ul>
            {buildings.map((b) => (
              <li key={b.key}>
                <button className={b.key === selected ? "active" : ""} onClick={() => setSelected(b.key === selected ? null : b.key)}>
                  <strong>{b.label}</strong>
                  <span>{b.kind}</span>
                </button>
              </li>
            ))}
          </ul>
          {active ? (
            <div className="explore-detail">
              <h2>{active.label}</h2>
              {active.key.startsWith("N") ? (
                <>
                  <p className="explore-eyebrow explore-units-title">Unit types · Indicative</p>
                  <ul className="explore-units">
                    {unitTypes.map((u) => (
                      <li key={u.name}>
                        <strong>{u.name}</strong>
                        <span>{u.size}</span>
                        <span>{u.ticket}</span>
                      </li>
                    ))}
                  </ul>
                  <p>Indicative ticket based on €4,000–5,000/m². Unit availability per building and floor to be confirmed.</p>
                </>
              ) : (
                <p>Preserved building. Details to follow.</p>
              )}
            </div>
          ) : (
            <p className="explore-hint">Drag to orbit, scroll to zoom, click a building to focus it.</p>
          )}
        </aside>
      </div>
    </main>
  );
}
