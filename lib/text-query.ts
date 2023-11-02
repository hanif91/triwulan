

export const qLretap1 = (namauser : string) : string =>  {
  const query : string = `
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
  FROM dump_lr a LEFT JOIN coa b ON a.kode=b.kodeakun LEFT JOIN akunetap c ON b.kodeetap=c.kodeetap WHERE nmuser=${namauser} and c.kodeetap<>"H1" GROUP BY kodeetap
  ORDER BY kodeetap`
  
  return query
}