import { DataTtd } from "./ttd"
export type RepNeraca = {
  uraian : string,
  bulanini : number | string,
  bulanlalu : number | string,
  lebihkurang : number | string,    
  persentase : number | string,
  clsname : string   
}



export type GenRep = {
  uraian : string,
  bulanini : number | string,
  bulanlalu : number | string,
  lebihkurang : number | string,    
  persentase : number | string,
  clsname : string   
}

export type FinalResponse = {
  dataneraca : GenRep[],
  datattd : DataTtd
}

