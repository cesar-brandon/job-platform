"use client";

import { cn, formatTimeToNow, simplifyName } from "@/lib/utils";
import {
  ClockIcon,
  MapPinIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import type {
  Apply,
  Bookmark,
  Post as PrismaPost,
  User,
  Vote,
} from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { FC, useRef, useState } from "react";
import EditorOutput from "../editor/editor-output";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HistoryIcon } from "@/components/common/icons";
import { PostBookmarkClient } from "./bookmark/post-bookmark-client";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@mantine/hooks";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostApplyClient } from "./apply/post-apply-client";
import { HoverProfile } from "../profile/hover-profile";
import { BookmarkIcon, LinkIcon, MessageSquareText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  post: PrismaPost & {
    author: User;
    votes: Vote[];
  };
  votesAmt: number;
  authorName: string;
  authorImage: string;
  currentVote?: PartialVote;
  commentAmt: number;
  bookmarkAmt: number;
  currentBookmark: boolean;
  currentApply?: Apply;
}

const Post: FC<PostProps> = ({
  post,
  authorName,
  authorImage,
  votesAmt: _votesAmt,
  bookmarkAmt: _bookmarkAmt,
  commentAmt,
  currentVote: _currentVote,
  currentApply: _currentApply,
  currentBookmark,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${post.author.username}/post/${post.id}`,
      );
      toast({
        description: "Copiado al portapapeles",
      });
    } catch (error) {
      toast({
        description: "Error al copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="overflow-hidden bg-card text-card-foreground shadow-sm border-b-[1px] sm:border-[1px] sm:rounded-xl">
      <div className="px-4 sm:px-6 pt-6 pb-4 flex justify-between">
        <div className="relative w-full flex gap-4">
          <HoverProfile authorName={authorName} authorImage={authorImage}>
            <Avatar className="flex items-center justify-center">
              <AvatarImage src={authorImage} alt="avatar" />
              <AvatarFallback>
                {simplifyName(authorName.toUpperCase())}
              </AvatarFallback>
            </Avatar>
          </HoverProfile>
          <div>
            <div className="max-h-40 relative">
              <Link href={`/${post.author.username}/post/${post.id}`}>
                <h3
                  className="text-lg sm:text-xl md:text-2xl text-primary font-semibold leading-none tracking-tight 
                  hover:underline"
                >
                  {post.title}
                </h3>
              </Link>
              {authorName ? (
                <HoverProfile authorName={authorName} authorImage={authorImage}>
                  <a
                    className="hover:underline underline-offset-2"
                    href={`/${post.author.username}`}
                  >
                    {authorName}
                  </a>
                </HoverProfile>
              ) : null}
            </div>
            <PostContent post={post} pRef={pRef} _currentApply={_currentApply}>
              {/* <div className="w-full flex gap-2 overflow-scroll my-2"> */}
              {/*   <Badge */}
              {/*     className="text-muted-foreground py-1" */}
              {/*     variant="secondary" */}
              {/*   > */}
              {/*     <MapPinIcon className="h-4 w-4 mr-2" /> */}
              {/*     <span className="truncate">Direccion de ejemplo</span> */}
              {/*   </Badge> */}
              {/*   <Badge */}
              {/*     className="text-muted-foreground py-1" */}
              {/*     variant="secondary" */}
              {/*   > */}
              {/*     <ClockIcon className="h-4 w-4 mr-2" /> */}
              {/*     <span className="truncate">Full Time</span> */}
              {/*   </Badge> */}
              {/* </div> */}

              <div
                className="relative text-sm max-h-32 w-full overflow-clip"
                ref={pRef}
              >
                <EditorOutput content={post.content} />
                {/* {pRef.current?.clientHeight === 128 ? ( */}
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-card to-transparent"></div>
                {/* ) : null} */}
              </div>
            </PostContent>
          </div>
        </div>
      </div>

      <div className="z-20 text-sm px-6 py-4 sm:px-6 flex justify-between">
        <p className="flex items-center gap-2">
          <HistoryIcon className="w-4 h-4" />
          <span className="hidden md:block">Publicado hace</span>
          {formatTimeToNow(new Date(post.createdAt))}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/${post.author.username}/post/${post.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "w-auto px-3 gap-2",
            )}
          >
            <MessageSquareText className="w-4 h-4" />
            {commentAmt > 0 ? commentAmt : ""}
          </Link>
          <PostBookmarkClient
            postId={post.id}
            initialBookmarksAmt={_bookmarkAmt}
            initialBookmark={currentBookmark}
          />
          <Button onClick={copyToClipboard} size="icon" variant="outline">
            <LinkIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Post;

function PostContent({
  post,
  pRef,
  _currentApply,
  children,
}: {
  post: PrismaPost & {
    author: User;
    votes: Vote[];
  };
  pRef: React.RefObject<HTMLParagraphElement>;
  _currentApply?: Apply;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div>{children}</div>
        </SheetTrigger>
        <SheetContent className="md:max-w-[35rem]">
          <SheetHeader className="mb-6">
            <SheetTitle>Oferta {post.title}</SheetTitle>
            <SheetDescription className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4 inline-block" /> Publicado hace{" "}
              {formatTimeToNow(new Date(post.createdAt))}{" "}
            </SheetDescription>
          </SheetHeader>
          <div className="flex gap-2">
            <PostApplyClient
              postId={post.id}
              initialApply={_currentApply?.status}
            />
            <Button variant="outline">Guardar</Button>
          </div>

          <Separator className="mb-2" />
          <ScrollArea className="h-80 w-full" ref={pRef}>
            <EditorOutput content={post.content} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div>{children}</div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Oferta {post.title}</DrawerTitle>
          <DrawerDescription>
            Publicado hace {formatTimeToNow(new Date(post.createdAt))}{" "}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 flex-1 max-w-md mx-auto">
          <div className="flex gap-2">
            <PostApplyClient
              postId={post.id}
              initialApply={_currentApply?.status}
            />
            <Button variant="outline">Guardar</Button>
          </div>
          <Separator className="mb-2" />

          <ScrollArea className="h-96 w-full" ref={pRef}>
            <EditorOutput content={post.content} />
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
