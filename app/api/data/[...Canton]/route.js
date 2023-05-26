import { NextResponse } from "next/server";
import prisma from "../../../../client";

export async function GET(request, { params }) {
  if (params.Canton[params.Canton.length - 1] == "aggregate") {
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
  } else {
    const data = await prisma.nuitees_cantons.findMany({
      select: {
        Ann_e: true,
        Mois: true,
        Pays_de_provenance___total_Arriv_es: true,
        Pays_de_provenance___total_Nuit_es: true,
        Suisse_Arriv_es: true,
        Suisse_Nuit_es: true,
      },
      where: {
        Canton: params.Canton[0],
        Ann_e: {
          gte: parseInt(params.Canton[1]),
          lte: parseInt(params.Canton[2]),
        },
        Mois: {
          gte: parseInt(params.Canton[3]),
          lte: parseInt(params.Canton[4]),
        },
      },
    });
    return NextResponse.json(data);
  }
}
