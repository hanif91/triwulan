'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation'
import { onGetNeraca } from '@/services/api';
import useSWR from 'swr'
// const fetcher = onGetNeraca('/neraca',);

export default function page() {

  const router = useRouter();
  const searchParams = useSearchParams()
  const { data: neraca, error, isLoading } = useSWR(['/neraca/detail', {periode : searchParams.get('periode'), tanggalreport : searchParams.get('tanggalreport')}], ([url,params]) =>onGetNeraca(url,params))

  const periode = searchParams.get('tanggal')
  
  // console.log(neraca)

  
  return (
    <div>
      this Detailpage
    </div>
  )
}
