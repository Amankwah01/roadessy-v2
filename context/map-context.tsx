// map-context.ts
import { createContext, useContext } from "react";

export const MapContext = createContext<MapContextType>({map: null});

export interface MapContextType {
  map: maplibregl.Map | null;
}


export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
