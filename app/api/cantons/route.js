import {NextResponse} from "next/server";
import prisma from "../../../client";

export async function GET() {
    const cantons = await prisma.nuitees_cantons.findMany({
        select: {
            Canton: true,
        },
    distinct: ['Canton'],
});
    return NextResponse.json(cantons);
}