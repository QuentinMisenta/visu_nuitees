import fsPromises from "fs/promises";
import path from "path";
import {NextResponse} from "next/server";
import * as turf from "@turf/turf";
import fs from "fs";

const dataFilePath = path.join(
    process.cwd(),
    "/swissBOUNDARIES3D_1_3_TLM_KANTONSGEBIET.geojson"
);

const dataCommunesFilePath = path.join(
    process.cwd(),
    "/swissBOUNDARIES3D_1_3_TLM_HOHEITSGEBIET.geojson"
);

/**
 * Simplifies the features of a GeoJSON file and caches the result in a file with the name of the canton.
 * @param {Object} json - The JSON object containing the features to simplify.
 * @param {string} json.fileName - The name of the file to cache the result.
 * @param {Object[]} json.features - The features to simplify.
 * @param {number} json.tolerance - The tolerance to use for the simplification.
 * @returns {Object} - The simplified GeoJSON object.
 */
async function simplifiedFeatures(json) {
    // The path to the cache file
    const cacheFilePath = path.join(process.cwd(), `json/${json.fileName}`);
    let simplifiedJson;
    let cacheExists;
    // Check if the cache file exists
    try {
        await fsPromises.access(cacheFilePath, fs.constants.F_OK);
        cacheExists = true;
    } catch (error) {
        cacheExists = false;
    }
    // If the cache file exists, check if the canton is already cached
    if (cacheExists) {
        const cacheData = await fsPromises.readFile(cacheFilePath);
        const cache = JSON.parse(cacheData);
        if (cache[json.fileName]) {
            simplifiedJson = cache[json.fileName];
        }
    }
    // If the canton is not cached, simplify the features and cache the result
    if (!simplifiedJson) {
        const simplifiedFeatures = json.features.map((feature) => {
            const simplifiedGeometry = turf.simplify(feature.geometry, {
                tolerance: json.tolerance,
                highQuality: true,
            });
            return {...feature, geometry: simplifiedGeometry};
        });

        simplifiedJson = {
            type: "FeatureCollection",
            features: simplifiedFeatures,
        };
        // Create the cache file if it does not exist
        try {
            await fsPromises.access(
                cacheFilePath,
                fs.constants.F_OK
            );
            cacheExists = true; // if no error, file exists
        } catch (error) {
            cacheExists = false; // if error, file does not exist
        }
        // If the cache file does not exist, create it
        if (!cacheExists) {
            await fsPromises.writeFile(cacheFilePath, "{}");
        }
        // Read the cache file and add the canton to the cache
        const cacheData = await fsPromises.readFile(cacheFilePath);
        const cache = JSON.parse(cacheData);
        cache[json.fileName] = simplifiedJson;
        await fsPromises.writeFile(cacheFilePath, JSON.stringify(cache));
    }

    return simplifiedJson;
}

/**
 * Gets the data for a given canton.
 * @param canton
 * @returns {Promise<{simplifiedCommuneJsonData: {features: (*&{geometry: *})[], type: string},
 * simplifiedGeoJsonData: {features: (*&{geometry: *})[], type: string}}>} the data for the canton and its communes.
 */

async function getData(canton) {
    let simplifiedGeoJsonData, simplifiedCommuneJsonData;
    // Read the GeoJSON file and simplify the features
    try {
        const jsonData = await fsPromises.readFile(dataFilePath);
        const communeData = await fsPromises.readFile(dataCommunesFilePath);

        const geoJsonData = JSON.parse(jsonData);
        const communeJsonData = JSON.parse(communeData);
        simplifiedGeoJsonData = await simplifiedFeatures({
            fileName: `${canton.replace(/ /g, "_")}.json`,
            features: geoJsonData.features,
            tolerance: 0.001,
        });
        simplifiedCommuneJsonData = await simplifiedFeatures({
            fileName: `${canton.replace(/ /g, "_")}_communes.json`,
            features: communeJsonData.features,
            tolerance: 0.001,
        });
    } catch (error) {
        console.error(error);
    }

    return {simplifiedGeoJsonData, simplifiedCommuneJsonData};
}

/**
 * This route is used to get the GeoJSON data for a given canton.
 *
 *
 * @param request - unused parameter but does not work if not written.
 * @param params - The canton name.
 * @returns {Promise<NextResponse<{features: *[], type: string}>>} - The GeoJSON data for the canton.
 */
export async function GET(request, {params}) {
    const {simplifiedGeoJsonData, simplifiedCommuneJsonData} = await getData(
        params.canton
    );
    // If the canton is Switzerland, return the simplified GeoJSON data only for the cantons
    if (params.canton === "Suisse") {
        return NextResponse.json(simplifiedGeoJsonData);
        // If the canton is not Switzerland, return the simplified GeoJSON data for the canton and its communes
    } else {
        const cantonData = simplifiedGeoJsonData.features.filter(
            (feature) => feature.properties.NAME === params.canton
        );
        const communeData = simplifiedCommuneJsonData.features.filter(
            (feature) =>
                feature.properties.KANTONSNUM === cantonData[0].properties.KANTONSNUM
        );
        // Merge the data for the canton and its communes
        const mergedGeoJsonData = {
            type: "FeatureCollection",
            features: [...cantonData, ...communeData],
        };

        return NextResponse.json(mergedGeoJsonData);
    }
}
