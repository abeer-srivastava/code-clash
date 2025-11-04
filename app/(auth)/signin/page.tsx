"use client";

import { auth, githubProvider, provider } from "@/lib/firebase";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut
} from "firebase/auth";
import { useEffect } from "react";
import { Codesandbox, GithubIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useUserStore } from "@/store/useUserStore";
import SignUpSection from "@/app/components/SignUpSection";
import { Button } from "@/components/ui/button";

const amberButton =
  "w-full flex justify-center items-center gap-2 py-3 px-4 border rounded-lg font-medium text-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400";

function Signin() {
  const { user, setUser, clearUser } = useUserStore();

  //  Keep user signed in across refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser);
        setUser(currentUser);
      } else {
        clearUser();
      }
    });
    return () => unsubscribe();
  }, [setUser, clearUser]);

  // 
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) return;
      console.log("Google User:", result.user, "Token:", credential.accessToken);
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  // GitHub Auth ToDo  
  const handleGithubSignUp = async () => {
    console.log("TODO: Implement GitHub SignIn");
   try {
     const result=await signInWithPopup(auth, githubProvider);
     const credential=GithubAuthProvider.credentialFromResult(result);
     if(!credential) return ;
     console.log("Github user:",result,"Token",credential.accessToken);
   } catch (error) {
    console.log(error);
   }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex bg-black min-h-screen font-mono">
      
      <SignUpSection></SignUpSection>

      <div className="flex w-full md:w-3/5 bg-gray-950 justify-center items-center">
        <div className="w-full max-w-md">
          <div className="p-6 text-center">
            <h2 className="text-3xl font-bold mb-2 text-amber-500">
              {user ? "Welcome Back" : "Sign In"}
            </h2>
            <p className="text-gray-400 text-sm">
              {user
                ? "Continue where you left off"
                : "Log in to continue to CodeClash"}
            </p>
          </div>

          <div className="bg-white p-8 shadow rounded-xl space-y-4">
            {user ? (
              <>
                <p className="text-lg font-medium text-gray-800">
                  Hello, {user.displayName || user.email}
                </p>
                <Button
                  className={`${amberButton} bg-amber-400 text-black hover:bg-amber-500`}
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" 
                  className={`${amberButton} hover:bg-gray-100 text-black`}
                  onClick={handleGoogleSignUp}
                >
                  <FcGoogle className="w-5 h-5" />
                  Continue with Google
                </Button>

                <Button
                  className={`${amberButton} hover:bg-gray-100 text-black`}
                  onClick={handleGithubSignUp}
                >
                  <GithubIcon className="w-5 h-5" />
                  Continue with GitHub
                </Button>
              </>
            )}
          </div>

          {!user && (
            <div className="p-2 text-center">
              <p className="text-gray-400">
                New to CodeClash?
                <a href="#" className="text-amber-400 hover:underline">
                  Sign up for an account
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
