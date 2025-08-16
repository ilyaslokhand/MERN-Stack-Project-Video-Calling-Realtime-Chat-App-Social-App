import React, { useEffect, useState } from "react";
import { getStreamToken } from "../Lib/Api";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useauthUser from "../Hooks/useauthUser";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Chat = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setchatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isloading, setisloading] = useState(true);
  const { authUser } = useauthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  console.log("tokenData", tokenData);

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.data && !authUser) return null;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY); // Ye line ek chat client banati hai jisme tumhara API key use hota hai, taki tum messages bhej/receive kar sako aur Stream ke chat system ke saath connect ho sako."
        await client.connectUser(
          {
            id: authUser?._id,
            fullName: authUser?.fullName,
            image: authUser?.profilepic,
          },
          tokenData.data
        );
      } catch (error) {}
    };
  }, []);

  return <div>ok</div>;
};

export default Chat;
