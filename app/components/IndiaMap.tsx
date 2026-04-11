"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/udit-001/india-maps-data/main/topojson/india.json";

interface IndiaMapProps {
  onStateClick: (stateId: string, stateName: string) => void;
}

export default function IndiaMap({ onStateClick }: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Custom mapping for statename to ID. 
  // TopoJSON often has its own ID formats or name formats, so we handle it dynamically
  const handleStateClick = (geo: any) => {
    const stateName = geo.properties.st_nm || geo.properties.NAME_1 || geo.properties.name || "Unknown";
    let stateId = "UNKNOWN";

    if (stateName === "Odisha" || stateName === "Orissa") stateId = "OR";
    // For others, if we want strict mapping we can do it, otherwise use Name
    else stateId = stateName?.substring(0, 2).toUpperCase() || "UN";

    onStateClick(stateId, stateName);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto drop-shadow-xl">
      {hoveredState && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md font-outfit text-gray-800 pointer-events-none transition-opacity font-semibold z-10 border border-gray-100">
          {hoveredState}
        </div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [82.8, 22.5] // Center over India
        }}
        className="w-full h-auto p-4 bg-white rounded-[2rem] border border-gray-50/50"
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.st_nm || geo.properties.NAME_1 || geo.properties.name || "Unknown";
              const isOdisha = stateName === "Odisha" || stateName === "Orissa"; // Emphasizing Odisha since we have demo items
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredState(stateName)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick(geo)}
                  style={{
                    default: {
                      fill: isOdisha ? "#fbdaba" : "#f1f3f5", // Light amber for Odisha, otherwise ultra-light grey
                      stroke: "#e5e7eb",
                      strokeWidth: 0.75,
                      outline: "none",
                      transition: "all 250ms",
                    },
                    hover: {
                      fill: "var(--accent)", // Amber 600
                      stroke: "#ffffff",
                      strokeWidth: 1.5,
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 250ms",
                    },
                    pressed: {
                      fill: "var(--accent-hover)", // Amber 700
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
