import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getFriendRequestData, acceptFriendRequest } from "../Lib/Api/";
import {BellDotIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import  { getLangaugeFlag } from "../Component/FrienddataCard";
import { Link, useParams } from "react-router";
import noNotitication from "../Component/NoNotitication";
import NoNotitication from "../Component/NoNotitication";

const Notification = () => {

  const queryClient = useQueryClient();

  const { data: FriendRequestData = [], isLoading: FriendRequestDataloading } =
    useQuery({
      queryKey: ["friendRequests"],
      queryFn: getFriendRequestData,
    });

  const { mutate,isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["FriendList"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const incommingRequests = FriendRequestData?.incommingRequests || [];
  const acceptedRequests = FriendRequestData?.acceptedRequests || [];


  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen ">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>
        <div>
          {FriendRequestDataloading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : (
            <div >
              {incommingRequests.length > 0 && (
                <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                <UserCheckIcon className="h-5 w-5 text-primary" />
                Friend Requests
                <span className="badge badge-primary ml-2">{incommingRequests.length}</span>
                </h2>
                <div>
                {incommingRequests.map((request)=>(
                <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow " key={request._id}>
                <div className="card-body">
                <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                <div className="avatar w-12 h-12 ">
                <img src={request.sender.profilepic} alt={request.sender.fullName} />
                </div>
                <div>
                <h3>{request.sender.fullName}</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                <span className="badge badge-secondary text-xs">
                {getLangaugeFlag(request.sender.nativelangauge)}
                native: {request.sender.nativelangauge}
                </span>
                <span className="badge badge-outline text-xs">
                {getLangaugeFlag(request.sender.Learninglangauge)}
                learning: {request.sender.Learninglangauge}
                </span>
                </div>
                </div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={()=>mutate(request._id)} disabled={isPending}>Accept</button>
                </div>
                </div>
                </div>
                ))}
                </div>
                
                </section>
              )}
            </div>
          )}
        </div>
        {/* accepted friend request data */}

        {acceptedRequests.length>0 && (
          <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
          <BellDotIcon className="h-5 w-5 text-primary" />
          New Connections
         </h2>
         <div className="space-y-4">
        {acceptedRequests.map((request)=>(
         <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow " key={request._id }>
         <div className="card-body">
         <div className="flex justify-between items-center">
         <div className="flex items-center gap-3">
        <div className="avatar w-12 h-12 ">
        <img src={request.sender.profilepic} alt={request.sender.fullName} />
        </div>
        <div className="flex-1">
        <h3 className="font-semibold">{request.sender.fullName}</h3>
        <p className="text-sm my-1">{request.sender.fullName} accpted your friend request</p>
        <p className="text-xs flex items-center opacity-70">
        <ClockIcon className="h-3 w-3 mr-1" />
        Recently
        </p>
        </div>
        </div>
        <Link className="btn btn-primary btn-sm" to={`/chat/${request._id}`}>
          <MessageSquareIcon  className="h-3 w-3 mr-1"/>
          New Friend
        </Link>
         </div>
         </div>
         </div>
          ))}
         </div>
          </section>
        )}

        { incommingRequests.length===0 && acceptedRequests.length === 0 && (
          <NoNotitication/>
        )}

      </div>
    </div>
  );
};

export default Notification;
