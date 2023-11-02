'use client';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import LrSchema from '@/lib/lr-schema';
import { cn } from '@/lib/utils';
import { format } from "date-fns"
import { Button } from '@/components/ui/button';
import Periode from '@/components/periode';
import DatePicker from '@/components/datepicker';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function Page() {
  const router = useRouter();


  const form = useForm<z.infer<typeof LrSchema>>({
    resolver: zodResolver(LrSchema),
  });
  async function onSubmit(values: z.infer<typeof LrSchema>) {
    const {periode,anggaran,tanggalreport } = values;
    const myDate  = format(tanggalreport, "dd-MMMM-yyyy")
    console.log(myDate)
    router.push(`/labarugi/saketap?periode=${periode}&tanggalreport=${myDate}&anggaran=${anggaran}`);
  }
  return (
    <>
      <div className="w-full h-full px-2 py-4 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-3 w-full">
              <FormField
                control={form.control}
                name="periode"
                render={({ field }) => (
                  <FormItem className="space-y-2 flex flex-col ">
                    <FormLabel>Periode</FormLabel>
                    <Periode
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key="lrpop11"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="anggaran"
                render={({ field }) => (
                  <FormItem className="space-y-2 flex flex-col ">
                    <FormLabel>Opsi Anggaran</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} key="opsianggaran2">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Opsi Anggaran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent key="opsianggaran3">
                            <SelectItem value="0" key="op0">S/d bulan ini</SelectItem>
                            <SelectItem value="1" key="op1">S/d tahun ini</SelectItem>
                      </SelectContent>
              
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanggalreport"
                render={({ field }) => (
                  <FormItem className="space-y-2 flex flex-col w-full">
                    <FormLabel>Tanggal Laporan</FormLabel>
                    <div  className="w-full">
                    <DatePicker
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    
                    />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          
            <div className='w-full flex justify-end  mt-3 pt-2'>
  
              <Button type="submit" variant={'default'} className="w-32 items-end ">
                Tampilkan
              </Button>
            </div>


          </form>
        </Form>
      </div>
    </>
  );
}
