import { AvatarForm } from "@/components/studio/settings/avatar-form";
import { ProfileForm } from "@/components/studio/settings/profile-form";
import { authOptions } from "@/lib/auth";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Configuración",
  description: "Página de configuración de cuenta",
};

export default async function Page() {
  const session = await getSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  return (
    <div className="space-y-6 w-full">
      <AvatarForm user={session.user} />
      <ProfileForm />
    </div>
  );
}
