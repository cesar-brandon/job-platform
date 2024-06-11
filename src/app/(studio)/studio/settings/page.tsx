import { ProfileForm } from "@/components/studio/settings/profile-form";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Configuración",
  description: "Página de configuración de cuenta",
};

export default function Page() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Así es como te verán los demás en el sitio.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}