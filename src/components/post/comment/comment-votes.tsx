"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { ThumbsUp } from "lucide-react";

interface CommentVotesProps {
  commentId: string;
  votesAmt: number;
  currentVote?: PartialVote;
}

type PartialVote = Pick<CommentVote, "type">;

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
}) => {
  const { loginToast } = useCustomToasts();
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt);
  const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
    _currentVote,
  );
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        voteType: type,
        commentId,
      };

      await axios.patch("/api/user/post/comment/vote", payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Algo salió mal.",
        description:
          "Tu voto no se ha registrado correctamente. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmt((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote({ type });
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <Button
      onClick={() => vote("UP")}
      size="xs"
      variant="ghost"
      aria-label="upvote"
    >
      <ThumbsUp
        className={cn("h-5 w-5 text-muted-foreground mr-1.5", {
          "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
        })}
      />
      <p className="text-center py-2 px-1 font-medium text-xs text-foreground">
        {votesAmt}
      </p>
    </Button>
  );
};

export default CommentVotes;
