import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import * as turf from "@turf/turf";

const dataFilePath = path.join(
  process.cwd(),
  "json/swissBOUNDARIES3D_1_3_TLM_KANTONSGEBIET.geojson"
);

const dataCommunesFilePath = path.join(
  process.cwd(),
  "json/swissBOUNDARIES3D_1_3_TLM_HOHEITSGEBIET.geojson"
);

export async function GET(request, { params }) {
  const jsonData = await fsPromises.readFile(dataFilePath);
  const communeData = await fsPromises.readFile(dataCommunesFilePath);

  const geoJsonData = JSON.parse(jsonData);
  const communeJsonData = JSON.parse(communeData);

  function simplifiedFeatures(json) {
    const simplifiedFeatures = json.features.map((feature) => {
      const simplifiedGeometry = turf.simplify(feature.geometry, {
        tolerance: params.canton === "Suisse" ? 0.003 : 0.001,
        highQuality: true,
      });
      return { ...feature, geometry: simplifiedGeometry };
    });

    const simplifiedJson = {
      type: "FeatureCollection",
      features: simplifiedFeatures,
    };
    return simplifiedJson;
  }
  const simplifiedGeoJsonData = simplifiedFeatures(geoJsonData);
  const simplifiedcommuneJsonData = simplifiedFeatures(communeJsonData);
  if (params.canton == "Suisse") {
    return NextResponse.json(simplifiedGeoJsonData);
  } else {
    const cantonData = simplifiedGeoJsonData.features.filter(
      (feature) => feature.properties.NAME === params.canton
    );
    const communeData = simplifiedcommuneJsonData.features.filter(
      (feature) =>
        feature.properties.KANTONSNUM === cantonData[0].properties.KANTONSNUM
    );

    const cantonGeoJsonData = {
      type: "FeatureCollection",
      features: [...cantonData, ...communeData],
    };

    return NextResponse.json(cantonGeoJsonData);
  }
}
