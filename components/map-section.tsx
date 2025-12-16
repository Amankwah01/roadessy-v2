"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";


export function Map({height}: {height?: string}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // prevent duplicate initialization
    if (map.current || !mapContainerRef.current) return;

    map.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
      center: [-1.630783, 6.700071],
      zoom: 12,
      logoPosition: "bottom-right",
    });

    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true,
      }),
      "bottom-right"
    );

    map.current.on("load", () => {
      setLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* This is the actual map container */}
      <div ref={mapContainerRef} className="w-full h-full rounded-2xl" />

      {/* UI overlay layer
      <div className="w-full h-full pointer-events-none">
        <MapContext.Provider value={{ map: map.current }}>
          {children}
        </MapContext.Provider>
      </div> */}

      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-200 pointer-events-auto">
          <div className="text-lg font-medium dark:text-white">Loading map...</div>
        </div>
      )}
    </div>
  );
}
