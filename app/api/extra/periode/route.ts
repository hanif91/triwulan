import prismadb from "@/lib/prismadb";

import { NextResponse } from "next/server";
import { PeriodeData } from "@/types/extra";

export async function GET (  req : Request  ) {

  try {
    const periode = await prismadb.periodeposting.findMany({
      where : {
        aktif : "1",
        arsip : "0"
      },
      select : {
        periode : true,
        nama  : true 
      }
    });

    const periodeData : PeriodeData[] = periode; 

    return NextResponse.json(periodeData);

  } catch (error) {
    console.log('[PERIODE_GET]',error);
    return new NextResponse("Internal Error", { status : 500 })

  }
}