import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { loginUser } from '../Lib/Api';
import toast from 'react-hot-toast';

const useLoggedinUser  = () => {
   const QueryClient = useQueryClient();
   const {mutate, isPending, error, isError} = useMutation({
    mutationFn: loginUser,
    onSuccess: ()=>{
      toast.success("User loggedin Successfully")
      QueryClient.invalidateQueries({ queryKey: ["authuser"]});
    }
  })
  return {mutate, error, isPending,isError}
}

export default useLoggedinUser ;
