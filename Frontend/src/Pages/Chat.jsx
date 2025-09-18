import React, { useEffect, useRef, useState } from "react";
import { getStreamToken } from "../Lib/Api";
import { useParams } from "react-router-dom";
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

  const { authUser } = useauthUser();
  const { data: tokenData, isFetching } = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const clientRef = useRef(null); // singleton Stream client
  const connectingRef = useRef(false); // true while connectUser is in-flight
  const mountedRef = useRef(true);

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isloading, setisloading] = useState(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!clientRef.current) {
      clientRef.current = StreamChat.getInstance(STREAM_API_KEY);
    } 
    const client = clientRef.current;

    let localCancelled = false; // cancels this init flow if effect cleans up

    const initChat = async () => {
      if (!authUser) {
        setisloading(false);
        return;
      }

      if (!tokenData) {
        return;
      }

      // extract token from known shape (adjust if your API returns different)
      const token =
        typeof tokenData === "string"
          ? tokenData
          : tokenData?.data ?? tokenData?.token ?? tokenData?.accessToken ?? null;


      if (!token || typeof token !== "string") {
        toast.error("Invalid stream token from server.");
        setisloading(false);
        return;
      }

      try {

        // If another user is connected, we should disconnect first (but wait if a connect is in progress)
        if (client.userID && client.userID !== authUser._id) {
          console.log(
            `[initChat] different user connected (${client.userID}) - will disconnect before connecting new user`
          );
          // Wait for any ongoing connect to finish to avoid racing disconnect
          while (connectingRef.current) {
            console.log("[initChat] waiting for other connect to finish before disconnecting...");
            // small sleep; safe because this loop only runs in rare race windows
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 50));
          }
          await client.disconnectUser();
          console.log("[initChat] disconnected previous user");
        }

        // if already connected as same user, skip connectUser
        if (client.userID && client.userID === authUser._id) {
          console.log("[initChat] already connected as same user:", client.userID);
        } else {
          // mark connecting
          connectingRef.current = true;

          // connectUser may take some time; set connectingRef to true so cleanup doesn't disconnect mid-flight
          await client.connectUser(
            {
              id: authUser._id,
              fullName: authUser.fullName,
              image: authUser.profilepic,
            },
            token
          );

          connectingRef.current = false;
        }

        // If effect has been cleaned up while we were connecting, abort further work
        if (localCancelled || !mountedRef.current) {
          console.warn("[initChat] cancelled after connect - aborting channel setup");
          return;
        }

        // sanity check: ensure still connected
        if (!client.userID) {
          throw new Error("Stream client not connected after connectUser");
        }

        // Compute deterministic channel id and create/watch channel.
        const channelID = [authUser._id, targetUserId].sort().join("-");

        // Before creating channel, ensure client still connected
        if (!client.userID) {
          throw new Error("Client disconnected before channel.create");
        }

        const newChannel = client.channel("messaging", channelID, {
          members: [authUser._id, targetUserId],
          created_by_id: authUser._id,
        });

        await newChannel.create();

        // Double-check client still connected
        if (!client.userID) {
          throw new Error("Client disconnected before channel.watch");
        }

        await newChannel.watch();

        if (localCancelled || !mountedRef.current) {
          console.warn("[initChat] cancelled after channel setup - aborting state updates");
          return;
        }

        setChatClient(client);
        setChannel(newChannel);
      } catch (err) {
        console.error("[initChat] Error initializing chat:", err);
        // special log to help detect the token/secret message easily:
        if (err?.message && err.message.includes("Both secret and user tokens are not set")) {
          console.error("[initChat] Token/Secret error occurred. This is usually caused by a disconnect() happening while connectUser was in progress.");
        }
        toast.error("Could not connect to chat. See console for details.");
      } finally {
        // make sure we clear the connecting flag even if connectUser threw
        connectingRef.current = false;
        if (mountedRef.current) {
          setisloading(false);
        }
      }
    };

    initChat();

    return () => {
      localCancelled = true;
      // mark unmounted for the whole component lifecycle
      mountedRef.current = false;

      // If a connect is in progress, avoid disconnecting now — the in-progress connect's finally will clear flags.
      if (client && connectingRef.current) {
        return;
      }

      // Only disconnect if the client is actually connected as a user.
      if (client && client.userID) {
        client
          .disconnectUser()
          .then(() => console.log("[cleanup] client.disconnectUser() resolved"))
          .catch((e) => console.warn("[cleanup] disconnectUser failed:", e));
      } 
    };
    // note: intentionally depending on authUser, tokenData, targetUserId to re-run when those change
  }, [authUser, tokenData, targetUserId]);

  // Show loader while initializing
  if (!chatClient || !channel || isloading || isFetching) {

    return <ChatLoader />;
  }


  const handlevideocall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `Please join the video call using this link. ${callUrl}`,
      });
      toast.success("Video link sent successfully");
    } else {
      toast.error("No channel available to send call link");
    }
  };

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handlevideocall={handlevideocall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;