'use client';
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation'
import { onGetNeraca,onGetLR } from '@/services/api';
import useSWR from 'swr'
import { FinalResponse, RepLr } from '@/types/replabarugi';
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


export default function Page() {

  const router = useRouter();
  const searchParams = useSearchParams()
  const componentRef = useRef<HTMLDivElement>(null)
  const tanggalreport : string = searchParams.get('tanggalreport') || ""
  const fjudulsd = (val : string) : string => {
    if (val === "0"){
      return "Sampai Dengan Bulan Ini"
    } else{
      return "Sampai Dengan Tahun Ini"
    }
  }
  const judulsd : string = fjudulsd(searchParams.get('anggaran') || "0")
  const { data: labarugi, error, isLoading } = useSWR(['/labarugi/saketap', {periode : searchParams.get('periode'), tanggalreport : tanggalreport,anggaran : searchParams.get('anggaran')}], ([url,params]) =>onGetLR(url,params))
  const lrObj = labarugi as FinalResponse 
  
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
        <HeaderLap periode={searchParams.get('periode') || ""} judul='LAPORAN LABA RUGI SAKETAP'/>

        <Table className='table'>
          <TableHeader>
            <TableRow  className="">
              <TableHead className="w-[350px] border h-8 font-bold" rowSpan={2}>Uraian</TableHead>
              <TableHead className='border h-8 font-bold text-center' colSpan={4}>Triwulan ini</TableHead>
              <TableHead className="border h-8 font-bold text-center" colSpan={4}>{judulsd}</TableHead>
            </TableRow>
            <TableRow>

              <TableHead className='border h-8 font-bold' >Realisasi</TableHead>
              <TableHead className='border h-8 font-bold'>Anggaran</TableHead>
              <TableHead className="border h-8 font-bold">Selisih</TableHead>
              <TableHead className="border h-8 font-bold">%</TableHead>
              
              <TableHead className='border h-8 font-bold' >Realisasi</TableHead>
              <TableHead className='border h-8 font-bold'>Anggaran</TableHead>
              <TableHead className="border h-8 font-bold">Selisih</TableHead>
              <TableHead className="border h-8 font-bold">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>


            {lrObj.datalabarugi.map(lr => {
                // let clsName : string = ""; 
                // if(neraca.uraian === "Jumlah Kas / Bank") {
                //   clsName = "font-bold"
                // } else {
                //   clsName = "font-normal"
                // }
                return (
                  <TableRow key={lr.uraian}>
                    <TableCell className={`${lr.clsname} text-left text-xs border`}>{lr.uraian}</TableCell>
                    <TableCell className={cn(lr.clsname,'p-[2px] text-right border text-xs')}>{lr.blnrealisasi}</TableCell>
                    <TableCell className={cn(lr.clsname,'p-[2px] text-right border text-xs')}>{lr.blnanggaran}</TableCell>
                    <TableCell className={cn(lr.clsname,'p-[2px] text-right border text-xs')}>{lr.blnlebihkurang}</TableCell>
                    <TableCell className={cn(lr.clsname,'p-[2px] text-right border text-xs')}>{lr.blnpersentase}</TableCell>
                    <TableCell className={cn(lr.clsname,'p-[2px] text-right border text-xs')}>{lr.realisasi}</TableCell>
                    <TableCell className={cn(lr.clsname,'p-[2px] text-right border text-xs')}>{lr.anggaran}</TableCell>
                    <TableCell className={cn(lr.clsname,'p-[2px] text-right border text-xs')}>{lr.lebihkurang}</TableCell>
                    <TableCell className={cn(lr.clsname,'p-[2px] text-right border text-xs')}>{lr.persentase}</TableCell>
                  </TableRow>
                )
              })

              }
          </TableBody>
        </Table>
        <FooterLap datattd={lrObj.datattd} tanggalreport={tanggalreport} kota='Probolinggo'/>

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
