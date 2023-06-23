import type { V2_MetaFunction } from "@remix-run/node";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/remix";
import { Link } from "@remix-run/react";
export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <SignedIn>
        <div>
          <UserButton />
          {/* <h1 className="text-3xl font-bold underline">
            Hello {user?.username}!
          </h1> */}
        </div>
      </SignedIn>
      <SignedOut>
        <Link to="/sign-in">Sign In</Link>
        {/* <RedirectToSignIn /> */}
      </SignedOut>
    </div>
  );
}
