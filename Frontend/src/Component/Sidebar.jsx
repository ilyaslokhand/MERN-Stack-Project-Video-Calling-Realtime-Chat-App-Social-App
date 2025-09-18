import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";
import React, { useState } from "react";
import useauthUser from "../Hooks/useauthUser";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { authUser } = useauthUser();

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="h-screen sticky top-0 border-r bg-base-200 border-base-300 w-64 flex flex-col">
      <div>
        <nav className="mt-10 p-4 space-y-1">
          <Link
            to="/"
            className={`btn btn-ghost w-full normal-case justify-start ${
              currentPath === "/" ? "btn-active" : ""
            }`}
          >
            <HomeIcon className="size-5 text-base-content opacity-70" />
            <span>Home</span>
          </Link>
          {/* <Link
            to="/Friends"
            className={`btn btn-ghost w-full normal-case justify-start ${
              currentPath === "/Friends" ? "btn-active" : ""
            }`}
          >
            <UsersIcon className="size-5 text-base-content opacity-70" />
            <span>Friends</span>
          </Link> */}
          <Link
            to="/notification"
            className={`btn btn-ghost w-full normal-case justify-start ${
              currentPath === "/notification" ? "btn-active" : ""
            }`}
          >
            <BellIcon className="size-5 text-base-content opacity-70" />
            <span>Notifications</span>
          </Link>
        </nav>
      </div>

      {/* 👇 This will stay at the bottom now */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex gap-3 items-center">
          <div className="w-10">
            <img
              src={authUser?.profilepic}
              alt="Profile"
              className="rounded-full"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success gap-1">
              <span className="size-2 rounded-full bg-success inline-block"></span>{" "}
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
