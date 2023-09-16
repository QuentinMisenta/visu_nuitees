import {NextResponse} from "next/server";
import prisma from "../../../client";

/**
 This route is used to get the number of nights spent in a given canton, for a given year and month.
 The route is called with the following parameters:
 @params cantons:
  - cantons[0]: the canton name
  - cantons[1]: the beginning year
  - cantons[2]: the ending year
  - cantons[3]: the beginning month
  - cantons[4]: the ending month
  it uses a foreign key to filter the communes to get only the data concerning the communes
  located in the selected canton
 @returns {Object} - The data.
 */
export async function GET(request, {params}) {
    const data = await prisma.nuitees_communes.groupBy({
        by: ["Commune"],
        where: {
            Ann_e: {
                gte: parseInt(params.cantons[1]),
                lte: parseInt(params.cantons[2]),
            },
            Mois: {
                gte: parseInt(params.cantons[3]),
                lte: parseInt(params.cantons[4]),
            },
            liste_communes: {
                gdektna: params.cantons[0],
            },
        },
        _sum: {
            Pays_de_provenance___total_Nuit_es: true,
        },
    });
    return NextResponse.json(data);
}
