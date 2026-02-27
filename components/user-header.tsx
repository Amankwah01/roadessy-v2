"use client";

import React from "react";
import {
    OrganizationList,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useOrganization,
  useOrganizationList,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";

function UserHeader() {
  const user = useUser();
  const {organization, isLoaded} = useOrganization();
  // const orgList = useOrganizationList();
  return (
    <div>
      <header className="w-full flex justify-around items-center">
        {/* Show the sign-in and sign-up buttons when the user is signed out */}
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="w-20 text-white hover:text-black font-semibold bg-transparent focus:outline-none focus:ring-0 focus:shadow-none cursor-pointer">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="w-20 text-white hover:text-black font-semibold bg-transparent focus:outline-none focus:ring-0 focus:shadow-none cursor-pointer">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        {/* Show the user button when the user is signed in */}
        <SignedIn>
          <div className="flex items-center gap-2 rounded-md bg-transparent px-2 py-1 text-sm font-medium cursor-pointer">
            <UserButton />
            <div className="flex flex-col items-start gap-y-1">
              <span>{user.user?.lastName}</span>
              <span className="text-xs">{organization?.name}</span>
            </div>
          </div>
        </SignedIn>
      </header>
    </div>
  );
}

export default UserHeader;
