import { NextRequest,NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { cariPersentase, fltoNum, numtoFl,formatNumber } from "@/lib/utils";
import { GenTTD,GenLr1,GenLr2,GenLr3 } from "@/lib/utils-db";
import { LrfirstStep, LrlastStep, RepLr,FinalResponse } from "@/types/replabarugi";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next";
export const dynamic = 'force-dynamic'

interface SumSub {
  sumsub1 : number[],
  sumsub3 : number[],
  sumsub4 : number[],
  sumsub1lalu : number[],
  sumsub3lalu : number[],
  sumsub4lalu : number[],
  sumsub1sd : number[],
  sumsub3sd : number[],
  sumsub4sd : number[],
  sumsub1lalusd : number[],
  sumsub3lalusd : number[],
  sumsub4lalusd : number[]    
}

interface SelectParameterValue {
  awaltahun : string,
  bulanini : string,
  bulanlalu : string
}




function genRep ( qlr1 : LrfirstStep[],footer1 : LrfirstStep[],footer2 : LrlastStep[] ) : RepLr[] {
  let rep : RepLr[] = [];

  //Aktiva
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
    sumsub4 : [],
    sumsub1lalu : [],
    sumsub3lalu : [],
    sumsub4lalu : [],
    sumsub1sd : [],
    sumsub3sd : [],
    sumsub4sd : [],
    sumsub1lalusd : [],
    sumsub3lalusd : [],
    sumsub4lalusd : [],
  } 

  let thisSubfooter4 = "";
  let thisSubfooter3 = "";
  let thisSubfooter1 = "";
  const countlr = qlr1.length
  qlr1.map((akt,index) => {
  let thisSub4 = akt.kelompok2;
  let thisSub3 = akt.kelompok1;
  let thisSub1 = akt.header;




  if (thisSub1 !==subReport.sub1) {
    //footer
    if (subReport.sub1 !== "") {
      const jmlSumblnini = sumSub.sumsub1.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumanggaran = sumSub.sumsub1lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumblninisd = sumSub.sumsub1sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumanggaransd = sumSub.sumsub1lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub4 : RepLr = { 
        uraian : `JUMLAH ${thisSubfooter1.toUpperCase()}`,
        blnrealisasi : jmlSumblnini,
        blnanggaran : jmlSumanggaran,
        blnlebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
        blnpersentase : cariPersentase(jmlSumblnini,jmlSumanggaran),
        realisasi : jmlSumblninisd,
        anggaran : jmlSumanggaransd,
        lebihkurang : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),    
        persentase :  cariPersentase(jmlSumblninisd,jmlSumanggaransd),
        clsname : 'py-1 pl-5 font-bold'    
                
      }
      rep.push(footerSub4)
    } 
  } 

  if (thisSub3 !==subReport.sub3) {
    //footer
    if (subReport.sub3 !== "") {
      const jmlSumblnini = sumSub.sumsub3.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumanggaran = sumSub.sumsub3lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumblninisd = sumSub.sumsub3sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumanggaransd = sumSub.sumsub3lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub3 : RepLr = { 
        uraian : `${thisSubfooter3}`,
        blnrealisasi : jmlSumblnini,
        blnanggaran : jmlSumanggaran,
        blnlebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
        blnpersentase : cariPersentase(jmlSumblnini,jmlSumanggaran),
        realisasi : jmlSumblninisd,
        anggaran : jmlSumanggaransd,
        lebihkurang : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),    
        persentase :  cariPersentase(jmlSumblninisd,jmlSumanggaransd),
        clsname : 'py-1 pl-1 font-bold'          
      }
      rep.push(footerSub3)
    } 
  } 
  if (thisSub4 !==subReport.sub4) {
    //footer
    if (subReport.sub4 !== "") {
      const jmlSumblnini = sumSub.sumsub4.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumanggaran = sumSub.sumsub4lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumblninisd = sumSub.sumsub4sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const jmlSumanggaransd = sumSub.sumsub4lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub1 : RepLr = { 
        uraian : `JUMLAH ${akt.footerheader.toUpperCase()}`,
        blnrealisasi : jmlSumblnini,
        blnanggaran : jmlSumanggaran,
        blnlebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
        blnpersentase : cariPersentase(jmlSumblnini,jmlSumanggaran),
        realisasi : jmlSumblninisd,
        anggaran : jmlSumanggaransd,
        lebihkurang : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),    
        persentase :  cariPersentase(jmlSumblninisd,jmlSumanggaransd),
        clsname : 'py-1 pl-1 font-bold'          
      }
      rep.push(footerSub1)
    } 
  } 

  //header
  if (thisSub4 !==subReport.sub4) {

    sumSub.sumsub4 = [];
    sumSub.sumsub4sd = [];
    sumSub.sumsub4lalu = [];
    sumSub.sumsub4lalusd = [];
  }
  if (thisSub3 !==subReport.sub3) {
    sumSub.sumsub3 = [];
    sumSub.sumsub3sd = [];
    sumSub.sumsub3lalu = [];
    sumSub.sumsub3lalusd = [];
  } 
  if (thisSub1 !==subReport.sub1) {
    sumSub.sumsub1 = [];
    sumSub.sumsub1sd = [];
    sumSub.sumsub1lalu = [];
    sumSub.sumsub1lalusd = [];
    const headerSub1 : RepLr = { 
      uraian : `${akt.header.toUpperCase()}`,
      blnrealisasi : "",
      blnanggaran : "",
      blnlebihkurang : "",
      blnpersentase : "",
      realisasi :"",
      anggaran : "",
      lebihkurang : "",    
      persentase :  "",
      clsname : 'py-1 pl-1 font-bold'    
    } 
    rep.push(headerSub1)
  } 

  // console.log(akt.bulanini);
  const dataUraian : RepLr = { 
    uraian : `${akt.uraian}`,
    blnrealisasi : akt.blnrealisasi as number,
    blnanggaran : akt.blnanggaran as number,
    blnlebihkurang : numtoFl(fltoNum(akt.blnrealisasi)-fltoNum(akt.blnanggaran)),     
    blnpersentase : cariPersentase(akt.blnrealisasi,akt.blnanggaran),
    realisasi : akt.realisasi as number,
    anggaran : akt.anggaran as number,
    lebihkurang : numtoFl(fltoNum(akt.realisasi)-fltoNum(akt.anggaran)),     
    persentase : cariPersentase(akt.realisasi,akt.anggaran),     
    clsname : 'py-1 pl-5'              
  } 
  rep.push(dataUraian)
  
  // sumvalue
  sumSub.sumsub1.push(akt.blnrealisasi)
  sumSub.sumsub3.push(akt.blnrealisasi)
  sumSub.sumsub4.push(akt.blnrealisasisum)
  sumSub.sumsub1lalu.push(akt.blnanggaran)
  sumSub.sumsub3lalu.push(akt.blnanggaran)
  sumSub.sumsub4lalu.push(akt.blnanggaransum)
  sumSub.sumsub1sd.push(akt.realisasi)
  sumSub.sumsub3sd.push(akt.realisasi)
  sumSub.sumsub4sd.push(akt.realisasisum)
  sumSub.sumsub1lalusd.push(akt.anggaran)
  sumSub.sumsub3lalusd.push(akt.anggaran)
  sumSub.sumsub4lalusd.push(akt.anggaransum)

  thisSubfooter4 = akt.kelompok2;
  thisSubfooter3 = akt.kelompok1;
  thisSubfooter1 = akt.footerheader;

  //footer last value
  if ((index+1) === countlr) {
    let jmlSumblnini = sumSub.sumsub1.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
    let jmlSumanggaran = sumSub.sumsub1lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
    let jmlSumblninisd = sumSub.sumsub1sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
    let jmlSumanggaransd = sumSub.sumsub1lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub1 : RepLr = { 
        uraian : `Jumlah ${thisSubfooter1}`,
        blnrealisasi : jmlSumblnini,
        blnanggaran : jmlSumanggaran,
        blnlebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
        blnpersentase : cariPersentase(jmlSumblnini,jmlSumanggaran),
        realisasi : jmlSumblninisd,
        anggaran : jmlSumanggaransd,
        lebihkurang : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),    
        persentase :  cariPersentase(jmlSumblninisd,jmlSumanggaransd),
        clsname : 'py-1 pl-5 font-bold'                
      } 
      rep.push(footerSub1)

      jmlSumblnini = sumSub.sumsub3.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumanggaran = sumSub.sumsub3lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumblninisd = sumSub.sumsub3sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumanggaransd = sumSub.sumsub3lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub3 : RepLr = { 
        uraian : `${akt.kelompok1}`,
        blnrealisasi : jmlSumblnini,
        blnanggaran : jmlSumanggaran,
        blnlebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
        blnpersentase : cariPersentase(jmlSumblnini,jmlSumanggaran),
        realisasi : jmlSumblninisd,
        anggaran : jmlSumanggaransd,
        lebihkurang : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),    
        persentase :  cariPersentase(jmlSumblninisd,jmlSumanggaransd),
        clsname : 'py-1 pl-1 font-bold'                   
      } 
      rep.push(footerSub3)

      jmlSumblnini = sumSub.sumsub4.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumanggaran = sumSub.sumsub4lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumblninisd = sumSub.sumsub4sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumanggaransd = sumSub.sumsub4lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub4 : RepLr = { 
        uraian : `${akt.kelompok2}`,
        blnrealisasi : jmlSumblnini,
        blnanggaran : jmlSumanggaran,
        blnlebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
        blnpersentase : cariPersentase(jmlSumblnini,jmlSumanggaran),
        realisasi : jmlSumblninisd,
        anggaran : jmlSumanggaransd,
        lebihkurang : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),    
        persentase :  cariPersentase(jmlSumblninisd,jmlSumanggaransd),
        clsname : 'py-1 pl-1 font-bold'             
      } 
      
      rep.push(footerSub4)

  }

  // let thisSub4 = akt.kelompok2;
  // let thisSub3 = akt.kelompok1;
  // let thisSub1 = akt.header;

  subReport.namasub4 = akt.kelompok2;

  subReport.sub4 = thisSub4;
  subReport.namasub4 = akt.kelompok2;

  subReport.sub3 = thisSub3;
  subReport.namasub3 = akt.kelompok1;

  subReport.sub1 = thisSub1;
  subReport.namasub1 = akt.header;


  });

  const datafooter1 : RepLr = { 
    uraian : `${footer1[0].kelompok2}`,
    blnrealisasi : footer1[0].blnrealisasi,
    blnanggaran : footer1[0].blnanggaran,
    blnlebihkurang : numtoFl(fltoNum(footer1[0].blnrealisasi)-fltoNum(footer1[0].blnanggaran)),
    blnpersentase : cariPersentase(footer1[0].blnrealisasi,footer1[0].blnanggaran),
    realisasi : footer1[0].realisasi,
    anggaran : footer1[0].anggaran,
    lebihkurang : numtoFl(fltoNum(footer1[0].realisasi)-fltoNum(footer1[0].anggaran)),    
    persentase :  cariPersentase(footer1[0].realisasi,footer1[0].anggaran),
    clsname : 'py-1 pl-1 font-bold'          
  }
  rep.push(datafooter1)

  const datafooter2 : RepLr = { 
    uraian : `${footer2[0].uraian}`,
    blnrealisasi : footer2[0].blnrealisasisum,
    blnanggaran : footer2[0].blnanggaransum,
    blnlebihkurang : numtoFl(fltoNum(footer2[0].blnrealisasisum)-fltoNum(footer2[0].blnanggaransum)),
    blnpersentase : cariPersentase(footer2[0].blnrealisasisum,footer2[0].blnanggaransum),
    realisasi : footer2[0].realisasisum,
    anggaran : footer2[0].anggaransum,
    lebihkurang : numtoFl(fltoNum(footer2[0].realisasisum)-fltoNum(footer2[0].anggaransum)),    
    persentase :  cariPersentase(footer2[0].realisasisum,footer2[0].anggaransum),
    clsname : 'py-1 pl-1 font-bold'          
  }
  rep.push(datafooter2)

  return rep;
}



export async function GET (  req : NextRequest  ) {
  
  try {
    const dataSession =  await getServerSession(authOptions);
    if (dataSession === null) {
      return NextResponse.json({ message : 'Unauthorized'},{status : 401}) 
    }
    const username = dataSession.user.username;
    
    const periode = req.nextUrl.searchParams.get("periode");
    const tanggalreport = req.nextUrl.searchParams.get("tanggalreport");
    const flaganggaran = req.nextUrl.searchParams.get("anggaran"); 
    const spilitPeriode = periode?.split(" ");
    const keyPeriode = `${spilitPeriode?.[0]}${spilitPeriode?.[1]}`
    const tahunlalu = parseInt(spilitPeriode?.[2] || "0") - 1;

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

    const parameterValueTahunLalu = {
      awaltahun : `${tahunlalu}-01-01`,
      bulanini : `${tahunlalu}-12-31`,
      bulanlalu : `${tahunlalu}-12-31`
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
    const periodeini = selectParamValue.bulanini.substring(0,7).replace("-","")

    const exelrblnini : number   = await prismadb.$executeRaw`CALL ex_lr_detail(${selectParamValue.awaltahun},${selectParamValue.bulanini},${periodeini},${username},${flaganggaran});` 


    const qlr1 : LrfirstStep[] = await GenLr1(username).then((res)=>{ return res;});
    const qlr2 : LrfirstStep[] = await GenLr2(username).then((res)=>{ return res;});
    const qlr3 : LrlastStep[] = await GenLr3(username).then((res)=>{ return res;});    


    const dataBulanIni : RepLr[] = genRep(qlr1,qlr2,qlr3) 

    const dataBulanIniCur =  dataBulanIni.map(val => {
      let fValue =  val;
      if (fValue.realisasi as string !== "") {
        const dumpblnrealisasi = parseFloat((val.blnrealisasi as number).toFixed(2))
        const dumpblnanggaran = parseFloat((val.blnanggaran as number).toFixed(2))
        const dumpblnselisih = parseFloat((val.blnlebihkurang as number).toFixed(2))
        const dumpblnpersentase = parseFloat((val.blnpersentase as number).toFixed(2))
        const dumprealisasi = parseFloat((val.realisasi as number).toFixed(2))
        const dumpanggaran = parseFloat((val.anggaran as number).toFixed(2))
        const dumpselisih = parseFloat((val.lebihkurang as number).toFixed(2))
        const dumppersentase = parseFloat((val.persentase as number).toFixed(2))
        
        fValue = { ...val,
                  blnrealisasi : formatNumber(dumpblnrealisasi),
                  blnanggaran : formatNumber(dumpblnanggaran),
                  blnlebihkurang : formatNumber(dumpblnselisih),
                  blnpersentase : formatNumber(dumpblnpersentase),
                  realisasi : formatNumber(dumprealisasi),
                  anggaran : formatNumber(dumpanggaran),
                  lebihkurang : formatNumber(dumpselisih),
                  persentase : formatNumber(dumppersentase)
                 }
      }     
      return  fValue
    })

    const ttd = await GenTTD('nrc1',username).then((res)=>{ return res;});

    const finalResponse : FinalResponse = {
      datalabarugi : dataBulanIniCur,
      datattd : ttd
    }
 
    return NextResponse.json(finalResponse,{status : 200})    
  } catch (error) {
    console.log(error);
    return NextResponse.json(error,{status : 400})    
  }
  
}