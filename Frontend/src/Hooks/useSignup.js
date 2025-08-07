// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import React from 'react'
// import { Singup } from '../Lib/Api';

// const useSignup = () => {
//   const QueryClient = useQueryClient();
//    const {mutate, isPending, error, isError} = useMutation({
//     mutationFn: Singup,
//     onSuccess: ()=>{
//       toast.success("User loggedin Successfully")
//       QueryClient.invalidateQueries({ queryKey: ["authuser"]});
//     }
//   })
//   return {mutate, isPending, isError,error}
// }

// export default useSignup
