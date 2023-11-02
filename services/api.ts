import NeracaSchema from "@/lib/schema";
import axios from "axios";
import * as z from 'zod';

const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';
const instance  = () => axios.create({
  baseURL: `${origin}/api`,
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

const onGetLR = async (url : string, params : any) => {
  // const onGetNeraca = async (url) => {
    try {
      const response = await onGet(url, params)
      return response.data
    } catch (error) {
      console.error(error)
    }
}

const onGetAk = async (url : string, params : any) => {
  // const onGetNeraca = async (url) => {
    try {
      const response = await onGet(url, params)
      return response.data
    } catch (error) {
      console.error(error)
    }
}

export { onGetNeraca,onGetLR,onGetAk }