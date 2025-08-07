import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { currentUser } from '../Lib/Api';

const useauthUser = () => {
  const authUser = useQuery({
    queryKey: ["authuser"],
    queryFn: currentUser,
    retry: false,
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.data,
  };
};


export default useauthUser
