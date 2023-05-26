import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import * as turf from "@turf/turf";

const dataFilePath = path.join(
  process.cwd(),
  "json/swissBOUNDARIES3D_1_3_TLM_KANTONSGEBIET.geojson"
);

export async function GET() {
  const jsonData = await fsPromises.readFile(dataFilePath);
  const geoJsonData = JSON.parse(jsonData);

  const simplifiedFeatures = geoJsonData.features.map((feature) => {
    const simplifiedGeometry = turf.simplify(feature.geometry, {
      tolerance: 0.002,
      highQuality: true,
    });
    return { ...feature, geometry: simplifiedGeometry };
  });

  const simplifiedGeoJsonData = {
    ...geoJsonData,
    features: simplifiedFeatures,
  };
  return NextResponse.json(simplifiedGeoJsonData);
}
