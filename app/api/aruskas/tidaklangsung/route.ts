import { NextRequest,NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import {formatNumber } from "@/lib/utils";
import { GenTTD, GenAkl } from "@/lib/utils-db";
import { RepAkL, AkSaL, FinalResponseL} from "@/types/repak";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next";

interface SelectParameterValue {
  awaltahun : string,
  bulanini : string,
  bulanlalu : string,
  periodeini : string
}

function genRep ( akl : AkSaL[] ) : RepAkL[] {
  let rep : RepAkL[] = [];


  // const countAk = akl.length
  akl.map((akt,index) => {
    let clsnm : string = "";
    let jml : number | string = "";

    if (akt.flagheader >= 1 ) {
      clsnm  = "py-0 border-t-0 border-l border-r-0 border-b-0 pl-1 font-bold";
      jml = "";
    } else {
      clsnm  = "py-0 border-t-0 border-l border-r-0 border-b-0 pl-4";    
      jml = akt.jumlah as number;
    }

    if (akt.flagheader >= 2 ) {
      clsnm  = "py-1 border pl-1 font-bold";
      jml = akt.jumlah as number;    
    }

     
    const dataUraian : RepAkL = { 
      idx : akt.idx ,
      uraian : `${akt.nama}`,
      jumlah : jml,
      clsname : clsnm              
    } 
    rep.push(dataUraian)


  });


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
    const qAkl : AkSaL[] = await GenAkl(username).then((res)=>{ return res;});

    const dataBulanIni : RepAkL[] = genRep(qAkl) 

    const dataBulanIniCur =  dataBulanIni.map(val => {
      let fValue =  val;
      if (fValue.jumlah as string !== "") {
        const dumpblnIni = parseFloat((val.jumlah as number).toFixed(2))
        fValue = { ...val,jumlah : formatNumber(dumpblnIni)}
      }     
      return  fValue
    })

    const ttd = await GenTTD('pu2',username).then((res)=>{ return res;});

    const finalResponse : FinalResponseL = {
      dataak : dataBulanIniCur,
      datattd : ttd
    }
 

    return NextResponse.json(finalResponse,{status : 200})    
  } catch (error) {
    console.log(error);
    return NextResponse.json(error,{status : 400})    
  }
  
}