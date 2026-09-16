import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronRight, Compass, Leaf, Menu, X } from "lucide-react";
import { MapView } from "@/components/Map";

const images = {
  hero: "/images/piraeus-hero.jpg",
  courtyard: "/images/piraeus-courtyard.jpg",
  lounge: "/images/piraeus-lounge.jpg",
  rooftop: "/images/piraeus-rooftop.jpg",
  detail: "/images/piraeus-detail.jpg",
  workplace: "/images/piraeus-workplace.jpg",
  locationMarinaZea: "/images/piraeus-location-marina-zea.jpg",
  locationPort: "/images/piraeus-location-port.jpg",
  locationTower: "/images/piraeus-location-tower.jpg",
  locationKaraiskaki: "/images/piraeus-location-karaiskaki.jpg",
  masterplan: "/images/piraeus-masterplan.jpg",
};

const areaGalleryImages = [
  images.locationMarinaZea,
  images.locationTower,
  images.locationPort,
  images.locationKaraiskaki,
  images.courtyard,
  images.lounge,
  images.rooftop,
  images.detail,
];

const residences = [
  { name: "Studios", size: "Indicative 35–48 sqm", copy: "Efficient, light-filled homes for a connected urban life.", image: images.detail },
  { name: "1-bedroom", size: "Indicative 52–68 sqm", copy: "A considered balance of privacy, storage and everyday flexibility.", image: images.lounge },
  { name: "2-bedroom", size: "Indicative 78–96 sqm", copy: "Generous shared living areas designed to adapt over time.", image: images.courtyard },
  { name: "3-bedroom", size: "Indicative 105+ sqm", copy: "Larger residences with room for family life, guests and work.", image: images.rooftop },
];

const rationale = [
  ["01", "Early entry pricing", "Indicative access before later public sales phases, subject to availability and final terms."],
  ["02", "Large-scale development", "A planned ecosystem of nearly 400 residences across seven residential buildings."],
  ["03", "Multiple exit strategies", "Potential to hold for rental income or consider a later-stage resale, subject to market conditions."],
  ["04", "Piraeus growth story", "Participation in a broader district narrative that is evolving around the port, mobility and new urban life."],
];

const timeline = ["Architectural study submitted", "Current project maturation", "Partner network formation", "Initial investor release", "Public sales releases", "Construction phases", "Indicative delivery"];

const locationImages = [
  { src: images.locationMarinaZea, alt: "Marina Zea, Piraeus", label: "Marina Zeas" },
  { src: images.locationPort, alt: "Piraeus Port", label: "Piraeus Port" },
  { src: images.locationTower, alt: "Piraeus Tower", label: "Piraeus Tower" },
  { src: images.locationKaraiskaki, alt: "Karaiskaki, Piraeus", label: "Karaiskaki Stadium" },
];

// Urban Piraeus Oasis uses the client-confirmed site coordinates. The
// other Piraeus landmarks are approximate, not survey-accurate.
const mapPoints = [
  { name: "Urban Piraeus Oasis", lat: 37.94734210830303, lng: 23.656522176345334, isSite: true },
  { name: "Piraeus Tower", lat: 37.9428, lng: 23.6464 },
  { name: "Karaiskaki Stadium", lat: 37.9486, lng: 23.6428 },
  { name: "Piraeus Port", lat: 37.9382, lng: 23.6459 },
  { name: "Marina Zeas", lat: 37.933, lng: 23.6482 },
];

// A muted, desaturated custom style so the map reads as part of the site's editorial palette.
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f0ece4" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8f86" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f0ece4" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f7f3eb" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e5ddcc" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c7d4d1" }] },
];

function LocationMap() {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);

  const markerIcon = (index: number, isActive: boolean): google.maps.Symbol => ({
    path: google.maps.SymbolPath.CIRCLE,
    scale: mapPoints[index].isSite ? 15 : 11,
    fillColor: isActive || mapPoints[index].isSite ? "#c76242" : "#1b2a27",
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2,
  });

  const handleMapReady = (map: google.maps.Map) => {
    mapInstance.current = map;
    markers.current = mapPoints.map((point, index) => {
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map,
        label: { text: point.isSite ? "PU" : String(index + 1), color: "#fff", fontSize: "11px", fontWeight: "700" },
        icon: markerIcon(index, index === active),
      });
      marker.addListener("click", () => setActive(index));
      return marker;
    });
    setStatus("ready");
  };

  useEffect(() => {
    if (status !== "ready") return;
    const point = mapPoints[active];
    mapInstance.current?.panTo({ lat: point.lat, lng: point.lng });
    mapInstance.current?.setZoom(16);
    markers.current.forEach((marker, index) => marker.setIcon(markerIcon(index, index === active)));
  }, [active, status]);

  const activePoint = mapPoints[active];

  return (
    <section id="location" className="location-map-section">
      <MapView
        className="location-map-canvas"
        initialCenter={{ lat: mapPoints[0].lat, lng: mapPoints[0].lng }}
        styles={mapStyle}
        onMapReady={handleMapReady}
        onError={() => setStatus("error")}
      />
      {status !== "ready" && <div className="location-map-fallback" aria-hidden="true" />}
      <div className="location-map-panel">
        <span className="location-map-panel-label">Map</span>
        <h3 className="location-map-panel-title">{activePoint.name}</h3>
        <div className="location-map-panel-list">
          {mapPoints.map((point, index) => index !== active && (
            <button key={point.name} onClick={() => setActive(index)}>{point.name}</button>
          ))}
        </div>
        <a
          className="location-map-panel-cta"
          href={`https://www.google.com/maps/search/?api=1&query=${activePoint.lat},${activePoint.lng}`}
          target="_blank"
          rel="noreferrer"
        >
          <Compass size={14} /> Open Google Map
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeResidence, setActiveResidence] = useState(0);
  const [locationSlide, setLocationSlide] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const areaScrollOuterRef = useRef<HTMLElement>(null);
  const areaScrollTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLocationSlide((value) => (value + 1) % locationImages.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  // Motion note: keep this observer lightweight. It reveals whole editorial chapters;
  // individual tab transitions are handled by keyed media elements below.
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".site-shell");
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".site-shell > section:not(.hero-panel)"));
    shell?.classList.add("motion-ready");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    sections.forEach((section) => observer.observe(section));

    let frame = 0;
    const updateParallax = () => {
      const hero = document.querySelector<HTMLElement>(".hero-panel");
      if (hero) hero.style.setProperty("--hero-scroll", `${Math.min(window.scrollY * 0.12, 90)}px`);

      const outer = areaScrollOuterRef.current;
      const track = areaScrollTrackRef.current;
      if (outer && track) {
        const rect = outer.getBoundingClientRect();
        const scrollableDistance = outer.offsetHeight - window.innerHeight;
        const progress = scrollableDistance > 0 ? Math.min(Math.max(-rect.top / scrollableDistance, 0), 1) : 0;
        const maxOffset = Math.max(track.scrollWidth - window.innerWidth, 0);
        track.style.transform = `translateX(-${progress * maxOffset}px)`;
      }

      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateParallax); };
    window.addEventListener("scroll", onScroll, { passive: true });

    const sizeAreaScroll = () => {
      const outer = areaScrollOuterRef.current;
      const track = areaScrollTrackRef.current;
      if (outer && track) outer.style.height = `${track.scrollWidth + window.innerHeight}px`;
      updateParallax();
    };
    sizeAreaScroll();
    window.addEventListener("resize", sizeAreaScroll);
    window.addEventListener("load", sizeAreaScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sizeAreaScroll);
      window.removeEventListener("load", sizeAreaScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const residence = residences[activeResidence];

  return (
    <main className="site-shell">
      <header className={`site-header ${menuOpen ? "is-open" : ""}`}>
        <div className="utility-bar">
          <span className="utility-cell utility-brand">Urban Piraeus Oasis</span>
          <span className="utility-cell utility-fill" aria-hidden="true" />
          <button className="utility-cell utility-cta" onClick={() => scrollTo("contact")}>Investor log in <ArrowUpRight size={13} /></button>
        </div>
        <div className="site-nav">
          <button className="brand-mark" onClick={() => scrollTo("top")} aria-label="Back to top"><span className="brand-monogram">PU</span><span className="brand-name">Urban Piraeus<br />Oasis</span></button>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <button onClick={() => scrollTo("masterplan")}>Masterplan</button><button onClick={() => scrollTo("location")}>Location</button><button onClick={() => scrollTo("residences")}>Residences</button><button onClick={() => scrollTo("investors")}>Investors</button><button onClick={() => scrollTo("overview")}>Gallery</button>
          </nav>
          <button className="nav-cta" onClick={() => scrollTo("contact")}>Request information <ArrowUpRight size={15} /></button>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          {menuOpen && <div className="mobile-nav">{["overview", "location", "masterplan", "residences", "investors"].map((id, index) => <button key={id} onClick={() => scrollTo(id)}><span>0{index + 1}</span>{id}</button>)}<button className="mobile-nav-contact" onClick={() => scrollTo("contact")}>Request information <ArrowUpRight size={16} /></button></div>}
        </div>
      </header>

      <section id="top" className="hero-panel investor-hero">
        {/* Media note: keep the MP4 external on Bunny CDN; the local poster preserves the design if video is unavailable. */}
        <video className="hero-image" autoPlay muted loop playsInline preload="auto" aria-label="Indicative moving view of Urban Piraeus Oasis overlooking the waterfront">
          <source src="https://piraeusgate.b-cdn.net/kling_20260915_VIDEO__4577_0.mp4" type="video/mp4" />
        </video>
        <div className="hero-copy">
          <h1>Where Business<br />Comes Together</h1>
        </div>
      </section>

      <section id="overview" className="workplace-section">
        <div className="workplace-intro">
          <div className="workplace-copy">
            <p>Located at the entrance of Piraeus, Piraeus Urban Oasis combines exceptional connectivity with four-sided window exposures, bringing abundant natural light and expansive city views to every floor.</p>
            <p>Piraeus Urban Oasis sits within a broader transformation of Piraeus, where residential, hospitality, commercial and lifestyle uses are coming together to create a more connected urban environment.</p>
          </div>
          <div className="workplace-tagline">
            <p className="workplace-tagline-title">Every Morning<br />Looks Different.</p>
            <p className="workplace-scroll">Scroll to Explore</p>
          </div>
        </div>
        <div className="workplace-media">
          <img src={images.workplace} alt="Urban Piraeus Oasis building" />
          <div className="workplace-media-overlay">
            <span>A Workplace</span>
            <span className="workplace-dot" aria-hidden="true" />
            <span>That Works</span>
          </div>
        </div>
        <div className="workplace-stats">
          <div><span>Gross buildable area</span><strong>26,480 m²</strong></div>
          <div><span>Total floors</span><strong>10</strong></div>
          <div><span>To be delivered</span><strong>Q4 2028</strong></div>
        </div>
        <p className="workplace-address" aria-hidden="true">60 Omiridou Skylitsi</p>
      </section>

      <section className="location-gallery">
        {locationImages.map((image, index) => (
          <img key={image.src} src={image.src} alt={image.alt} className={`location-gallery-image ${index === locationSlide ? "active" : ""}`} />
        ))}
        <div className="location-gallery-wash" />
        {locationImages.map((image, index) => (
          <p key={image.label} className={`location-gallery-label ${index === locationSlide ? "active" : ""}`}>{image.label}</p>
        ))}
        <div className="location-gallery-nav">
          {locationImages.map((image, index) => (
            <button key={image.src} className={index === locationSlide ? "active" : ""} onClick={() => setLocationSlide(index)}>{image.label}</button>
          ))}
        </div>
      </section>

      <LocationMap />

      <section id="masterplan" className="masterplan-image-section">
        <img src={images.masterplan} alt="Urban Piraeus Oasis masterplan" />
      </section>

      <section id="area-gallery" ref={areaScrollOuterRef} className="area-scroll-outer">
        <div className="area-scroll-sticky">
          <div className="area-scroll-track" ref={areaScrollTrackRef}>
            {areaGalleryImages.map((src, index) => (
              <div className="area-scroll-item" key={index}>
                <img src={src} alt="Piraeus area" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="residences" className="rhythm-section residence-section"><div className="section-kicker light"><span>04</span><span>The residences</span></div><div className="rhythm-head"><div><p className="eyebrow light">A home for every stage</p><h2>Find your<br /><em>right size.</em></h2></div><p className="body-copy muted-light">A range of residential typologies designed for accessible, contemporary urban living.</p></div><div className="space-switcher residence-switcher" role="tablist" aria-label="Explore residence types">{residences.map((item, index) => <button key={item.name} className={index === activeResidence ? "active" : ""} onClick={() => setActiveResidence(index)} role="tab" aria-selected={index === activeResidence}><span>0{index + 1}</span>{item.name}<ChevronRight size={15} /></button>)}</div><div className="space-feature residence-feature"><div className="space-image"><img key={residence.name} className="slide-media" src={residence.image} alt={`Indicative ${residence.name} residence interior`} /><span className="image-label">{residence.name} / Indicative</span></div><div className="space-copy"><p className="eyebrow light">{residence.size}</p><h3>{residence.name}</h3><p className="body-copy muted-light">{residence.copy}</p><div className="plan-placeholder"><div className="plan-room room-one" /><div className="plan-room room-two" /><div className="plan-room room-three" /><span>Indicative layout</span></div><p className="disclaimer light-disclaimer">Indicative layouts and specifications. Final availability and details are provided upon request.</p></div></div></section>

      <section id="investors" className="investor-section"><div className="section-kicker"><span>05</span><span>Initial investor allocation</span></div><div className="investor-grid"><div><p className="eyebrow">A limited early-investor opportunity</p><h2>Enter early.<br /><em>Think longer.</em></h2><p className="large-copy dark-copy">Approximately 2,500 sqm of selected residential inventory is being made available through a limited network of partners.</p><button className="solid-button terracotta-button" onClick={() => scrollTo("contact")}>Request investor information <ArrowUpRight size={16} /></button></div><div className="opportunity-list"><div><span>01</span><strong>Preferential pre-launch entry pricing</strong><p>Indicative pricing positioned ahead of later public phases, subject to final terms.</p></div><div><span>02</span><strong>Hold for potential rental income</strong><p>A possible strategy for investors seeking a longer-term residential holding.</p></div><div><span>03</span><strong>Potential for later-stage upside</strong><p>Any appreciation is market-dependent and not guaranteed.</p></div><div><span>04</span><strong>Selected inventory, limited release</strong><p>Detailed terms and specific inventory are provided upon request.</p></div></div></div><p className="disclaimer">This is an indicative opportunity summary, not an offer, guarantee or financial advice. Availability, pricing, rental performance and future value are subject to market conditions, final documentation and applicable approvals.</p></section>

      <section className="rationale-section"><div className="section-kicker light"><span>06</span><span>Investment rationale</span></div><div className="rationale-head"><h2>One project.<br /><em>Several paths.</em></h2><p className="body-copy muted-light">A clear, disciplined thesis for engaging with a large-scale residential development at an early stage.</p></div><div className="rationale-grid">{rationale.map(([number, title, copy]) => <div className="rationale-card" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>

      <section className="timeline-section"><div className="section-kicker"><span>07</span><span>Development status</span></div><div className="timeline-head"><div><p className="eyebrow">Indicative timeline</p><h2>From study<br /><em>to delivery.</em></h2></div><p className="body-copy dark-copy">The project is being matured in phases. Dates and milestones will be updated as they are confirmed.</p></div><div className="timeline">{timeline.map((item, index) => <div className={`timeline-item ${index === 0 ? "complete" : ""}`} key={item}><span>{String(index + 1).padStart(2, "0")}</span><i /><strong>{item}</strong><small>{index === 0 ? "Current status" : "Indicative milestone"}</small></div>)}</div></section>

      <section className="developer-section"><div className="section-kicker light"><span>08</span><span>About DKG Development</span></div><div className="developer-grid"><div><p className="eyebrow light">The team behind the opportunity</p><h2>Built on<br /><em>delivery.</em></h2></div><div><p className="large-copy">DKG Development is building a platform for residential, hospitality and investment opportunities, with a focus on thoughtful places and long-term value creation.</p><p className="body-copy muted-light">The developer profile, completed and ongoing projects, total area under development and representative portfolio will be expanded here with confirmed corporate information.</p><button className="text-link light-link" onClick={() => scrollTo("contact")}>Request the developer profile <ArrowUpRight size={17} /></button></div></div><div className="developer-pillars"><div><Leaf size={18} /><span>Residential</span></div><div><Compass size={18} /><span>Hospitality</span></div><div><ArrowUpRight size={18} /><span>Investment</span></div><div><span className="pillar-plus">+</span><span>Greece / International network</span></div></div></section>

      <section id="contact" className="contact-section contact-investor"><div className="contact-mark"><span>PU</span><Leaf size={20} /></div><div className="contact-grid"><div className="contact-content"><p className="eyebrow light">Initial investor allocation</p><h2>Interested in<br /><em>the opportunity?</em></h2><p className="large-copy muted-light">Share a few details and a member of the team will come back to you with the relevant information.</p><a className="contact-link" href="https://wa.me/306900000000" target="_blank" rel="noreferrer">Contact via WhatsApp <ArrowUpRight size={18} /></a></div><form className="investor-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><div className="form-row"><label>Name<input required name="name" placeholder="Your name" /></label><label>Company<input name="company" placeholder="Company name" /></label></div><div className="form-row"><label>Country / market<input name="country" placeholder="Country or market" /></label><label>Email<input required type="email" name="email" placeholder="you@company.com" /></label></div><div className="form-row"><label>Phone / WhatsApp<input name="phone" placeholder="+30 ..." /></label><label>Investor profile<select name="profile" defaultValue=""><option value="" disabled>Select one</option><option>Private investor</option><option>Family office</option><option>Institutional investor</option><option>Partner / advisor</option></select></label></div><label>Indicative interest<textarea name="message" rows={3} placeholder="Tell us what you would like to explore" /></label><div className="form-actions"><button type="submit" className="solid-button">{submitted ? "Request received" : "Request further information"} <ArrowUpRight size={16} /></button><button type="button" className="form-link" onClick={() => window.location.href = "mailto:investors@urbanpiraeusoasis.com"}>Schedule a call</button></div>{submitted && <p className="form-success">Thank you. Your request has been captured for the project team.</p>}<p className="form-note">Your details will be shared with the designated project contact and relevant CRM workflow.</p></form></div><div className="contact-footer"><span>UPO — 01</span><span>© 2026 Urban Piraeus Oasis</span><span>Privacy / Terms</span></div></section>
    </main>
  );
}
