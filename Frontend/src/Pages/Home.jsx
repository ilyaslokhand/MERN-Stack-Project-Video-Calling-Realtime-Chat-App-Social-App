import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FriendList,
  getOutgoingFriendReqs,
  RecommandedFriends,
  sendfriendRequesttouser,
} from "../Lib/Api";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import NoFriendsData from "../Component/NoFriendsData";
import  { getLangaugeFlag } from "../Component/FrienddataCard";
import FrienddataCard from "../Component/FrienddataCard";

const Home = () => {
  const [sendfriendRequest, setsendfriendRequest] = useState(new Set());
  const queryClient = useQueryClient();

   // GET RECOMMANDED FRIENDS
  const {
    data: recommendfriendsdata = [],
    isLoading: recommendedfriendsloading,
  } = useQuery({
    queryKey: ["RecommandedFriends"],
    queryFn: RecommandedFriends,
  });

//    useEffect(() => {
//   console.log("recommendfriendsdata =>", recommendfriendsdata);
// }, [recommendfriendsdata]);

    // GET USER FRIENDS 
  const { data: FriendListdata = [], isLoading: FriendListloading } = useQuery({
    queryKey: ["FriendList"],
    queryFn: FriendList,
  });

   // GET FRIEND REQUEST

  const { data: OutgoingFriendReqDatas=[] } = useQuery({
    queryKey: ["getOutgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // SEND FRIEND REQUEST

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: sendfriendRequesttouser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["getOutgoingFriendReqs"] }),
  });

useEffect(() => {
  const outgoingRequest = new Set();

  if (OutgoingFriendReqDatas && OutgoingFriendReqDatas.length > 0) {
    OutgoingFriendReqDatas.forEach((req) => {
      outgoingRequest.add(req.receiver._id);
    });
    setsendfriendRequest(outgoingRequest);
  }
}, [OutgoingFriendReqDatas]);

// useEffect(() => {
//   console.log(
//     "FriendListdata =>",
//     FriendListdata,
  
//   );
// }, [FriendListdata]);


  return (
  <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
    {/* section for friend and friend request */}
    <div className="flex justify-between flex-col sm:flex-row mx-auto gap-4 items-center">
      <h2 className="text-2xl sm:text-3xl tracking-tighter font-bold">
        Your Friends
      </h2>
      <Link className="btn btn-outline btn-sm" to="/notification">
        <UsersIcon className="size-4 mr-2" />
        Friend Requests
      </Link>
    </div>

    {/* cards for friends */}
    <div>
      {FriendListloading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : FriendListdata.length === 0 ? (
        <NoFriendsData
          message="Connect with language partners below to start practicing together!"
          title="No friends Yet"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FriendListdata.map((friend) => (
            <FrienddataCard key={friend.id} friend={friend} />
          ))}
        </div>
      )}
    </div>

    {/* section for recommended friends */}
    <section>
      <div className="mt-6 sm:mt-8">
        <div className="flex flex-col mx-auto">
          <h2 className="text-2xl sm:text-3xl tracking-tighter font-bold">
            Meet New Learners
          </h2>
          <p className="opacity-70">
            Discover perfect language exchange partners based on your profile
          </p>
        </div>
      </div>

      <div>
        {recommendedfriendsloading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : !Array.isArray(recommendfriendsdata) ||
          recommendfriendsdata.length === 0 ? (
          <NoFriendsData
            message="Check back later for new language partners!"
            title="No recommendations available"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
            {recommendfriendsdata.map((friend) => {
              const hasRequestBeenSent = sendfriendRequest.has(friend._id);

              return (
                <div className="card bg-base-200" key={friend._id}>
                  <div className="card-body p-4">
                    {/* username + profile */}
                    <div className="flex gap-3">
                      <div className="avatar size-12">
                        <img
                          src={friend?.profilepic}
                          alt={friend?.fullName}
                        />
                      </div>
                      <div className="flex flex-col">
                        <p>{friend?.fullName}</p>
                        {friend?.location && (
                          <div className="flex items-center">
                            <MapPinIcon className="size-3 mr-1" />
                            {friend.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* languages */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="badge badge-secondary text-xs">
                        {getLangaugeFlag(friend?.nativelangauge)}
                        native: {friend?.nativelangauge}
                      </span>
                      <span className="badge badge-outline text-xs">
                        {getLangaugeFlag(friend?.Learninglangauge)}
                        learning: {friend?.Learninglangauge}
                      </span>
                    </div>

                    {/* bio */}
                    {friend.bio && (
                      <p className="text-sm opacity-70 mt-2">{friend.bio}</p>
                    )}

                    {/* action button */}
                    <div>
                      <button
                        disabled={hasRequestBeenSent}
                        onClick={() => {
                          console.log("Button clicked");
                          mutate(friend._id);
                        }}
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent
                            ? "btn-disabled"
                            : "btn-primary"
                        }`}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  </div>
);

};

export default Home;
