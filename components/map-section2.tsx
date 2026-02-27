"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function Map({
  height = "80dvh",
  center = [-1.630783, 6.700071],
  zoom = 12,
}: {
  height?: string | number;
  center?: [number, number];
  zoom?: number;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // prevent duplicate initialization
    if (map.current || !mapContainerRef.current) return;

    map.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
      center,
      zoom,
      logoPosition: "bottom-right",
    });

    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true,
      }),
      "bottom-right",
    );

    map.current.on("error", (e) => {
      console.error("Map error:", e);
      setError(e.error?.message || "Failed to load map");
    });

    map.current.on("load", async () => {
      if (!map.current) return;

      try {
        // Fetch roads data from server API
        const response = await fetch("/api/roads");
        if (!response.ok) throw new Error("Failed to fetch roads");
        const roadsData = await response.json();

        // Prevent duplicate source
        if (!map.current.getSource("road")) {
          map.current.addSource("road", {
            type: "geojson",
            data: roadsData,
          });
        }

        // Prevent duplicate layer
        if (!map.current.getLayer("roads-layer")) {
          map.current.addLayer({
            id: "roads-layer",
            type: "line",
            source: "road",
            paint: {
              "line-width": 3,
              "line-color": "#ff5a1f",
            },
          });
        }

        setLoaded(true);
      } catch (err) {
        console.error("Failed to load roads:", err);
        setError("Failed to load roads data");
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* This is the actual map container */}
      <div ref={mapContainerRef} className="w-full h-full rounded-2xl" />

      {/* Loading overlay */}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50 pointer-events-auto">
          <div className="text-lg font-medium dark:text-white">
            Error: {error}
          </div>
        </div>
      ) : !loaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50 pointer-events-auto">
          <div className="text-lg font-medium dark:text-white">
            Loading map...
          </div>
        </div>
      ) : null}
    </div>
  );
}
