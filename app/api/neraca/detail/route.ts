import { NextRequest,NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prismadb from "@/lib/prismadb";

interface AktivaRep {
  uraian : string,
  bulanini : number | string,
  bulanlalu : number | string,
  lebihkurang : number | string,    
  persentase : number | string   
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
    namasub1 : "", 
    namasub3 : "",
    namasub4 : "",
    sumSub1 : 0,
    sumSub3 : 0,   
    sumSub4 : 0,
  } 



  aktiva.map((akt) => {
    let thisSub1 = akt.sub1;
    let thisSub3 = akt.sub3;
    let thisSub4 = akt.sub4;
    if (thisSub1 !==subReport.sub1) {
      //footer
      if (subReport.sub1 !== "") {
        // insert data footer to array
        const footerSub1 : AktivaRep = { 
          uraian : `footer ${subReport.namasub1}`,
          bulanini : "",
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        
        aktivaRep.push(footerSub1)
      } 

      //Header

      const headerSub1 : AktivaRep = { 
        uraian : `header ${akt.namasub1}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : ""            
      } 
      aktivaRep.push(headerSub1)

      console.log('test sub1');
    }
    if (thisSub3 !==subReport.sub3) {
      //footer
      if (subReport.sub3 !== "") {
        // insert data footer to array
        const footerSub3 : AktivaRep = { 
          uraian : `footer ${subReport.namasub3}`,
          bulanini : "",
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        aktivaRep.push(footerSub3)
      } 

      //Header
      const headerSub3 : AktivaRep = { 
        uraian : `header ${akt.namasub3}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : ""            
      } 
      aktivaRep.push(headerSub3)
      console.log('test sub3');
    } 
    if (thisSub4 !==subReport.sub4) {
      //footer
      if (subReport.sub4 !== "") {
        // insert data footer to array
        const footerSub4 : AktivaRep = { 
          uraian : `footer ${subReport.namasub4}`,
          bulanini : "",
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        aktivaRep.push(footerSub4)
      } 

      //Header
      const headerSub4 : AktivaRep = { 
        uraian : `header ${akt.namasub4}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : ""            
      } 
      aktivaRep.push(headerSub4)
      console.log('test sub4');

    } 

    const dataUraian : AktivaRep = { 
      uraian : `${akt.nama}`,
      bulanini : "",
      bulanlalu : "",
      lebihkurang : "",    
      persentase : ""            
    } 

    aktivaRep.push(dataUraian)
    subReport.namasub4 = akt.namasub4;

    subReport.sub4 = thisSub4;
    subReport.namasub4 = akt.namasub4;

    subReport.sub3 = thisSub3;
    subReport.namasub3 = akt.namasub3;

    subReport.sub1 = thisSub1;
    subReport.namasub1 = akt.namasub1;
  });


  
  
  // console.log(pasiva);
  const periode = req.nextUrl.searchParams.get("periode");
  const tanggalreport = req.nextUrl.searchParams.get("tanggalreport");

  console.log(periode,tanggalreport);
  return NextResponse.json(aktivaRep)
}