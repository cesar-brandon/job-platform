"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PostApplyRequest } from "@/lib/validators/apply";
import { usePrevious } from "@mantine/hooks";
import { ApplyStatus } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PostApplyClientProps {
  postId: string;
  initialApply?: ApplyStatus | null;
}

export function PostApplyClient({
  postId,
  initialApply,
}: PostApplyClientProps) {
  const [currentApply, setCurrentApply] = useState(initialApply);
  const prevApply = usePrevious(currentApply);

  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentApply(initialApply);
  }, [initialApply]);

  const { mutate: apply, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: PostApplyRequest = { postId };
      await axios.patch("/api/user/post/apply", payload);
    },
    onError: (err) => {
      setCurrentApply(prevApply);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast({
            title: "Algo salió mal.",
            description: "Debe iniciar sesión para votar.",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Algo salió mal.",
        description: "No se pudo aplicar al post.",
        variant: "destructive",
      });
    },
    onMutate: () => {
      if (currentApply && currentApply in ApplyStatus) {
        setCurrentApply(undefined);
      } else {
        setCurrentApply(ApplyStatus.APPLIED);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["applies", postId]);
      if (currentApply) {
        if (currentApply === ApplyStatus.APPLIED) {
          toast({
            title: "Postulación exitosa.",
            description: "Se ha postulado al post.",
          });
        }
      }
    },
  });

  return (
    <Button
      onClick={() => apply()}
      variant={currentApply ? "checked" : "default"}
    >
      {currentApply ? "Solicitado" : "Solicitar"}
      {isLoading ? (
        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      ) : currentApply ? (
        <Check className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpRight className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
