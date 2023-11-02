import { NextRequest,NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { cariPersentase, fltoNum, numtoFl,formatNumber } from "@/lib/utils";
import { GenTTD } from "@/lib/utils-db";
import { FinalResponse, GenRep } from "@/types/repneraca";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next";


interface SumSub {
  sumsub1 : number[],
  sumsub3 : number[],
  sumsub4 : number[],
  sumsub1lalu : number[],
  sumsub3lalu : number[],
  sumsub4lalu : number[]  
}

interface SelectParameterValue {
  awaltahun : string,
  bulanini : string,
  bulanlalu : string
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


function genRep ( aktiva : any[],pasiva : any[] ) : GenRep[] {
  let rep : GenRep[] = [];

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
        const jmlSumblnini = sumSub.sumsub4.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumblnlalu = sumSub.sumsub4lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub4 : GenRep = { 
          uraian : `Jumlah ${subReport.namasub4}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-5 font-bold'           
        } 
        rep.push(footerSub4)
      } 
    } 

    if (thisSub3 !==subReport.sub3) {
      //footer
      if (subReport.sub3 !== "") {
        const jmlSumblnini = sumSub.sumsub3.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumblnlalu = sumSub.sumsub3lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub3 : GenRep = { 
          uraian : `Jumlah ${subReport.namasub3}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-3 font-bold'                    
        } 
        rep.push(footerSub3)
      } 
    } 
    if (thisSub1 !==subReport.sub1) {
      //footer
      if (subReport.sub1 !== "") {
        const jmlSumblnini = sumSub.sumsub1.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumblnlalu = sumSub.sumsub1lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub1 : GenRep = { 
          uraian : `Jumlah ${subReport.namasub1}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-1 font-bold'                 
        } 
        
        rep.push(footerSub1)
      }
    }

    //header
    if (thisSub1 !==subReport.sub1) {
      const headerSub1 : GenRep = { 
        uraian : `${akt.namasub1}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : "",
        clsname : 'py-1 pl-1 font-bold'       
      } 
      rep.push(headerSub1)
      sumSub.sumsub1 = [];
    }
    if (thisSub3 !==subReport.sub3) {
      const headerSub3 : GenRep = { 
        uraian : `${akt.namasub3}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : "",
        clsname : 'py-1 pl-3 font-bold'              
      } 
      rep.push(headerSub3)
      sumSub.sumsub3 = [];
    } 
    if (thisSub4 !==subReport.sub4) {
      const headerSub4 : GenRep = { 
        uraian : `${akt.namasub4}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : "",
        clsname : 'py-1 pl-5 font-bold'               
      } 
      rep.push(headerSub4)
      sumSub.sumsub4 = [];
    } 

    // console.log(akt.bulanini);
    const dataUraian : GenRep = { 
      uraian : `${akt.nama}`,
      bulanini : akt.blnini as number,
      bulanlalu : akt.blnlalu as number,
      lebihkurang : numtoFl(fltoNum(akt.blnini)-fltoNum(akt.blnlalu)),     
      persentase : ((akt.blnini-akt.blnlalu)/akt.blnlalu*100),
      clsname : 'py-1 pl-7'              
    } 
    rep.push(dataUraian)
    
    // sumvalue
    sumSub.sumsub1.push(akt.blnini)
    sumSub.sumsub3.push(akt.blnini)
    sumSub.sumsub4.push(akt.blnini)
    sumSub.sumsub1lalu.push(akt.blnlalu)
    sumSub.sumsub3lalu.push(akt.blnlalu)
    sumSub.sumsub4lalu.push(akt.blnlalu)

    //footer last value
    if ((index+1) === countAktiva) {
      let jmlSumblnini = sumSub.sumsub4.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      let jmlSumblnlalu = sumSub.sumsub4lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub4 : GenRep = { 
          uraian : `Jumlah ${akt.namasub4}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-5 font-bold'                
        } 
        rep.push(footerSub4)

        jmlSumblnini = sumSub.sumsub3.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        jmlSumblnlalu = sumSub.sumsub3lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub3 : GenRep = { 
          uraian : `Jumlah ${akt.namasub3}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-3 font-bold'                   
        } 
        rep.push(footerSub3)

        jmlSumblnini = sumSub.sumsub1.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        jmlSumblnlalu = sumSub.sumsub1lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub1 : GenRep = { 
          uraian : `Jumlah ${akt.namasub1}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-1 font-bold'             
        } 
        
        rep.push(footerSub1)

    }


    subReport.namasub4 = akt.namasub4;

    subReport.sub4 = thisSub4;
    subReport.namasub4 = akt.namasub4;

    subReport.sub3 = thisSub3;
    subReport.namasub3 = akt.namasub3;

    subReport.sub1 = thisSub1;
    subReport.namasub1 = akt.namasub1;


  });


  // pasiva
  subReport = {
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

  sumSub = {   
    sumsub1 : [],
    sumsub3 : [],
    sumsub4 : [],
    sumsub1lalu : [],
    sumsub3lalu : [],
    sumsub4lalu : [],
  } 

  const countPasiva = pasiva.length
  pasiva.map((akt,index) => {
    let thisSub1 = akt.sub1;
    let thisSub3 = akt.sub3;
    let thisSub4 = akt.sub4;

    //footer

    if (thisSub4 !==subReport.sub4) {
      //footer
      if (subReport.sub4 !== "") {
        // insert data footer to array
        const jmlSumblnini = sumSub.sumsub4.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumblnlalu = sumSub.sumsub4lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub4 : GenRep = { 
          uraian : `Jumlah ${subReport.namasub4}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-5 font-bold'             
        } 
        rep.push(footerSub4)
      } 
    } 

    if (thisSub3 !==subReport.sub3) {
      //footer
      if (subReport.sub3 !== "") {
        // insert data footer to array
        const jmlSumblnini = sumSub.sumsub3.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumblnlalu = sumSub.sumsub3lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub3 : GenRep = { 
          uraian : `Jumlah ${subReport.namasub3}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-3 font-bold'              
        } 
        rep.push(footerSub3)
      } 
    } 
    if (thisSub1 !==subReport.sub1) {
      //footer
      if (subReport.sub1 !== "") {
        // insert data footer to array
        const jmlSumblnini = sumSub.sumsub1.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const jmlSumblnlalu = sumSub.sumsub1lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
        const footerSub1 : GenRep = { 
          uraian : `Jumlah ${subReport.namasub1}`,
          bulanini : jmlSumblnini,
          bulanlalu : jmlSumblnlalu,
          lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
          persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
          clsname : 'py-1 pl-1 font-bold'              
        } 
        
        rep.push(footerSub1)
      }
    }

    //header
    if (thisSub1 !==subReport.sub1) {
      const headerSub1 : GenRep = { 
        uraian : `${akt.namasub1}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : "",
        clsname : 'py-1 pl-1 font-bold'            
      } 
      rep.push(headerSub1)
      sumSub.sumsub1 = [];
    }
    if (thisSub3 !==subReport.sub3) {
      const headerSub3 : GenRep = { 
        uraian : `${akt.namasub3}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : "",
        clsname : 'py-1 pl-3 font-bold'            
      } 
      rep.push(headerSub3)
      sumSub.sumsub3 = [];
    } 
    if (thisSub4 !==subReport.sub4) {
      const headerSub4 : GenRep = { 
        uraian : `${akt.namasub4}`,
        bulanini : "",
        bulanlalu : "",
        lebihkurang : "",    
        persentase : "",
        clsname : 'py-1 pl-5 font-bold'            
      } 
      rep.push(headerSub4)
      sumSub.sumsub4 = [];
    } 

    // console.log(akt.bulanini);
    const dataUraian : GenRep = { 
      uraian : `${akt.nama}`,
      bulanini : akt.blnini,
      bulanlalu : akt.blnlalu,
      lebihkurang : numtoFl(fltoNum(akt.blnini)-fltoNum(akt.blnlalu)),    
      persentase : ((akt.blnini-akt.blnlalu)/akt.blnlalu*100),
      clsname : 'py-1 pl-7'            
    } 
    rep.push(dataUraian)
    
    // sumvalue
    sumSub.sumsub1.push(akt.blnini)
    sumSub.sumsub3.push(akt.blnini)
    sumSub.sumsub4.push(akt.blnini)
    sumSub.sumsub1lalu.push(akt.blnlalu)
    sumSub.sumsub3lalu.push(akt.blnlalu)
    sumSub.sumsub4lalu.push(akt.blnlalu)

    //footer last value
    if ((index+1) === countPasiva) {
      let jmlSumblnini = sumSub.sumsub4.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      let jmlSumblnlalu = sumSub.sumsub4lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});

      const footerSub4 : GenRep = { 
        uraian : `Jumlah ${akt.namasub4}`,
        bulanini : jmlSumblnini,
        bulanlalu : jmlSumblnlalu,
        lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
        persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
        clsname : 'py-1 pl-5 font-bold'             
      } 
      rep.push(footerSub4)

      jmlSumblnini = sumSub.sumsub3.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumblnlalu = sumSub.sumsub3lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub3 : GenRep = { 
        uraian : `Jumlah ${akt.namasub3}`,
        bulanini : jmlSumblnini,
        bulanlalu : jmlSumblnlalu,
        lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
        persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
        clsname : 'py-1 pl-3 font-bold'           
      } 
      rep.push(footerSub3)

      jmlSumblnini = sumSub.sumsub1.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      jmlSumblnlalu = sumSub.sumsub1lalu.reduce((left,right) => { const jml=fltoNum(left) + fltoNum(right); return numtoFl(jml)});
      const footerSub1 : GenRep = { 
        uraian : `Jumlah ${subReport.namasub1}`,
        bulanini : jmlSumblnini,
        bulanlalu : jmlSumblnlalu,
        lebihkurang : numtoFl(fltoNum(jmlSumblnini)-fltoNum(jmlSumblnlalu)),    
        persentase :  cariPersentase(jmlSumblnini,jmlSumblnlalu),
        clsname : 'py-1 pl-1 font-bold'          
      } 
      
      rep.push(footerSub1)

    }


    subReport.namasub4 = akt.namasub4;

    subReport.sub4 = thisSub4;
    subReport.namasub4 = akt.namasub4;

    subReport.sub3 = thisSub3;
    subReport.namasub3 = akt.namasub3;

    subReport.sub1 = thisSub1;
    subReport.namasub1 = akt.namasub1;


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
    console.log(tahunlalu);
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
    const exeNrcblnini : number   = await prismadb.$executeRaw`CALL ex_nrc_detail(${selectParamValue.awaltahun},${selectParamValue.bulanini},${selectParamValue.bulanlalu},${username});` 
    const aktivaBlnIni : any[] = await prismadb.$queryRaw(
      Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="AKTIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
    )
    const pasivaBlnIni : any[] = await prismadb.$queryRaw(
      Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="PASIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
    )


    let aktivaFinal =  aktivaBlnIni.map(v => {return {...v,blnlalu : 0 }});
    let pasivaFinal =  pasivaBlnIni.map(v => {return {...v,blnlalu : 0 }});

    if (selectParamValueBlnlalu !== null) {
      const exeNrcblnlalu : number   = await prismadb.$executeRaw`CALL ex_nrc_detail(${selectParamValueBlnlalu.awaltahun},${selectParamValueBlnlalu.bulanini},${selectParamValueBlnlalu.bulanlalu},${username});` 
      if (exeNrcblnlalu > 0) {
        const aktivaBlnlalu : any[] = await prismadb.$queryRaw(
          Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="AKTIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
        )
        const pasivaBlnlalu : any[] = await prismadb.$queryRaw(
          Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="PASIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
        )
        aktivaFinal = genDataFinal(aktivaBlnIni,aktivaBlnlalu);

        pasivaFinal = genDataFinal(pasivaBlnIni,pasivaBlnlalu);
      }
    } else {
      const exeNrcblnlalu : number   = await prismadb.$executeRaw`CALL ex_nrc_detail(${parameterValueTahunLalu.awaltahun},${parameterValueTahunLalu.bulanini},${parameterValueTahunLalu.bulanlalu},${username});`
      if (exeNrcblnlalu > 0) {
        const aktivaBlnlalu : any[] = await prismadb.$queryRaw(
          Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="AKTIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
        )
        const pasivaBlnlalu : any[] = await prismadb.$queryRaw(
          Prisma.sql`SELECT * FROM dump_nrc WHERE namasub1="PASIVA" and nmuser=${username} and (blnini+blnlalu)<>0 order by kode` 
        )    

        aktivaFinal = genDataFinal(aktivaBlnIni,aktivaBlnlalu);

        pasivaFinal = genDataFinal(pasivaBlnIni,pasivaBlnlalu);        
        
      }
    }
  
    

    const dataBulanIni : GenRep[] = genRep(aktivaFinal,pasivaFinal) 

    const dataBulanIniCur =  dataBulanIni.map(val => {
      let fValue =  val;
      if (fValue.bulanini as string !== "") {
        const dumpblnIni = parseFloat((val.bulanini as number).toFixed(2))
        const dumpblnlalu = parseFloat((val.bulanlalu as number).toFixed(2))
        const dumpblnselisih = parseFloat((val.lebihkurang as number).toFixed(2))
        const dumpblnpersentase = parseFloat((val.persentase as number).toFixed(2))
        fValue = { ...val,bulanini : formatNumber(dumpblnIni),bulanlalu : formatNumber(dumpblnlalu),lebihkurang : formatNumber(dumpblnselisih),persentase : formatNumber(dumpblnpersentase) }
      }     
      return  fValue
    })


    console.log(periode,tanggalreport);
    // let ttd : DataTtd[] = [defaultDataTtd]

    const ttd = await GenTTD('nrc1',username).then((res)=>{ return res;});

    const finalResponse : FinalResponse = {
      dataneraca : dataBulanIniCur,
      datattd : ttd
    }
 
    return NextResponse.json(finalResponse,{status : 200})    
  } catch (error) {
    console.log(error);
    return NextResponse.json(error,{status : 400})    
  }
  
}