'use client';
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation'
import { onGetAk } from '@/services/api';
import useSWR from 'swr'
import { FinalResponseL } from '@/types/repak';
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
  const { data: aruskas, error, isLoading } = useSWR(['/aruskas/tidaklangsung', {periode : searchParams.get('periode'), tanggalreport : tanggalreport }], ([url,params]) =>onGetAk(url,params))
  const akObj = aruskas as FinalResponseL 
  
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
        <HeaderLap periode={searchParams.get('periode') || ""} judul='LAPORAN ARUSKAS METODE TIDAK LANGSUNG'/>

        <Table className='table'>
          <TableHeader>
            <TableRow  className="">
              <TableHead className="w-[550px] border py-0 px-1 h-6 font-bold " >URAIAN</TableHead>
              <TableHead className='border p-0 h-6 font-bold text-center' >JUMLAH</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>


            {akObj.dataak.map(ak => {

                return (
                  <TableRow key={ak.idx} className='p-0 border-0 leading-[16px]'>
                    <TableCell className={`${ak.clsname} text-left text-[11px] `}>{ak.uraian}</TableCell>
                    <TableCell className={cn(ak.clsname,'py-0 px-1 text-right  text-[11px]  border-r ')}>{ak.jumlah}</TableCell>
                  </TableRow>
                )
              })

              }
          </TableBody>
        </Table>
        <FooterLap datattd={akObj.datattd} tanggalreport={tanggalreport} kota='Probolinggo'/>
      </div>
    </div>
    </>
  )
}
