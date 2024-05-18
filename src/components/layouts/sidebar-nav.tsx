"use client";

import {
  BellIcon,
  BookmarkIcon,
  CogIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CogIcon as CogIconIconSolid,
  BellIcon as BellIconSolid,
} from "@heroicons/react/24/solid";
import ButtonLink from "../common/button-link";
import { user } from "@/types/next-auth";
import { ThemeToggle } from "../common/theme-toggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { CircleArrowRight, LogOut } from "lucide-react";

interface Props {
  user: user;
}

const SidebarNav: React.FC<Props> = ({ user }) => {
  const pathname = usePathname();
  return (
    <div className="mt-8 flex flex-col">
      <ButtonLink
        href="/bookmarks"
        text="Guardados"
        ariaLabel="Guardados"
        variant="ghost"
        className={`bg-background justify-start ${
          pathname === "/bookmarks" && "font-bold"
        }`}
        icon={
          <BookmarkIcon
            className={`w-6 h-6 order-first mr-4 ${
              pathname === "/bookmarks" && "fill-accent-foreground"
            }`}
          />
        }
      />
      <ButtonLink
        href="/notifications"
        text="Notificaciones"
        ariaLabel="Notificaciones"
        variant="ghost"
        className={`bg-background justify-start ${
          pathname === "/notifications" && "font-bold"
        }`}
        icon={
          pathname === "/notifications" ? (
            <BellIconSolid className="w-6 h-6 order-first mr-4" />
          ) : (
            <BellIcon className="w-6 h-6 order-first mr-4" />
          )
        }
      />
      <ThemeToggle />
      <ButtonLink
        href="/settings"
        text="Configuración"
        ariaLabel="Configuración"
        variant="ghost"
        className={`bg-background justify-start ${
          pathname === "/settings" && "font-bold"
        }`}
        icon={
          pathname === "/settings" ? (
            <CogIconIconSolid className="w-6 h-6 order-first mr-4" />
          ) : (
            <CogIcon className="w-6 h-6 order-first mr-4" />
          )
        }
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-full bg-background justify-start"
            variant="ghost"
          >
            <EllipsisHorizontalCircleIcon className="w-6 h-6 order-first mr-4" />
            Más opciones
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[15rem] xl:w-[20rem] p-0">
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-accent px-6 py-4"
          >
            <LogOut className="mr-4 h-6 w-6" />
            <span>Serrar Sesion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {user.role === "ENTERPRISE" && (
        <ButtonLink
          href={`/${user.username}/submit`}
          text="Publicar oferta"
          ariaLabel="Publicar oferta"
          className="mt-8 child:flex child:justify-center"
        />
      )}
      {user.role === "ENTERPRISE" && (
        <ButtonLink
          href="/studio"
          text="IFV Studio"
          ariaLabel="studio"
          variant="outline"
          className={`mt-4 bg-background dark:bg-orange/20 justify-start border-orange dark:border-none text-orange hover:bg-orange/5 hover:text-orange`}
          icon={<CircleArrowRight className="w-6 h-6 order-first mr-4" />}
        />
      )}
    </div>
  );
};
export default SidebarNav;
