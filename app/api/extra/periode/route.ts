import prismadb from "@/lib/prismadb";

import { NextResponse } from "next/server";
import { PeriodeData } from "@/types/extra";
import { Prisma } from "@prisma/client";


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
      },
      orderBy : {
        periode : 'desc'
      }
    });

    // let periodeData : PeriodeData[];
    const groupperiode : any[] = await prismadb.$queryRaw(
      Prisma.sql`SELECT DISTINCT(LEFT(periode,4)) as tahun FROM periodeposting where aktif="1" and arsip="0" order by periode desc` 
    )

    groupperiode.map((tahun) => {
      for (let i = 0; i < 4 ; i++) {
        for (let ii = 0; ii < 3 ; ii++) {
          
        }
        
      }

    })
     

    const periodeData : PeriodeData[] = periode; 

    return NextResponse.json(groupperiode);

  } catch (error) {
    console.log('[PERIODE_GET]',error);
    return new NextResponse("Internal Error", { status : 500 })

  }
}