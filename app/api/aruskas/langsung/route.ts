import { NextRequest,NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import {  fltoNum, numtoFl,formatNumber } from "@/lib/utils";
import { GenTTD,GenAk, GenAkSa } from "@/lib/utils-db";
import { FinalResponse,Ak1,AkSa,RepAk} from "@/types/repak";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic'
interface SumSub {
  sumsub1 : number[],
  sumsub2 : number[],
  sumsub1lalu : number[],
  sumsub2lalu : number[],
  sumsub1sd : number[],
  sumsub2sd : number[],
  sumsub1lalusd : number[],
  sumsub2lalusd : number[]
}

interface SumTotal {
  sumrealisasi : number[],
  sumrealisasisd : number[],
  sumanggaran : number[],
  sumanggaransd : number[]
}

interface SelectParameterValue {
  awaltahun : string,
  bulanini : string,
  bulanlalu : string,
  periodeini : string
}


function genDataFinal (valBlnini : any[] , valBlnlalu : any[] ) : any[] {
          // const objtam = {
        //   idx	     : 99723123,
        //   namasub1	: "AKTIVA",
        //   namasub2	: "Aktiva Tak Berwujud",
        //   namasub3	: "Aktiva Tak Berwujud",
        //   namasub4	: "Beban Ditangguhkan",
        //   sub1	: "1",
        //   sub2	: "11",
        //   sub3	: "11",
        //   sub4	: "11.02",
        //   kode	: "11.02.02",
        //   nama	: "11.02.02 Rupa-rupa Rupa2 Rupa Kas Kecil",
        //   blnini	: 5642,
        //   blnlalu	: 0,
        //   jumlah	: 0,
        //   persentase : 0,	
        //   nmuser : 'admin'
        // }
        // aktivaBlnlalu.splice(6,0,objtam);
         
        //aktiva

        //pasiva


  let dumpValini = valBlnini.map(v => v.kode);
  const dumpValLalu = valBlnlalu.map(v => v.kode);
  //insert kodeakun jika bulan lalu tidak ada di bulan ini
  dumpValLalu.map((val,index) => {
    const ind = dumpValini.indexOf(val); 
    if (ind === -1) {
      dumpValini.push(val)
    }
  })
  
  //sort lagi data
  dumpValini.sort(); 
  
  //generate data bulan ini dan join value bulan lalu
  const valFinal = dumpValini.map((val,index) => {
    const resu = valBlnini.find( (vale) => {
      if (vale.kode === val ) {
        return vale;
      }
    } )

    if (resu === undefined) {
      const resuBlnLalu = valBlnlalu.find( (v) => {
        if (v.kode === val ) {
     
          return v;
        }
      })
      if (resuBlnLalu) {
        const valBlnini = resuBlnLalu.blnini
        console.log({...resuBlnLalu,blnini : 0,blnlalu : valBlnini})
        return resuBlnLalu;
      }
    } else {
      const resuBlnLalu = valBlnlalu.find( (v) => {
        if (v.kode === val ) {
     
          return v;
        }
      })
      const jumlahBlnLalu = resuBlnLalu?.blnini || 0;

      const finalValue = {...resu,blnlalu : jumlahBlnLalu,jumlah : 0,persentase : 0 }
      // console.log()
      // return {...resu,blnlalu : resuBlnLalu.blnini,jumlah : resu.blnini - resuBlnLalu.blnini,persentase : (resu.blnini - resuBlnLalu.blnini)/resuBlnLalu.blnini*100 };
      return finalValue;
    }
  })


  return valFinal
}


function genRep ( Ak1 : Ak1[],AkSa : AkSa[] ) : RepAk[] {
  let rep : RepAk[] = [];


  const dataSa : RepAk = { 
    uraian : `A. - ${AkSa[0].namatipe}`,
    jumlah: AkSa[0].saldoawal,
    jumlahsd: AkSa[0].saldoawalsd2,
    anggaranini: AkSa[0].anggaranini,
    anggaransdini: AkSa[0].sdanggaranini,
    lebihkurang :  numtoFl(fltoNum(AkSa[0].saldoawal)-fltoNum(AkSa[0].anggaranini)),
    lebihkurangsd : numtoFl(fltoNum(AkSa[0].saldoawalsd2)-fltoNum(AkSa[0].sdanggaranini)),
    clsname : 'py-1 border pl-1 font-bold'          
  }
  rep.push(dataSa)
  //Aktiva
  let subReport = {
    sub1 : "", 
    sub2 : "",
    namasub1 : "", 
    namasub2 : "",
    sumSub1 : 0,
    sumSub2 : 0,   
  } 

  let sumSub : SumSub = {   
    sumsub1 : [],
    sumsub2 : [],
    sumsub1lalu : [],
    sumsub2lalu : [],
    sumsub1sd : [],
    sumsub2sd : [],
    sumsub1lalusd : [],
    sumsub2lalusd : []
  } 


  let sumTotal : SumTotal = {   
    sumrealisasi : [],
    sumrealisasisd : [],
    sumanggaran : [],
    sumanggaransd : []
  } 


  const countAk = Ak1.length
  Ak1.map((akt,index) => {
    let thisSub1 = akt.kodetipe;
    let thisSub2 = akt.kodemodtipe;
    //footer
    if (thisSub2 !==subReport.sub2) {
      //footer
      if (subReport.sub2 !== "") {
        const jmlSumblnini = sumSub.sumsub2.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumanggaran = sumSub.sumsub2lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumblninisd = sumSub.sumsub2sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumanggaransd = sumSub.sumsub2lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub2 : RepAk = { 
          uraian : `JUMLAH`,
          jumlah: jmlSumblnini,
          jumlahsd: jmlSumblninisd,
          anggaranini: jmlSumanggaran,
          anggaransdini: jmlSumanggaransd,
          lebihkurang :  numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
          lebihkurangsd : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),
          clsname : 'py-0 border-t border-l border-r-0 border-b pl-12 font-bold'          
        }
        rep.push(footerSub2)
      } 
    } 

    if (thisSub1 !==subReport.sub1) {
      //footer
      if (subReport.sub1 !== "") {
        const jmlSumblnini = sumSub.sumsub1.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumanggaran = sumSub.sumsub1lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumblninisd = sumSub.sumsub1sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumanggaransd = sumSub.sumsub1lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub1 : RepAk = { 
          uraian : `TOTAL ${subReport.namasub1}`,
          jumlah: jmlSumblnini,
          jumlahsd: jmlSumblninisd,
          anggaranini: jmlSumanggaran,
          anggaransdini: jmlSumanggaransd,
          lebihkurang :  numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
          lebihkurangsd : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),
          clsname : 'py-1 border pl-6 font-bold'          
        }
        rep.push(footerSub1)
      } 
    } 

    //header
    if (thisSub1 !==subReport.sub1) {
      const headerSub1 : RepAk = { 
        uraian : `${akt.kodetipe}${". - "} ${akt.tipe}`,
        jumlah: "",
        jumlahsd: "",
        anggaranini: "",
        anggaransdini: "",
        lebihkurang :  "",
        lebihkurangsd : "",
        clsname : 'py-0 border-t-0 border-l border-r-0 border-b-0 pl-1 font-bold'       
      } 
      rep.push(headerSub1)
      sumSub.sumsub1 = [];
      sumSub.sumsub1sd = [];
      sumSub.sumsub1lalu = [];
      sumSub.sumsub1lalusd = [];
    }
    if (thisSub2 !==subReport.sub2) {
      const headerSub2 : RepAk = { 
        uraian : `${akt.kodemodtipe}${". - "} ${akt.modtipe}`,
        jumlah: "",
        jumlahsd: "",
        anggaranini: "",
        anggaransdini: "",
        lebihkurang :  "",
        lebihkurangsd : "",
        clsname : 'py-0 border-t-0 border-l border-r-0 border-b-0 pl-6 font-bold'               
      } 
      rep.push(headerSub2)
      sumSub.sumsub2 = [];
      sumSub.sumsub2sd = [];
      sumSub.sumsub2lalu = [];
      sumSub.sumsub2lalusd = [];
    } 

    // console.log(akt.bulanini);
    const dataUraian : RepAk = { 
      uraian : `${akt.namatipe}`,
      jumlah: akt.jumlah  as number,
      jumlahsd: akt.jumlahsd as number,
      anggaranini: akt.anggaranini as number,
      anggaransdini: akt.anggaransdini as number,
      lebihkurang : numtoFl(fltoNum(akt.jumlah  as number)-fltoNum(akt.anggaranini as number)),     
      lebihkurangsd : numtoFl(fltoNum(akt.jumlahsd  as number)-fltoNum(akt.anggaransdini as number)),  
      clsname : 'py-0 border-t-0 border-l border-r-0 border-b-0 pl-12'              
    } 
    rep.push(dataUraian)
    
    // sumvalue
    sumSub.sumsub1.push(akt.jumlah)
    sumSub.sumsub1sd.push(akt.jumlahsd)
    sumSub.sumsub1lalu.push(akt.anggaranini)
    sumSub.sumsub1lalusd.push(akt.anggaransdini)
    sumSub.sumsub2.push(akt.jumlah)
    sumSub.sumsub2sd.push(akt.jumlahsd)
    sumSub.sumsub2lalu.push(akt.anggaranini)
    sumSub.sumsub2lalusd.push(akt.anggaransdini)

    sumTotal.sumrealisasi.push(akt.jml1sum);
    sumTotal.sumrealisasisd.push(akt.jmlsd1sum);    
    sumTotal.sumanggaran.push(akt.anggaraninisum); 
    sumTotal.sumanggaransd.push(akt.anggaransdinisum); 
    //footer last value
    if ((index+1) === countAk) {
      let jmlSumblnini = sumSub.sumsub2.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      let jmlSumanggaran = sumSub.sumsub2lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      let jmlSumblninisd = sumSub.sumsub2sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      let jmlSumanggaransd = sumSub.sumsub2lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub2 : RepAk = { 
        uraian : `Jumlah`,
        jumlah: jmlSumblnini,
        jumlahsd: jmlSumblninisd,
        anggaranini: jmlSumanggaran,
        anggaransdini: jmlSumanggaransd,
        lebihkurang :  numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
        lebihkurangsd : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),
        clsname : 'py-0 border-t border-l border-r-0 border-b pl-12 font-bold'          
      }
      rep.push(footerSub2)

      jmlSumblnini = sumSub.sumsub1.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumanggaran = sumSub.sumsub1lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumblninisd = sumSub.sumsub1sd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumanggaransd = sumSub.sumsub1lalusd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub1 : RepAk = { 
        uraian : `TOTAL ${akt.tipe}`,
        jumlah: jmlSumblnini,
        jumlahsd: jmlSumblninisd,
        anggaranini: jmlSumanggaran,
        anggaransdini: jmlSumanggaransd,
        lebihkurang :  numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumanggaran)),
        lebihkurangsd : numtoFl(fltoNum(jmlSumblninisd)-fltoNum(jmlSumanggaransd)),
        clsname : 'py-1 border pl-6 font-bold'          
      }
      rep.push(footerSub1)
    }


    subReport.namasub2 = akt.modtipe;

    subReport.sub2 = thisSub2;
    subReport.namasub2 = akt.modtipe;

    subReport.sub1 = thisSub1;
    subReport.namasub1 = akt.tipe;


  });

  const saldoawalarray = AkSa.map(val => val.saldoawal).reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)})
  const saldoawal = parseFloat(saldoawalarray.toString());
  const saldoawalsdarray : number = AkSa[0].saldoawalsd2 as number;
  const saldoawalsd : number = parseFloat(saldoawalsdarray.toString());
  const jmlSumrealisasi = sumTotal.sumrealisasi.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
  const jmlSumanggaran = sumTotal.sumanggaran.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
  const jmlSumrealisasisd = sumTotal.sumrealisasisd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
  const jmlSumanggaransd = sumTotal.sumanggaransd.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
  const jmlrealisasi = jmlSumrealisasi + saldoawal;
  const jmlrealisasisd = jmlSumrealisasisd + saldoawalsd;
  const dataSummaryAkhir : RepAk = { 
    uraian : `D. - SALDO AKHIR (A+B-C)`,
    jumlah: jmlrealisasi,
    jumlahsd: jmlrealisasisd,
    anggaranini: jmlSumanggaran,
    anggaransdini: jmlSumanggaransd,
    lebihkurang :  numtoFl(fltoNum(jmlrealisasi)-fltoNum(jmlSumanggaran)),
    lebihkurangsd : numtoFl(fltoNum(jmlrealisasisd)-fltoNum(jmlSumanggaransd)),
    clsname : 'py-1 border pl-1 font-bold'          
  }
  const testobje = {
    num : 1451
  }
  rep.push(dataSummaryAkhir)

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
    const spilitPeriode = periode?.split(" ");
    const keyPeriode = `${spilitPeriode?.[0]}${spilitPeriode?.[1]}`
    const tahunlalu = parseInt(spilitPeriode?.[2] || "0") - 1;
    console.log(tahunlalu);
    // const triwulan : string = spilitPeriode[2]
    // console.log(spilitPeriode?.[2]);
    const parameterValue = {
      TRIWULANI : {
        awaltahun : `${spilitPeriode?.[2]}-01-01`,
        bulanini : `${spilitPeriode?.[2]}-03-31`,
        bulanlalu : `${spilitPeriode?.[2]}-02-28`,
        periodeini : `${spilitPeriode?.[2]}03`,
      },
      TRIWULANII : {
        awaltahun : `${spilitPeriode?.[2]}-01-01`,
        bulanini : `${spilitPeriode?.[2]}-06-30`,
        bulanlalu : `${spilitPeriode?.[2]}-05-31`,
        periodeini : `${spilitPeriode?.[2]}06`,
      },
      TRIWULANIII : {
        awaltahun : `${spilitPeriode?.[2]}-01-01`,
        bulanini : `${spilitPeriode?.[2]}-09-30`,
        bulanlalu : `${spilitPeriode?.[2]}-08-31`,
        periodeini : `${spilitPeriode?.[2]}09`,
      },
      TRIWULANIV : {
        awaltahun : `${spilitPeriode?.[2]}-01-01`,
        bulanini : `${spilitPeriode?.[2]}-12-31`,
        bulanlalu : `${spilitPeriode?.[2]}-11-30`,
        periodeini : `${spilitPeriode?.[2]}12`
      },
    }

    const parameterValueTahunLalu = {
      awaltahun : `${tahunlalu}-01-01`,
      bulanini : `${tahunlalu}-12-31`,
      bulanlalu : `${tahunlalu}-11-30`,
      periodeini : `${tahunlalu}12`
    }
    let selectParamValue : SelectParameterValue  = {
      awaltahun : "",
      bulanini : "",
      bulanlalu : "",
      periodeini : ""
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
      bulanlalu : "",
      periodeini : ""
    }
    let lastvalue : SelectParameterValue  = {
      awaltahun : "",
      bulanini : "",
      bulanlalu : "",
      periodeini : ""
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
    // console.log(selectParamValue);

    // console.log(selectParamValueBlnlalu);

    const execashflowblnini : number   = await prismadb.$executeRaw`CALL ex_ak_detail(${selectParamValue.awaltahun},${selectParamValue.bulanini},${selectParamValue.bulanlalu},${username});` 
    const qAk1 : Ak1[] = await GenAk(selectParamValue.periodeini).then((res)=>{ return res;});
    const qAksa : AkSa[] = await GenAkSa(selectParamValue.periodeini).then((res)=>{ return res;});

    // if (selectParamValueBlnlalu !== null) {
    //   const exeNrcblnlalu : number   = await prismadb.$executeRaw`CALL ex_nrc_detail(${selectParamValueBlnlalu.awaltahun},${selectParamValueBlnlalu.bulanini},${selectParamValueBlnlalu.bulanlalu},${username});` 
    //   if (exeNrcblnlalu > 0) {
    //     const aktivaBlnlalu : any[] = await prismadb.$queryRaw(
    //       Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="AKTIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
    //     )
    //     const pasivaBlnlalu : any[] = await prismadb.$queryRaw(
    //       Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="PASIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
    //     )
    //     aktivaFinal = genDataFinal(aktivaBlnIni,aktivaBlnlalu);

    //     pasivaFinal = genDataFinal(pasivaBlnIni,pasivaBlnlalu);
    //   }
    // } else {
    //   const exeNrcblnlalu : number   = await prismadb.$executeRaw`CALL ex_nrc_detail(${parameterValueTahunLalu.awaltahun},${parameterValueTahunLalu.bulanini},${parameterValueTahunLalu.bulanlalu},${username});`
    //   if (exeNrcblnlalu > 0) {
    //     const aktivaBlnlalu : any[] = await prismadb.$queryRaw(
    //       Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="AKTIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
    //     )
    //     const pasivaBlnlalu : any[] = await prismadb.$queryRaw(
    //       Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="PASIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
    //     )    

    //     aktivaFinal = genDataFinal(aktivaBlnIni,aktivaBlnlalu);

    //     pasivaFinal = genDataFinal(pasivaBlnIni,pasivaBlnlalu);        
        
    //   }
    // }
  
    

    const dataBulanIni : RepAk[] = genRep(qAk1,qAksa) 

    const dataBulanIniCur =  dataBulanIni.map(val => {
      let fValue =  val;
      if (fValue.jumlah as string !== "") {
        const dumpblnIni = parseFloat((val.jumlah as number).toFixed(2))
        const dumpblnlalu = parseFloat((val.anggaranini as number).toFixed(2))
        const dumpblnselisih = parseFloat((val.lebihkurang as number).toFixed(2))
        const dumpblnInisd = parseFloat((val.jumlahsd as number).toFixed(2))
        const dumpblnlalusd = parseFloat((val.anggaransdini as number).toFixed(2))
        const dumpblnselisihsd = parseFloat((val.lebihkurangsd as number).toFixed(2))
        fValue = { ...val,jumlah : formatNumber(dumpblnIni),anggaranini : formatNumber(dumpblnlalu),lebihkurang : formatNumber(dumpblnselisih),
                  jumlahsd : formatNumber(dumpblnInisd), anggaransdini : formatNumber(dumpblnlalusd), lebihkurangsd :  formatNumber(dumpblnselisihsd)}
      }     
      return  fValue
    })


    console.log(periode,tanggalreport);
    // let ttd : DataTtd[] = [defaultDataTtd]
    const ttd = await GenTTD('pu1',username).then((res)=>{ return res;});

    const finalResponse : FinalResponse = {
      dataak : dataBulanIniCur,
      datattd : ttd
    }
 

    return NextResponse.json(finalResponse,{status : 200})    
  } catch (error) {
    console.log(error);
    return NextResponse.json(error,{status : 400})    
  }
  
}