/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

let mapsScriptPromise: Promise<void> | null = null;

function loadMapScript() {
  if (window.google?.maps) return Promise.resolve();
  if (!API_KEY) return Promise.reject(new Error("VITE_GOOGLE_MAPS_API_KEY is not set"));
  if (!mapsScriptPromise) {
    mapsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        mapsScriptPromise = null;
        reject(new Error("Failed to load Google Maps script"));
      };
      document.head.appendChild(script);
    });
  }
  return mapsScriptPromise;
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  styles?: google.maps.MapTypeStyle[];
  onMapReady?: (map: google.maps.Map) => void;
  onError?: () => void;
}

export function MapView({
  className,
  initialCenter = { lat: 37.9421, lng: 23.6462 },
  initialZoom = 15,
  styles,
  onMapReady,
  onError,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);

  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
    } catch (error) {
      console.error("[LocationMap]", error instanceof Error ? error.message : error);
      onError?.();
      return;
    }
    if (!mapContainer.current || !window.google) return;
    try {
      map.current = new window.google.maps.Map(mapContainer.current, {
        zoom: initialZoom,
        center: initialCenter,
        disableDefaultUI: true,
        zoomControl: true,
        styles,
      });
      onMapReady?.(map.current);
    } catch (error) {
      console.error("[LocationMap] failed to initialize map", error);
      onError?.();
    }
  });

  useEffect(() => {
    init();
  }, [init]);

  return <div ref={mapContainer} className={cn("w-full h-full", className)} />;
}
