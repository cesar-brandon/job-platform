"use client";

import {
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavBarItem from "../common/NavBarItem";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    image: string;
    role: string;
  };
}

const NavBar: React.FC<Props> = async ({ user }) => {
  const { data: session } = useSession();
  const [items, setItems] = useState([
    {
      content: "Inicio",
      href: "/home",
      icon: <HomeIcon />,
      isFocus: true,
    },
    {
      content: "Explorar",
      href: "/explore",
      icon: <MagnifyingGlassIcon className="stroke-gray-500" />,
      isFocus: false,
    },
    {
      content: "Chat",
      href: "/messages",
      icon: <ChatBubbleOvalLeftEllipsisIcon />,
      isFocus: false,
    },
    {
      content: "Perfil",
      href: "#",
      icon: (
        <Avatar className="w-full h-full">
          <AvatarImage src={session?.user.image} alt="avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      isFocus: false,
    },
  ]);

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      prevScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleItemClick = (index: number) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, isFocus: !item.isFocus };
      }
      return { ...item, isFocus: false };
    });
    setItems(updatedItems);
  };

  return (
    <div
      className={`z-10 p-3 fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-full flex items-center justify-center gap-8 shadow-md transform border border-gray-200 transition-all duration-300 ${isHidden ? "translate-y-20" : "translate-y-0"
        }`}
    >
      {items.map((item, index) => (
        <NavBarItem
          key={item.content}
          {...item}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
};

export default NavBar;
