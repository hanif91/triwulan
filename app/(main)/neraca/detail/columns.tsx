"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { RepNeraca } from '@/types/repneraca';

export const columns : ColumnDef<RepNeraca>[] = [
  {
    header : "Uraian",
    accessorKey : "uraian"
  },
  {
    header : 'Triwulan Ini',
    accessorKey : 'bulanini'
  },
  {
    header : 'Triwulan lalu',
    accessorKey : 'bulanlalu'
  },
  {
    header : 'Selisih',
    accessorKey : 'lebihkurang'
  },
  {
    header : 'Persen',
    accessorKey : 'persentase'
  },
  {
    header : 'flagheader',
    enableHiding : true,
    cell : ({row}) => {
      const val : string = row.getValue("uraian");


      if (val === "Jumlah Kas / Bank") {
        return "sad"
      } else {
        console.log(val)
        return "dsa"
      }
    }
  }


]