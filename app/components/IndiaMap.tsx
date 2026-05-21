"use client";

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid, geoArea } from "d3-geo";
import { feature } from "topojson-client";
import indiaMapData from "./india.json";

interface GeoProperties {
  st_nm?: string;
  NAME_1?: string;
  name?: string;
}

interface GeoObject {
  properties: GeoProperties;
  rsmKey?: string;
  [key: string]: any;
}

interface IndiaMapProps {
  onStateClick: (stateId: string, stateName: string) => void;
}

// Safely extract geography data supporting both direct JSON and ES Module default wrapping
const getGeographyData = () => {
  try {
    const rawData = (indiaMapData as any).default || indiaMapData;
    if (rawData && rawData.objects && rawData.objects.states) {
      return feature(rawData, rawData.objects.states as any);
    }
    console.error("Invalid TopoJSON structure in india.json:", rawData);
    return null;
  } catch (err) {
    console.error("Error parsing india.json:", err);
    return null;
  }
};

const geographyData = getGeographyData();

export default function IndiaMap({ onStateClick }: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Custom mapping for statename to ID. 
  // TopoJSON often has its own ID formats or name formats, so we handle it dynamically
  const handleStateClick = (geo: GeoObject) => {
    const stateName = geo.properties.st_nm || geo.properties.NAME_1 || geo.properties.name || "Unknown";
    let stateId = "UNKNOWN";

    if (stateName === "Odisha" || stateName === "Orissa") stateId = "OR";
    // For others, if we want strict mapping we can do it, otherwise use Name
    else stateId = stateName?.substring(0, 2).toUpperCase() || "UN";

    onStateClick(stateId, stateName);
  };

  if (!geographyData) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center text-[#380903]/70 font-semibold font-playfair text-xl">
        Map Error: Failed to parse coordinates.
      </div>
    );
  }

  return (
    <div className="relative w-full self-stretch aspect-[4/3] min-h-[300px] sm:min-h-0 max-w-[80vh] lg:max-w-3xl mx-auto drop-shadow-xl shrink-0">
      {hoveredState && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 md:top-6 bg-white/95 backdrop-blur-sm px-6 py-2 rounded-xl shadow-[0_4px_20px_rgba(56,9,3,0.15)] font-playfair text-[#380903] pointer-events-none transition-opacity font-bold z-10 border border-[#FFE170]/50 text-xl tracking-wide text-center min-w-[150px]">
          {hoveredState}
        </div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1050,
          center: [82.8, 22.5] // Center over India
        }}
        className="absolute inset-0 w-full h-full p-4 bg-transparent"
      >
        <Geographies geography={geographyData}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => {
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
                        fill: isOdisha ? "#FCF3D7" : "#FAF3E7", // Lighter yellow for Odisha, off-white for others
                        stroke: "rgba(56, 9, 3, 0.45)", // Higher opacity border for better mobile visibility
                        strokeWidth: 0.8, // Slightly thicker stroke to prevent Retina anti-aliasing collapse
                        outline: "none",
                        transition: "all 250ms",
                      },
                      hover: {
                        fill: "#FFE170", // New yellow hover text/button color
                        stroke: "#380903",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 250ms",
                      },
                      pressed: {
                        fill: "#FFD100", // Darker yellow for pressed state
                        outline: "none",
                      },
                    }}
                  />
                );
              })}
              {(() => {
                // Many topological maps split states into districts or multiple polygons. 
                // We calculate the largest sub-region for each state to center the label correctly once per state.
                const largestGeoByState = new Map<string, { geo: GeoObject; area: number }>();
                
                geographies.forEach((geo) => {
                  const stateName = geo.properties.st_nm || geo.properties.NAME_1 || geo.properties.name || "";
                  if (!stateName) return;
                  const area = geoArea(geo);
                  const existing = largestGeoByState.get(stateName);
                  if (!existing || area > existing.area) {
                    largestGeoByState.set(stateName, { geo, area });
                  }
                });

                return Array.from(largestGeoByState.values()).map(({ geo }) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const centroid = geoCentroid(geo as any);
                  const stateName = geo.properties.st_nm || geo.properties.NAME_1 || geo.properties.name || "";
                  
                  // Filter out unwanted small UTs/cities (Keep Delhi)
                  const isExcluded = ["Chandigarh", "Puducherry", "Lakshadweep", "Andaman", "Dadra", "Daman", "Nicobar"].some(ignored => stateName.includes(ignored));
                  if (isExcluded && !stateName.includes("Delhi")) return null;

                  // Keep name short so they don't overlap dangerously
                  const shortName = stateName.replace(" and ", " & ").split(" ")[0];
                  
                  return (
                    <Marker key={`${geo.rsmKey}-label`} coordinates={centroid}>
                      <text
                        y={2}
                        fontSize={11}
                        textAnchor="middle"
                        fill="rgba(56, 9, 3, 0.75)" // Higher contrast label color
                        className="font-playfair font-bold"
                        style={{ 
                          pointerEvents: "none", 
                          textShadow: "1px 1px 0px #FAF3E7, -1px -1px 0px #FAF3E7, 1px -1px 0px #FAF3E7, -1px 1px 0px #FAF3E7" // Knockout matching body background rather than pure white
                        }}
                      >
                        {shortName}
                      </text>
                    </Marker>
                  );
                });
              })()}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </div>
  );
}
