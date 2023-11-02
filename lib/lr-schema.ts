import * as z from "zod"



const LrSchema = z.object({
  periode: z.string({required_error : "please select periode"}),
  anggaran: z.string({required_error : "please opsi anggaran"}),
  tanggalreport : z.date({required_error : "please select tanggal"})
})


export default LrSchema