import { NextResponse } from "next/server";
import prisma from "../../../client";

export async function GET(request, { params }) {
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
