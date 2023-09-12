import useSWR from 'swr'

import * as api from '@/services/api'

export const useNeraca = () => {

    const { data, error, isLoading } = useSWR(`neraca`, () => api.onGetNeraca("/neraca",{neraca : "string"}))
   
    return {
      neraca: data,
      isLoading,
      isError: error
    }
  }