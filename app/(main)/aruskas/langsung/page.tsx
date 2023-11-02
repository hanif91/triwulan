'use client';
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation'
import { onGetAk } from '@/services/api';
import useSWR from 'swr'
import { FinalResponse } from '@/types/repak';
// const fetcher = onGetNeraca('/neraca',);
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils';
import HeaderLap from '@/components/header-lap';
import ReactToPrint from 'react-to-print';
import styles from './styles.module.css'
import Image from 'next/image';
import { logos } from '@/data/DataImages';
import { Button } from '@/components/ui/button';
import FooterLap from '@/components/footer-lap';
import { match } from 'assert';


export default function page() {

  const router = useRouter();
  const searchParams = useSearchParams()
  const componentRef = useRef<HTMLDivElement>(null)
  const tanggalreport : string = searchParams.get('tanggalreport') || ""
  const { data: aruskas, error, isLoading } = useSWR(['/aruskas/langsung', {periode : searchParams.get('periode'), tanggalreport : tanggalreport }], ([url,params]) =>onGetAk(url,params))
  const akObj = aruskas as FinalResponse 
  
  if(isLoading){
    return <div>Loading .... </div>
  }

  if(error){
    return <div>Error .... </div>
  }



  return (
    <>
    <div className='w-[297mm] mx-auto border-2 shadow-lg'>
      <div>
      <ReactToPrint 
        trigger={()=>{ return (
        
          <div className='my-2 w-[297mm] flex justify-end'>
            <Button className='mx-[20px] '>Print Laporan</Button>
          </div>
          ) 
        }}
        content={()=> componentRef.current }
      />
      </div>
      <div ref={componentRef} className={`${styles.basereport} overflow-auto border-t`}>

        {/* <Image
              src={logos[0].src}
              alt="logo"
              width={75}
              height={logos[0].height}
            /> */}
        <HeaderLap periode={searchParams.get('periode') || ""} judul='LAPORAN ARUSKAS METODE LANGSUNG'/>

        <Table className='table'>
          <TableHeader>
            <TableRow  className="">
              <TableHead className="w-[300px] border py-0 pl-1 h-6 font-bold " rowSpan={2}>Uraian</TableHead>
              <TableHead className='border p-0 h-6 font-bold text-center' colSpan={2}>REALISASI</TableHead>
              <TableHead className="border p-0 h-6 font-bold text-center" colSpan={2}>ANGGARAN</TableHead>
              <TableHead className='border p-0 h-6 font-bold text-center' colSpan={2}>SELISIH</TableHead>
            </TableRow>
            <TableRow>

              <TableHead className='border p-0 h-6 font-bold text-xs text-center' >TRIWULAN INI</TableHead>
              <TableHead className='border p-0 h-6 font-bold text-xs text-center'>S/D TRIWULAN INI</TableHead>
              

              <TableHead className='border p-0 h-6 font-bold text-xs text-center' >TRIWULAN INI</TableHead>
              <TableHead className='border p-0 h-6 font-bold text-xs text-center'>S/D TRIWULAN INI</TableHead>

              <TableHead className='border p-0 h-6 font-bold text-xs text-center' >TRIWULAN INI</TableHead>
              <TableHead className='border p-0 h-6 font-bold text-xs text-center'>S/D TRIWULAN INI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>


            {akObj.dataak.map(ak => {
                // let clsName : string = ""; 
                // if(neraca.uraian === "Jumlah Kas / Bank") {
                //   clsName = "font-bold"
                // } else {
                //   clsName = "font-normal"
                // }
                return (
                  <TableRow key={Math.random()} className='p-0 border-0 leading-[16px]'>
                    <TableCell className={`${ak.clsname} text-left text-[11px] `}>{ak.uraian}</TableCell>
                    <TableCell className={cn(ak.clsname,'py-0 px-1 text-right  text-[11px] ')}>{ak.jumlah}</TableCell>
                    <TableCell className={cn(ak.clsname,'py-0 px-1 text-right  text-[11px] ')}>{ak.jumlahsd}</TableCell>
                    <TableCell className={cn(ak.clsname,'py-0 px-1 text-right  text-[11px] ')}>{ak.anggaranini}</TableCell>
                    <TableCell className={cn(ak.clsname,'py-0 px-1 text-right  text-[11px] ')}>{ak.anggaransdini}</TableCell>
                    <TableCell className={cn(ak.clsname,'py-0 px-1 text-right  text-[11px] ')}>{ak.lebihkurang}</TableCell>
                    <TableCell className={cn(ak.clsname,'py-0 px-1 text-right border-r text-[11px] ')}>{ak.lebihkurangsd}</TableCell>
                  </TableRow>
                )
              })

              }
          </TableBody>
        </Table>
        <FooterLap datattd={akObj.datattd} tanggalreport={tanggalreport} kota='Probolinggo'/>

        {/* <table>
          <tr>
    
              <th className="w-[350px] border font-bold">Uraian</th>
              <th className='border font-bold'>Triwulan ini</th>
              <th className='border font-bold'>Triwulan Lalu</th>
              <th className="border font-bold">Selisih</th>
              <th className="w-[75px] border font-bold">%</th>
          </tr>

          {neracaArray.map(neraca => {
                // let clsName : string = ""; 
                // if(neraca.uraian === "Jumlah Kas / Bank") {
                //   clsName = "font-bold"
                // } else {
                //   clsName = "font-normal"
                // }
                return (
                  <tr key={neraca.uraian}>
                    <td className={`${neraca.clsname} text-left border`}>{neraca.uraian}</td>
                    <td className={cn(neraca.clsname,'p-1 text-right border')}>{neraca.bulanini}</td>
                    <td className={cn(neraca.clsname,'p-1 text-right border')}>{neraca.bulanlalu}</td>
                    <td className={cn(neraca.clsname,'p-1 text-right border')}>{neraca.lebihkurang}</td>
                    <td className={cn(neraca.clsname,'p-1 text-right border')}>{neraca.persentase}</td>
                  </tr>
                )
              })

            }

        </table> */}
      </div>
    </div>
    </>
  )
}
