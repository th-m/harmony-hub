import { SignIn } from "@clerk/remix";

export default function SignInPage() {
  return (
    <div className="flex justify-center content-center mt-8">
      <SignIn routing={"path"} path={"/sign-in"} />
    </div>
  );
}
