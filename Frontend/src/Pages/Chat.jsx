import React, { useEffect, useState } from "react";
import { getStreamToken } from "../Lib/Api";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useauthUser from "../Hooks/useauthUser";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../Component/ChatLoader";
import { useCreateChatClient, Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import CallButton from "../Component/CallButton";



const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  console.log("targetUserId=>", targetUserId)
  const [chatClient, setchatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isloading, setisloading] = useState(true);
  const { authUser } = useauthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });


  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.data ||  !authUser) return null;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY); //👉 WhatsApp app kholte hi woh server se connect ho jaata hai.
        await client.connectUser( // WhatsApp ko bolna: "Main Ramesh hoon, ye mera profile aur mera ticket (token)."
          {
            id: authUser?._id,
            fullName: authUser?.fullName,
            image: authUser?.profilepic,
          },
          tokenData?.data
        );

        const channelID = [authUser?._id, targetUserId].sort().join('-') // 👉 Tum aur Ramesh ke beech hamesha ek same room ID hogi → me-ramesh.
// (Chahe tum start karo ya Ramesh, room hamesha same milega.)

        const channel = client.channel("messaging", channelID,{ // WhatsApp: "Mujhe ek room do jisme sirf main aur Ramesh baat karenge."
          members: [authUser._id, targetUserId],
          created_by_id: authUser._id,
        });
        await channel.create();
        await channel.watch(); // WhatsApp screen khol di, ab saare purane aur naye messages dikhne lagenge.
       setchatClient(client);
       setChannel(channel)
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      }
      finally {
        setisloading(false);
      }
    };
    initChat()
  }, [authUser, tokenData,targetUserId]);


  if (!chatClient || !channel || isloading) return <ChatLoader />;


  const handlevideocall = ()=>{
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({
        text:`Please join the video call using this link. ${callUrl}`
      });
      toast.success("Video link send successfully")
    }
  }


  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
      <Channel channel={channel}>
        <div className="w-full relative">
          <CallButton handlevideocall={handlevideocall}/>
          <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput focus />
        </Window>
        </div>
        <Thread />
      </Channel>
      </Chat>
    </div>
  )
};

export default ChatPage;
