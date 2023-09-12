import NeracaSchema from "@/lib/form-neraca";
import axios from "axios";
import * as z from 'zod';
const instance  = () => axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

const onGet = (url : string,params : any) => instance().get(url, { params: params })

const onGetNeraca = async (url : string, params : any) => {
// const onGetNeraca = async (url) => {
  try {
    const response = await onGet(url, params)

    return response.data
  } catch (error) {
    console.error(error)
  }
}

export { onGetNeraca }