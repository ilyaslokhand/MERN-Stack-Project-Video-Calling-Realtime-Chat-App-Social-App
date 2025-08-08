import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from 'react'
import { logoutUser } from "../Lib/Api";
import toast from "react-hot-toast";

const useLogout = () => {
  

  const QueryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success("user logout successfully");
      QueryClient.invalidateQueries({ queryKey: ["authuser"] });
     
    },
  });

  return { mutate, isError, isPending, error };
};

export default useLogout
