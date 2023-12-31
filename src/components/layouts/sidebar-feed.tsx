"use client"
import MiniProfile from "@/components/mini-profile";
import SidebarNav from "@/components/layouts/sidebar-nav";
import { user } from "@/types/next-auth";

export interface SidebarProps {
  user: user
}

const SidebarFeed = ({ user }: SidebarProps) => {
  return (
    <div className="w-[25%] h-screen relative hidden lg:block">
      <div className="fixed h-full md:w-[14rem] lg:w-[15rem] xl:w-[20rem] hidden md:block">
        <MiniProfile user={user} />
        <SidebarNav user={user} />
      </div>
    </div>
  );
};

export default SidebarFeed;
