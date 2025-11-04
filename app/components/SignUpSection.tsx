import Background from "@/components/Background";
import { Codesandbox } from "lucide-react";

export default function SignUpSection() {
  return (
      <Background>
    <div className="flex w-full md:w-2/5 min-h-screen justify-center items-center mx-auto z-50">
        <div className="flex flex-col justify-center items-center text-center px-6">
          <div className="flex flex-col justify-center items-center">
            <Codesandbox className="w-20 h-20 text-amber-600 font-mono" />
            <h1 className="text-5xl font-extrabold font-mono mb-6 text-amber-600 code-editor">
              CodeClash
            </h1>
          </div>
        </div>
    </div>
      </Background>
  );
}