"use client";

import { auth, githubProvider, provider } from "@/lib/firebase";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GithubIcon, LogOut, Terminal, ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useUserStore } from "@/store/useUserStore";
import SignUpSection from "@/app/components/SignUpSection";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

function Signin() {
  const { user, setUser, clearUser } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) {
        setUser(currentUser);
        router.push("/");
      } else {
        clearUser();
      }
    });
    return () => unsubscribe();
  }, [setUser, clearUser, router]);

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await api.post("/auth", {
        name: result.user?.displayName,
        email: result.user?.email,
        picture: result.user?.photoURL,
      });
      router.push("/");
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  const handleGithubSignUp = async () => {
   try {
     await signInWithPopup(auth, githubProvider);
     router.push("/");
   } catch (error) {
    console.error("Github Auth Error:", error);
   }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="flex bg-background min-h-screen font-heading">
      <SignUpSection />

      <div className="flex w-full md:w-3/5 bg-secondary-background justify-center items-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-block bg-main border-4 border-black p-3 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
               <ShieldCheck className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-2">
              {user ? "AUTHENTICATED" : "ENTRY POINT"}
            </h2>
            <p className="text-xl font-bold uppercase tracking-widest text-muted-foreground">
               {user ? "Identity Verified" : "Access the Arena"}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-8">
            {user ? (
              <div className="space-y-6 text-center">
                <div className="p-4 border-2 border-dashed border-black bg-main/10">
                   <p className="text-sm font-black uppercase text-muted-foreground mb-1">Current Session</p>
                   <p className="text-xl font-black">{user.displayName || user.email}</p>
                </div>
                <Button
                  variant="reverse"
                  className="w-full h-16 text-xl font-black uppercase"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-6 w-6" /> Terminate
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="neutral"
                  className="w-full h-16 text-xl font-black uppercase tracking-tighter flex justify-center items-center gap-4 border-4"
                  onClick={handleGoogleSignUp}
                >
                  <FcGoogle className="w-8 h-8" />
                  Google Auth
                </Button>

                <Button
                  variant="neutral"
                  className="w-full h-16 text-xl font-black uppercase tracking-tighter flex justify-center items-center gap-4 border-4"
                  onClick={handleGithubSignUp}
                >
                  <GithubIcon className="w-8 h-8" />
                  GitHub Auth
                </Button>
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t-4 border-black"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-black">
                    <span className="bg-white px-4 text-black">Terminal Access Only</span>
                  </div>
                </div>

                <div className="bg-black p-4 font-mono text-xs text-green-500 overflow-hidden">
                   <p className="animate-pulse">{">"} awaiting_credentials...</p>
                   <p className="opacity-50">{">"} secure_socket_established</p>
                </div>
              </>
            )}
          </div>

          {!user && (
            <div className="mt-8 text-center">
              <p className="text-sm font-black uppercase tracking-widest">
                New Prospect?{" "}
                <a href="#" className="text-main hover:underline decoration-4 underline-offset-4">
                  Register Protocol
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signin;
