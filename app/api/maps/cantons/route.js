import fsPromises from 'fs/promises';
import path from 'path';
import {NextResponse} from "next/server";

const dataFilePath = path.join(process.cwd(), 'json/swissBOUNDARIES3D_1_3_TLM_KANTONSGEBIET.geojson');
export async function GET() {
    const jsonData = await fsPromises.readFile(dataFilePath);
    const objectData = JSON.parse(jsonData);
    return NextResponse.json(objectData);
}