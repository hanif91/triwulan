import { NextRequest,NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prismadb from "@/lib/prismadb";

interface AktivaRep {
  uraian : string,
  bulanini : number,
  bulanlalu : number,
  lebihkurang : number,    
  persentase : number   
}

export async function GET (  req : NextRequest  ) {
  

  const username = 'admin';



  let aktivaRep : AktivaRep[] = [];
  const exeNrc : number   = await prismadb.$executeRaw`CALL ex_nrc_detail("2023-01-01","2023-03-31","2023-03-31","admin");` 

  const aktiva : any[] = await prismadb.$queryRaw(
    Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="AKTIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
  )
  const pasiva : any[] = await prismadb.$queryRaw(
    Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="PASIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
  )
  
  let subReport = {
    sub1 : "", 
    sub3 : "",
    sub4 : "",
  } 

  aktiva.map((akt) => {
    let thisSub1 = akt.sub1;
    let thisSub3 = akt.sub3;
    let thisSub4 = akt.sub4;
    if (thisSub1 !==subReport.sub1) {
      console.log('test sub1');
      subReport.sub1 = thisSub1;
    }
    if (thisSub3 !==subReport.sub3) {
      console.log('test sub3');
      subReport.sub3 = thisSub3;
    } 
    if (thisSub4 !==subReport.sub4) {
      console.log('test sub4');
      subReport.sub4 = thisSub4;
    } 

  });


  
  
  // console.log(pasiva);
  const periode = req.nextUrl.searchParams.get("periode");
  const tanggalreport = req.nextUrl.searchParams.get("tanggalreport");

  console.log(periode,tanggalreport);
  return NextResponse.json({ message : "Tes Neraca" })
}