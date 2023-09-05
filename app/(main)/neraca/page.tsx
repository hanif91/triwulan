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
import NeracaSchema from '@/lib/form-neraca';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Periode from '@/components/periode';

// export const getServerSideProps: GetServerSideProps<{
//   periodeData: PeriodeData[]
// }> = async () => {
//   const res = await fetch('http://localhost:3000/api/extra/periode')
//   const periodeData = await res.json()
//   return { props: { periodeData } }
// }

// const languages = [
//   { label: "English", value: "en" },
//   { label: "French", value: "fr" },
//   { label: "German", value: "de" },
//   { label: "Spanish", value: "es" },
//   { label: "Portuguese", value: "pt" },
//   { label: "Russian", value: "ru" },
//   { label: "Japanese", value: "ja" },
//   { label: "Korean", value: "ko" },
//   { label: "Chinese", value: "zh" },
// ] as const

export default function page() {
  const form = useForm<z.infer<typeof NeracaSchema>>({
    resolver: zodResolver(NeracaSchema),
  });

  async function onSubmit(values: z.infer<typeof NeracaSchema>) {
    // console.log(periodeData)
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
                    />
                    <FormLabel>Opsi Laporan</FormLabel>
                    <Periode
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    />


                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" variant={'default'} className="w-full mt-5">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
