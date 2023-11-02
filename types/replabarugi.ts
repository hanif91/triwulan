import { DataTtd } from "./ttd"
export type RepLr = {
  uraian : string,
  blnanggaran: number | string,
  blnrealisasi: number | string,
  blnlebihkurang: number | string,
  blnpersentase: number | string,
  realisasi: number| string,
  anggaran: number | string,
  lebihkurang: number| string,
  persentase: number| string,
  clsname : string   
}

export type LrfirstStep = {
  kodeetap: string,
  uraian: string,
  header: string,
  kelompok1: string ,
  kelompok2: string,
  kodesak:string,
  footerheader: string,
  footerkelompok1: string ,
  blnrealisasisum: number,
  blnanggaransum: number,
  anggaransum: number,
  realisasisum: number,
  blnanggaran: number,
  blnrealisasi: number,
  blnlebihkurang: number,
  blnpersentase: number,
  realisasi: number,
  anggaran: number,
  lebihkurang: number,
  persentase: number
}


export type LrlastStep = {
  uraian: string,
  blnrealisasisum: number,
  blnanggaransum: number,
  anggaransum: number,
  realisasisum: number,
  blnlebihkurangsum: number,
  blnpresentase: number,
  lebihkurangsum: number,
  presentase: number
}


export type FinalResponse = {
  datalabarugi : RepLr[],
  datattd : DataTtd
}

