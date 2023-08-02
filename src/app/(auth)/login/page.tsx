"use client";
import GoogleIcon from "@/components/common/GoogleIcon";
import LoaderIcon from "@/components/common/LoaderIcon";
import LoginForm from "@/components/layouts/LoginForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState(null);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/feed`,
      });
    } catch (error) {
      return toast({
        title: "Algo salió mal",
        description: "No se pudo iniciar sesión con Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-100">
      <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
        Inicie sesión en su cuenta
      </h1>
      <LoginForm userDetails={userDetails} setUserDetails={setUserDetails} />
      {!userDetails && (
        <>
          <hr className="my-6 border-gray-300 w-full" />

          <Button
            className="w-full bg-white text-base hover:bg-gray-100 focus:bg-gray-100 text-gray-900 border border-gray-300"
            onClick={loginWithGoogle}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderIcon />
            ) : (
              <>
                <GoogleIcon /> Iniciar sesión con Google
              </>
            )}
          </Button>

          <p className="mt-8">
            ¿Necesitas una cuenta?
            <Link
              href="/register"
              className="font-semibold text-blue-500 hover:text-blue-700 focus:text-blue-700"
            >
              {" "}
              Crear una cuenta
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default LoginPage;
