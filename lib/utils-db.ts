import { Prisma } from "@prisma/client";
import prismadb from "./prismadb";
import { LrfirstStep, LrlastStep } from "@/types/replabarugi";
import { Ak1,AkSa,AkSaL } from "@/types/repak";

interface DataTtd {
  header1 : string,
  header2 : string,
  header3 : string,
  header4  : string,
  nama1 : string,
  jab1 : string,
  nik1 : string,
  nama2 : string,
  jab2 : string,
  nik2 : string,
  nama3 : string,
  jab3 : string,
  nik3 : string,
  nama4 : string,
  jab4 : string,
  nik4 : string,
  nama5 : string,
  jab5 : string,
  nik5 : string,

}


export async function GenTTD  (namalap : string,username : string) : Promise<DataTtd> {
  const ttdummy : any = await prismadb.$queryRaw(
    Prisma.sql`CALL isidatattd(${namalap},${username})` 
  ) 

  const result : DataTtd = {
    header1 : ttdummy[0].f0 as string,
    header2 : ttdummy[0].f1 as string,
    header3 : ttdummy[0].f2 as string,
    header4  : ttdummy[0].f3 as string,
    nama1 : ttdummy[0].f4 as string,
    jab1 : ttdummy[0].f5 as string,
    nik1 : ttdummy[0].f6 as string,
    nama2 : ttdummy[0].f7 as string,
    jab2 : ttdummy[0].f8 as string,
    nik2 : ttdummy[0].f9 as string,
    nama3 : ttdummy[0].f10 as string,
    jab3 : ttdummy[0].f11 as string,
    nik3 : ttdummy[0].f12 as string,
    nama4 : ttdummy[0].f13 as string,
    jab4 : ttdummy[0].f14 as string,
    nik4 : ttdummy[0].f15 as string,
    nama5 : ttdummy[0].f16 as string,
    jab5 : ttdummy[0].f17 as string,
    nik5 : ttdummy[0].f18 as string,
  };

  return result;
}


export async function GenLr1  (username : string) : Promise<LrfirstStep[]> {
  const result : LrfirstStep[] = await prismadb.$queryRaw(
    Prisma.sql`
    SELECT 
    c.kodeetap,
    c.uraian,
    c.header,c.kelompok1,c.kelompok2,
    c.kodesak,
    SUBSTRING_INDEX(c.header,". ",-1) AS footerheader,
    SUBSTRING_INDEX(c.kelompok1,".  ",-1) AS footerkelompok1,
    SUM(IF(c.kodesak="B",blnrealisasi*-1,blnrealisasi)) AS blnrealisasisum,
    SUM(IF(c.kodesak="B",blnanggaran*-1,blnanggaran)) AS blnanggaransum,
    SUM(IF(c.kodesak="B",anggaran*-1,anggaran)) AS anggaransum,
    SUM(IF(c.kodesak="B",realisasi*-1,realisasi)) AS realisasisum,
    SUM(blnanggaran) AS blnanggaran,
    SUM(blnrealisasi) AS blnrealisasi,
    SUM(blnlebihkurang) AS blnlebihkurang,
    SUM(blnpersentase) AS blnpersentase,
    SUM(realisasi) AS realisasi,
    SUM(anggaran) AS anggaran,
    SUM(lebihkurang) AS lebihkurang,
    SUM(persentase) AS persentase
    FROM dump_lr a LEFT JOIN coa b ON a.kode=b.kodeakun LEFT JOIN akunetap c ON b.kodeetap=c.kodeetap WHERE nmuser=${username} and c.kodeetap<>"H1" GROUP BY kodeetap
    ORDER BY kodeetap`
  )

  return result;
}
  

export async function GenLr2  (username : string) : Promise<LrfirstStep[]> {
  const result : LrfirstStep[] = await prismadb.$queryRaw(
    Prisma.sql`
      SELECT 
      c.kodeetap,
      c.uraian,
      c.header,c.kelompok1,c.kelompok2,
      c.kodesak,
      SUBSTRING_INDEX(c.header,". ",-1) AS footerheader,
      SUBSTRING_INDEX(c.kelompok1,".  ",-1) AS footerkelompok1,
      SUM(IF(c.kodesak="B",blnrealisasi*-1,blnrealisasi)) AS blnrealisasisum,
      SUM(IF(c.kodesak="B",blnanggaran*-1,blnanggaran)) AS blnanggaransum,
      SUM(IF(c.kodesak="B",anggaran*-1,anggaran)) AS anggaransum,
      SUM(IF(c.kodesak="B",realisasi*-1,realisasi)) AS realisasisum,
      SUM(blnanggaran) AS blnanggaran,
      SUM(blnrealisasi) AS blnrealisasi,
      SUM(blnlebihkurang) AS blnlebihkurang,
      SUM(blnpersentase) AS blnpersentase,
      SUM(realisasi) AS realisasi,
      SUM(anggaran) AS anggaran,
      SUM(lebihkurang) AS lebihkurang,
      SUM(persentase) AS persentase
      FROM dump_lr a LEFT JOIN coa b ON a.kode=b.kodeakun LEFT JOIN akunetap c ON b.kodeetap=c.kodeetap WHERE nmuser=${username} and c.kodeetap="H1" GROUP BY kodeetap
      ORDER BY kodeetap
      `
  )

  return result;
}

export async function GenLr3  (username : string) : Promise<LrlastStep[]> {
  const result : LrlastStep[] = await prismadb.$queryRaw(
    Prisma.sql`
    SELECT 
    "I.  LABA (RUGI) BERSIH" AS uraian,SUM(blnrealisasisum) AS blnrealisasisum,SUM(blnanggaransum) AS blnanggaransum,SUM(anggaransum) AS anggaransum,SUM(realisasisum) AS realisasisum,
    (COALESCE(SUM(blnrealisasisum),0)-COALESCE(SUM(blnanggaransum),0)) AS blnlebihkurangsum,
    IF(COALESCE(SUM(blnanggaransum),0)<>0,
    IF(COALESCE(SUM(blnrealisasisum),0)=0,0,(COALESCE(SUM(blnrealisasisum),0)-COALESCE(SUM(blnanggaransum),0))/COALESCE(SUM(blnanggaransum),0)*100),0) AS blnpresentase,
    (COALESCE(SUM(realisasisum),0)-COALESCE(SUM(anggaransum),0)) AS lebihkurangsum,
    IF(COALESCE(SUM(anggaransum),0)<>0,
    IF(COALESCE(SUM(realisasisum),0)=0,0,(COALESCE(SUM(realisasisum),0)-COALESCE(SUM(anggaransum),0))/COALESCE(SUM(anggaransum),0)*100),0) AS presentase
    FROM (SELECT 
    c.kodeetap,
    c.uraian,
    c.header,c.kelompok1,c.kelompok2,
    c.kodesak,
    SUBSTRING_INDEX(c.header,". ",-1) AS footerheader,
    SUBSTRING_INDEX(c.kelompok1,".  ",-1) AS footerkelompok1,
    SUM(IF(c.kodesak="B",blnrealisasi*-1,blnrealisasi)) AS blnrealisasisum,
    SUM(IF(c.kodesak="B",blnanggaran*-1,blnanggaran)) AS blnanggaransum,
    SUM(IF(c.kodesak="B",anggaran*-1,anggaran)) AS anggaransum,
    SUM(IF(c.kodesak="B",realisasi*-1,realisasi)) AS realisasisum,
    SUM(blnanggaran) AS blnanggaran,
    SUM(blnrealisasi) AS blnrealisasi,
    SUM(blnlebihkurang) AS blnlebihkurang,
    SUM(blnpersentase) AS blnpersentase,
    SUM(realisasi) AS realisasi,
    SUM(anggaran) AS anggaran,
    SUM(lebihkurang) AS lebihkurang,
    SUM(persentase) AS persentase
    FROM dump_lr a LEFT JOIN coa b ON a.kode=b.kodeakun LEFT JOIN akunetap c ON b.kodeetap=c.kodeetap WHERE nmuser=${username} GROUP BY kodeetap
    ORDER BY kodeetap) a
      `
  )

  return result;
}


export async function GenAk  (periode : string) : Promise<Ak1[]> {
  const thn : string = periode.substring(0,4);
  const result : Ak1[] = await prismadb.$queryRaw(
    Prisma.sql`
    SELECT b.id,b.namatipe,b.modtipe,b.tipe,IFNULL(a.jumlah,0) AS jumlah,IFNULL(IF(b.tipe="PENERIMAAN",a.jumlah,a.jumlah*-1),0) AS jml1sum,b.kodetipe,b.kodemodtipe,
    IFNULL(e.jumlah,0) AS jumlahsd,IFNULL(IF(b.tipe="PENERIMAAN",e.jumlah,e.jumlah*-1),0) AS jmlsd1sum,c.anggaran AS anggaranini,IFNULL(IF(b.tipe="PENERIMAAN",c.anggaran ,c.anggaran*-1),0) AS anggaraninisum,
    d.anggaran AS anggaransdini,IFNULL(IF(b.tipe="PENERIMAAN",d.anggaran ,d.anggaran*-1),0) AS anggaransdinisum FROM tipearuskas_l b LEFT JOIN 
    (SELECT SUM(a.kredit) AS jumlah,a.idaruskas FROM jurnal_kas a WHERE DATE_FORMAT(a.tanggal,"%Y%m") =  ${periode} AND YEAR(a.tanggal)=${thn} GROUP BY a.idaruskas) a  ON b.id=a.idaruskas
    LEFT JOIN (SELECT SUM(a.kredit) AS jumlah,a.idaruskas FROM jurnal_kas a WHERE DATE_FORMAT(a.tanggal,"%Y%m") <= ${periode} AND YEAR(a.tanggal)=${thn} GROUP BY a.idaruskas) e  ON b.id=e.idaruskas 
    LEFT JOIN anggaranpu c ON c.periode= ${periode} AND b.id=c.idaruskas 
    LEFT JOIN (SELECT SUM(anggaran) AS anggaran,idaruskas FROM anggaranpu WHERE periode<= ${periode} AND LEFT(periode,4)=${thn} GROUP BY idaruskas) d ON b.id=d.idaruskas
    WHERE b. id > 0 ORDER BY b.kodetipe,b.kodemodtipe,id    
      `
  )
  return result;
}

export async function GenAkSa  (periode : string) : Promise<AkSa[]> {
  const thn : string = periode.substring(0,4);
  const result : AkSa[] = await prismadb.$queryRaw(
    Prisma.sql`
      SELECT "0" AS id,"SALDO AWAL" AS namatipe,"0" as nol,"SALDO AWAL" AS tipe,SUM(jml) AS saldoawal,SUM(jml) AS saldoawalsum,SUM(jml2) AS saldoawalsd2,SUM(jml2) AS saldoawalsd2sum,b.anggaranini,b.anggaranini AS anggaraninisum,b.sdanggaranini,b.sdanggaranini AS sdanggaraninisum FROM (
      SELECT SUM(a.blnini) AS jml,SUM(a.blnini) AS jml2 FROM saldoawal a WHERE a.idcoa IN (SELECT idcoa FROM akunkas) AND a.tahun=${thn}
      UNION ALL
      SELECT SUM(IF(b.tipe="PENERIMAAN",a.kredit,a.kredit*-1)),0 FROM jurnal_kas a LEFT JOIN tipearuskas_l b ON a.idaruskas=b.id WHERE DATE_FORMAT(a.tanggal,"%Y%m") < ${periode} AND YEAR(a.tanggal)=${thn}
      )a 
      
      LEFT JOIN (
      SELECT 0 AS idaruskas,SUM(anggaranini) AS anggaranini,SUM(sdanggaranini) AS sdanggaranini FROM(
      SELECT * FROM (SELECT anggaran AS anggaranini,anggaran AS sdanggaranini  FROM anggaranpu WHERE LEFT(periode,4)=${thn} AND idaruskas="0" ORDER BY periode LIMIT 1) a
      UNION ALL
      SELECT SUM(IF(b.tipe="PENERIMAAN",a.anggaran,a.anggaran*-1)),0 FROM anggaranpu a LEFT JOIN tipearuskas_l b ON a.idaruskas=b.id WHERE a.periode = ${periode} AND LEFT(a.periode,4)=${thn} AND a.idaruskas>0
      UNION ALL
      SELECT 0,SUM(IF(b.tipe="PENERIMAAN",a.anggaran,a.anggaran*-1)) FROM anggaranpu a LEFT JOIN tipearuskas_l b ON a.idaruskas=b.id WHERE a.periode <= ${periode} AND LEFT(a.periode,4)=${thn} AND a.idaruskas>0
      ) a
      ) b ON 0=0        
      `
  )
  return result;
}




export async function GenAkl  (username : string) : Promise<AkSaL[]> {

  const resultdump : any[] = await prismadb.$queryRaw(
    Prisma.sql`
      CALL viewlapak(${username})  
      `)
  
    
      const result : AkSaL[] = resultdump.map((ak) => {
        const result : AkSaL = {
          idx : ak.f0 as number,
          nama : ak.f1 as string,
          jumlah : ak.f2 as number,
          flagheader  : ak.f3 as number,
          nmuser : ak.f4 as string,
        }
        return result;
      })
      
  return result;
}
