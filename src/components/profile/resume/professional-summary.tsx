import { useCallback, useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

export function ProfessionalSummary({
  errors,
}: {
  errors: Record<string, string>;
}) {
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor-professional-summary",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Empieza tu resumen profesional...",
        inlineToolbar: true,
        // data: { blocks: [] },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Algo salió mal",
          description:
            "Error al usar el editor de texto. Inténtalo de nuevo más tarde.",
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };
    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Resumen profesional</h2>
      <p className="text-sm text-muted-foreground">
        ¡Escriba de 2 a 4 oraciones para aumentar las posibilidades de una
        entrevista!
      </p>
      <FormField
        name="professionalSummary"
        render={({ field }) => (
          <FormItem>
            <FormControl className="p-4">
              <div
                id="editor-professional-summary"
                className="border rounded-md overflow-hidden overflow-y-auto min-h-[150px]"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </section>
  );
}
