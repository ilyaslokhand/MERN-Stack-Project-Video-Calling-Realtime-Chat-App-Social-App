import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useauthUser from "../Hooks/useauthUser";
import { getStreamToken } from "../Lib/Api";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from '@stream-io/video-react-sdk';
import toast from "react-hot-toast";
import PageLoader from "../Component/PageLoader";
import { useQuery } from "@tanstack/react-query";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


const Call = () => {
  const { id:callId } = useParams();
  const {authUser, isLoading} = useauthUser();
  const [client, setclient] = useState(null);
  const [call, setcall] = useState(null);
  const [isconnecting, setisconnecting] = useState(true);

    const { data: tokenData } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });


  useEffect(()=>{
    const initCall = async ()=>{
    if(!authUser || !tokenData?.data || !callId ) return null;
    try {
      const user = {
        id:authUser?._id || authUser?.id,
        name: authUser?.fullName,
        image: authUser?.profilepic
      }

      const Videoclient = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user,
        token: tokenData?.data
      })

      const call = Videoclient.call('default',callId);
      await call.join({ create: true });
      setclient(Videoclient);
      setcall(call)
      
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Could not join the call. Please try again.");
    }
    finally {
    setisconnecting(false);
    }
    };
    initCall()
  },[authUser,tokenData,callId])

  if (isLoading || isconnecting) return <PageLoader />;

  return (
  <div className="flex justify-center items-center flex-col h-screen">
   <div>
    {client && call ? (
      <div>
        <StreamVideo client={client}>
          <StreamCall call={call}>
         <CallContent/>
          </StreamCall>
        </StreamVideo>
      </div>
    ):(
      <div className="flex justify-center items-center h-full">
        <p>Could not initialize call. Please refresh or try again later.</p>
      </div>
    )}
   </div>
  </div>
  )
};

export default Call;


export const CallContent = ()=>{
  const { useCallCallingState } = useCallStateHooks(); // 
  const callingState = useCallCallingState(); // useCallCallingState() call ka current status batata hai (jaise JOINING, JOINED, LEFT etc.).
  const navigate = useNavigate();
  if (callingState === CallingState.LEFT) return navigate("/"); //   // agar call ka state "LEFT" ho jaye (yaani user call se nikal gaya)
   
    return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};
