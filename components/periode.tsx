'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
} from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PeriodeData,PeriodeTriwulan } from "@/types/extra";
import { useEffect, useState } from "react";
import { useOrigin } from "@/hooks/origins";

export default function Periode({onValueChange , defaultValue } : { onValueChange : any, defaultValue? : string}) {
  const [periodeData, setPeriodeData] = useState<PeriodeTriwulan[]>([])
  // const origin = useOrigin();
  // console.log(origin);
  useEffect(() => {

    const fetchPeriode = async () => {
      const res = await fetch(`${origin}/api/extra/periode`)
      const periodeData = await res.json()
      setPeriodeData(periodeData)
    }
    
    
    fetchPeriode();
  }, [])
  return (
      <Select onValueChange={onValueChange} defaultValue={defaultValue} >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a Periode" />
            </SelectTrigger>
          </FormControl>
          <SelectContent >
            <ScrollArea className="h-52 w-full rounded-md border">
              {periodeData.map((periode) => (
                <SelectItem value={periode.valuetriwulan} key={periode.valuetriwulan}>{periode.nama}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
  
      </Select>
  )
}
