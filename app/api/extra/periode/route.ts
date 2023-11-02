import prismadb from "@/lib/prismadb";

import { NextResponse } from "next/server";
import { PeriodeData,PeriodeTriwulan } from "@/types/extra";
import { Prisma } from "@prisma/client";



export async function GET (  req : Request  ) {

  try {
    const periode = await prismadb.periodeposting.findMany({
      orderBy : [
        {
          periode : "asc",
        }
      ],
      where : {
        aktif : "1",
        arsip : "0"
      },
      select : {
        periode : true,
        nama  : true 
      },
 
    });

    // let periodeData : PeriodeData[];
    const groupperiode : any[] = await prismadb.$queryRaw(
      Prisma.sql`SELECT DISTINCT(LEFT(periode,4)) as tahun FROM periodeposting where aktif="1" and arsip="0" order by periode desc` 
    )

    let periodeTriwulan : PeriodeTriwulan[] = [];

    groupperiode.map((tahun) => {
      let flagtriwulan1 : number=0;
      let flagtriwulan2 : number=0;
      let flagtriwulan3 : number=0;
      let flagtriwulan4 : number = 0;
      for (let i = 12; i > 0 ; i--) {
        
        if (i <= 12 && i >=10) {
          let strBln = String(i).padStart(2,'0');
          let periodeFind = periode.find((per) => per.periode == `${tahun.tahun}${strBln}` )
          
          if (periodeFind) {
          
            flagtriwulan4++
          }
    
        }

        if (i <= 9 && i >=7) {
          let strBln = String(i).padStart(2,'0');

          let periodeFind = periode.find((per) => per.periode == `${tahun.tahun}${strBln}` )
          if (periodeFind) {

            flagtriwulan3++
          }
    
        }

        if (i <= 6 && i >=4) {
          let strBln = String(i).padStart(2,'0');

          let periodeFind = periode.find((per) => per.periode == `${tahun.tahun}${strBln}` )
   
          if (periodeFind) {
            flagtriwulan2++
          }
    
        }
        if (i <= 3 && i >=1) {
          let strBln = String(i).padStart(2,'0');

          let periodeFind = periode.find((per) => per.periode == `${tahun.tahun}${strBln}` )
   
          if (periodeFind) {
            flagtriwulan1++
          }
    
        }
      }

      if(flagtriwulan4 == 3) {
        const triwulan4 : PeriodeTriwulan = { nama : `TRIWULAN IV ${tahun.tahun}`,valuetriwulan : `TRIWULAN IV ${tahun.tahun}`}
        periodeTriwulan.push(triwulan4)
      }

      if(flagtriwulan3 == 3) {
        const triwulan3 : PeriodeTriwulan = { nama : `TRIWULAN III ${tahun.tahun}`,valuetriwulan :  `TRIWULAN III ${tahun.tahun}`}
        periodeTriwulan.push(triwulan3)
      }

      if(flagtriwulan2 == 3) {
        const triwulan2 : PeriodeTriwulan = { nama : `TRIWULAN II ${tahun.tahun}`,valuetriwulan : `TRIWULAN II ${tahun.tahun}`}
        periodeTriwulan.push(triwulan2)
      }

      if(flagtriwulan1 == 3) {
        const triwulan1 : PeriodeTriwulan = { nama : `TRIWULAN I ${tahun.tahun}`,valuetriwulan : `TRIWULAN I ${tahun.tahun}`}
        periodeTriwulan.push(triwulan1)
      }
    })
    return NextResponse.json(periodeTriwulan);

  } catch (error) {
    console.log('[PERIODE_GET]',error);
    return new NextResponse("Internal Error", { status : 500 })

  }
}