'use client';
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation'
import { onGetNeraca } from '@/services/api';
import useSWR from 'swr'
import { FinalResponse, RepNeraca } from '@/types/repneraca';
import NeracaTable from './data-table';
import { columns } from './columns';
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
  const { data: neraca, error, isLoading } = useSWR(['/neraca/detail', {periode : searchParams.get('periode'), tanggalreport : tanggalreport}], ([url,params]) =>onGetNeraca(url,params))
  const neracaObj = neraca as FinalResponse 
  if(isLoading){
    return <div>Loading .... </div>
  }

  if(error){
    return <div>Error .... </div>
  }


  return (
    <>
    <div className='w-[210mm] mx-auto border-2 shadow-lg'>
      <div>
      <ReactToPrint 
        trigger={()=>{ return (
        
          <div className='my-2 w-[210mm] flex justify-end'>
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
        <HeaderLap periode={searchParams.get('periode') || ""} judul='LAPORAN NERACA DETAIL'/>

        <Table className='table'>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px] border font-bold">Uraian</TableHead>
              <TableHead className='border font-bold'>Triwulan ini</TableHead>
              <TableHead className='border font-bold'>Triwulan Lalu</TableHead>
              <TableHead className="border font-bold">Selisih</TableHead>
              <TableHead className="border font-bold">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>


            {neracaObj.dataneraca.map(neraca => {
                // let clsName : string = ""; 
                // if(neraca.uraian === "Jumlah Kas / Bank") {
                //   clsName = "font-bold"
                // } else {
                //   clsName = "font-normal"
                // }
                return (
                  <TableRow key={neraca.uraian}>
                    <TableCell className={`${neraca.clsname} text-left text-xs border`}>{neraca.uraian}</TableCell>
                    <TableCell className={cn(neraca.clsname,'p-[2px] text-right border text-xs')}>{neraca.bulanini}</TableCell>
                    <TableCell className={cn(neraca.clsname,'p-[2px] text-right border text-xs')}>{neraca.bulanlalu}</TableCell>
                    <TableCell className={cn(neraca.clsname,'p-[2px] text-right border text-xs')}>{neraca.lebihkurang}</TableCell>
                    <TableCell className={cn(neraca.clsname,'p-[2px] text-right border text-xs')}>{neraca.persentase}</TableCell>
                  </TableRow>
                )
              })

              }
          </TableBody>
        </Table>
        <FooterLap datattd={neracaObj.datattd} tanggalreport={tanggalreport} kota='Probolinggo'/>

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
