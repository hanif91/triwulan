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
import  AruskasSchema  from '@/lib/aruskas-schema';
import { cn } from '@/lib/utils';
import { format } from "date-fns"
import { Button } from '@/components/ui/button';
import Periode from '@/components/periode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from '@/components/datepicker';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';



export default function Page() {
  const router = useRouter();
  const { toast } = useToast()
  const form = useForm<z.infer<typeof AruskasSchema>>({
    resolver: zodResolver(AruskasSchema),
  });
  async function onSubmit(values: z.infer<typeof AruskasSchema>) {
    const {periode,opsireport,tanggalreport } = values;
    const myDate  = format(tanggalreport, "dd-MMMM-yyyy")
    console.log(myDate)
    if (opsireport === "0") {
      router.push(`/aruskas/langsung?periode=${periode}&tanggalreport=${myDate}`);
    } else {
      router.push(`/aruskas/tidaklangsung?periode=${periode}&tanggalreport=${myDate}`);
    }
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
                      key="pop11"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="opsireport"
                render={({ field }) => (
                  <FormItem className="space-y-2 flex flex-col ">
                    <FormLabel>Opsi Laporan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} key="opsireport2">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Opsi Laporan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent key="opsireport3">
                            <SelectItem value="0" key="op0">METODE LANGSUNG</SelectItem>
                            <SelectItem value="1" key="op1">TIDAK LANGSUNG</SelectItem>
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
