import {NextResponse} from "next/server";
import prisma from "../../../../client";

/**
 This route is used to get the number of nights spent in a given canton, for a given year and month interval.
 it does not select the aggregated data for the whole switzerland since it is already counted in the cantons.
 The route is called with the following parameters:
 @params Canton:
  - Canton[0]: the canton name
  - Canton[1]: the beginning year
  - Canton[2]: the ending year
  - Canton[3]: the beginning month
  - Canton[4]: the ending month
 @returns {Object} - The aggregated data.
 */
export async function GET(request, {params}) {
    const dataAgg = await prisma.nuitees_cantons.groupBy({
        by: ["Canton"],
        where: {
            Ann_e: {
                gte: parseInt(params.Canton[1]),
                lte: parseInt(params.Canton[2]),
            },
            Mois: {
                gte: parseInt(params.Canton[3]),
                lte: parseInt(params.Canton[4]),
            },
            Canton: {
                not: "Suisse",
            },
        },
        _sum: {
            Pays_de_provenance___total_Nuit_es: true,
        },
    });
    return NextResponse.json(dataAgg);

}
