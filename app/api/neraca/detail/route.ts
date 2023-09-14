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

interface SumSub {
  sumsub1 : number[],
  sumsub3 : number[],
  sumsub4 : number[]
}

interface SelectParameterValue {
  awaltahun : string,
  bulanini : string,
  bulanlalu : string
}


function getDataBulanIni ( aktiva : any[] ) : AktivaRep[] {


  let aktivaRep : AktivaRep[] = [];
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

  let sumSub : SumSub = {   
    sumsub1 : [],
    sumsub3 : [],
    sumsub4 : []
  } 


  const countAktiva = aktiva.length
  aktiva.map((akt,index) => {
    let thisSub1 = akt.sub1;
    let thisSub3 = akt.sub3;
    let thisSub4 = akt.sub4;

    //footer

    if (thisSub4 !==subReport.sub4) {
      //footer
      if (subReport.sub4 !== "") {
        // insert data footer to array
        const footerSub4 : AktivaRep = { 
          uraian : `Jumlah ${subReport.namasub4}`,
          bulanini : sumSub.sumsub4.reduce((left,right) => { const jml=(left * 1000) + (right * 1000); return jml/1000}).toFixed(2),
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        aktivaRep.push(footerSub4)
      } 
    } 

    if (thisSub3 !==subReport.sub3) {
      //footer
      if (subReport.sub3 !== "") {
        // insert data footer to array
        const footerSub3 : AktivaRep = { 
          uraian : `Jumlah ${subReport.namasub3}`,
          bulanini : sumSub.sumsub3.reduce((left,right) => { const jml=(left * 1000) + (right * 1000); return jml/1000}).toFixed(2),
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        aktivaRep.push(footerSub3)
      } 
    } 
    if (thisSub1 !==subReport.sub1) {
      //footer
      if (subReport.sub1 !== "") {
        // insert data footer to array
        const footerSub1 : AktivaRep = { 
          uraian : `Jumlah ${subReport.namasub1}`,
          bulanini : sumSub.sumsub1.reduce((left,right) => { const jml=(left * 1000) + (right * 1000); return jml/1000}).toFixed(2),
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        
        aktivaRep.push(footerSub1)
      }
    }

    //header
    if (thisSub1 !==subReport.sub1) {
      const headerSub1 : AktivaRep = { 
        uraian : `header ${akt.namasub1}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : ""            
      } 
      aktivaRep.push(headerSub1)
      sumSub.sumsub1 = [];
    }
    if (thisSub3 !==subReport.sub3) {
      const headerSub3 : AktivaRep = { 
        uraian : `header ${akt.namasub3}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : ""            
      } 
      aktivaRep.push(headerSub3)
      sumSub.sumsub3 = [];
    } 
    if (thisSub4 !==subReport.sub4) {
      const headerSub4 : AktivaRep = { 
        uraian : `header ${akt.namasub4}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : ""            
      } 
      aktivaRep.push(headerSub4)
      sumSub.sumsub4 = [];
    } 

    // console.log(akt.bulanini);
    const dataUraian : AktivaRep = { 
      uraian : `${akt.nama}`,
      bulanini : akt.blnini,
      bulanlalu : akt.blnlalu,
      lebihkurang : "",    
      persentase : akt.persentase            
    } 
    aktivaRep.push(dataUraian)
    
    // sumvalue
    sumSub.sumsub1.push(akt.blnini)
    sumSub.sumsub3.push(akt.blnini)
    sumSub.sumsub4.push(akt.blnini)

    //footer last value
    if ((index+1) === countAktiva) {


        const footerSub4 : AktivaRep = { 
          uraian : `Jumlah ${akt.namasub4}`,
          bulanini : sumSub.sumsub4.reduce((left,right) => { const jml=(left * 1000) + (right * 1000); return jml/1000}).toFixed(2),
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        aktivaRep.push(footerSub4)

        const footerSub3 : AktivaRep = { 
          uraian : `Jumlah ${akt.namasub3}`,
          bulanini : sumSub.sumsub3.reduce((left,right) => { const jml=(left * 1000) + (right * 1000); return jml/1000}).toFixed(2),
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        aktivaRep.push(footerSub3)

        const footerSub1 : AktivaRep = { 
          uraian : `Jumlah ${subReport.namasub1}`,
          bulanini : sumSub.sumsub1.reduce((left,right) => { const jml=(left * 1000) + (right * 1000); return jml/1000}).toFixed(2),
          bulanlalu : "",
          lebihkurang : "",    
          persentase : ""            
        } 
        
        aktivaRep.push(footerSub1)

    }


    subReport.namasub4 = akt.namasub4;

    subReport.sub4 = thisSub4;
    subReport.namasub4 = akt.namasub4;

    subReport.sub3 = thisSub3;
    subReport.namasub3 = akt.namasub3;

    subReport.sub1 = thisSub1;
    subReport.namasub1 = akt.namasub1;


  });

  return aktivaRep;
}



export async function GET (  req : NextRequest  ) {
  
  try {
    const username = 'admin';
    const periode = req.nextUrl.searchParams.get("periode");
    const tanggalreport = req.nextUrl.searchParams.get("tanggalreport");
    const spilitPeriode = periode?.split(" ");
    const keyPeriode = `${spilitPeriode?.[0]}${spilitPeriode?.[1]}`
    // const triwulan : string = spilitPeriode[2]
    // console.log(spilitPeriode?.[2]);
    const parameterValue = {
      TRIWULANI : {
        awaltahun : `${spilitPeriode?.[2]}-01-01`,
        bulanini : `${spilitPeriode?.[2]}-03-31`,
        bulanlalu : `${spilitPeriode?.[2]}-03-31`
      },
      TRIWULANII : {
        awaltahun : `${spilitPeriode?.[2]}-01-01`,
        bulanini : `${spilitPeriode?.[2]}-06-30`,
        bulanlalu : `${spilitPeriode?.[2]}-06-30`
      },
      TRIWULANIII : {
        awaltahun : `${spilitPeriode?.[2]}-01-01`,
        bulanini : `${spilitPeriode?.[2]}-09-30`,
        bulanlalu : `${spilitPeriode?.[2]}-09-30`
      },
      TRIWULANIV : {
        awaltahun : `${spilitPeriode?.[2]}-01-01`,
        bulanini : `${spilitPeriode?.[2]}-12-31`,
        bulanlalu : `${spilitPeriode?.[2]}-12-31`
      },
    }
    let selectParamValue : SelectParameterValue  = {
      awaltahun : "",
      bulanini : "",
      bulanlalu : ""
    }
    for (const [key, value] of Object.entries(parameterValue)) {
      if (key === keyPeriode) {
        selectParamValue = value;
        break;
      }
    }

    let selectParamValueBlnlalu : SelectParameterValue | null  = {
      awaltahun : "",
      bulanini : "",
      bulanlalu : ""
    }
    let lastvalue : SelectParameterValue  = {
      awaltahun : "",
      bulanini : "",
      bulanlalu : ""
    }
    Object.entries(parameterValue).forEach((curValue,index) => {
      if (curValue[0] === keyPeriode) {
        if (index === 0) {
          selectParamValueBlnlalu = null
        } else {
          selectParamValueBlnlalu = lastvalue;
        }
      }
      lastvalue = curValue[1];

    })
    console.log(selectParamValue);
    console.log(selectParamValueBlnlalu);
      

    const exeNrc : number   = await prismadb.$executeRaw`CALL ex_nrc_detail(${selectParamValue.awaltahun},${selectParamValue.bulanini},${selectParamValue.bulanlalu},${username});` 
    const aktivaBlnIni : any[] = await prismadb.$queryRaw(
      Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="AKTIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
    )
    const pasivaBlnIni : any[] = await prismadb.$queryRaw(
      Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="PASIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
    )

  
    
  
    
    let dataBulanIni : AktivaRep[] = getDataBulanIni(aktivaBlnIni) 
    // bulan ini,
 
    // console.log(pasiva);
  
    console.log(periode,tanggalreport);
    return NextResponse.json(dataBulanIni,{status : 200})    
  } catch (error) {
    return NextResponse.json(error,{status : 400})    
  }
  
}