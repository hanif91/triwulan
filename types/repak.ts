import { DataTtd } from "./ttd"
export type RepAk = {
  uraian : string,
  jumlah: number | string,
  jumlahsd: number | string,
  anggaranini: number | string,
  anggaransdini: number | string,
  lebihkurang : number | string,
  lebihkurangsd : number | string,
  clsname : string   
}

export type RepAkL = {
  idx : number | string,
  uraian : string,
  jumlah: number | string,
  clsname : string   
}

export type Ak1 = {
    id: number,
    namatipe: string,
    modtipe: string,
    tipe: string,
    jumlah: number,
    jml1sum: number,
    kodetipe: string,
    kodemodtipe: string,
    jumlahsd: number,
    jmlsd1sum: number,
    anggaranini: number,
    anggaraninisum: number,
    anggaransdini: number,
    anggaransdinisum: number
}


export type AkSa = {
  id: number,
  namatipe: string,
  tipe: string,
  saldoawal: number,
  saldoawalsum: number,
  saldoawalsd2: number,
  saldoawalsd2sum: number,
  anggaranini: number,
  anggaraninisum: number,
  sdanggaranini: number,
}

export type AkSaL = {
  idx: number,
  nama: string,
  jumlah: number,
  flagheader: number,
  nmuser: string,
}


export type FinalResponse = {
  dataak : RepAk[],
  datattd : DataTtd
}

export type FinalResponseL = {
  dataak : RepAkL[],
  datattd : DataTtd
}

