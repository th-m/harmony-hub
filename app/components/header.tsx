import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SignedIn, UserButton, SignedOut } from "@clerk/remix";
import { Link, NavLink } from "@remix-run/react";

const navigation = [
  // { name: "Daily", href: "/dashboard/daily" },
  { name: "Dashboard", href: "/dashboard" },
  // { name: "Quarterly", href: "/dashboard/quarterly" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 sm:px-8"
        aria-label="Global"
      >
        <div className="flex sm:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="/assets/logo/mark.png"
              alt="harmony hub logo"
            />
          </Link>
        </div>
        <div className="flex sm:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-sm p-2.5 text-gray-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden sm:flex sm:gap-x-12">
          <SignedIn>
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive, isPending }) => {
                  let base = "text-sm font-semibold leading-6 text-white" 
                  const selected = isPending ? "text-opacity-60" : isActive ? "text-opacity-60" : ""
                  return `${base} ${selected}`;
                }
  }
              >
                {item.name}
              </NavLink>
            ))}
          </SignedIn>
        </div>
        <SignedIn>
          <div className="hidden sm:flex sm:flex-1 sm:justify-end">
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <div className="hidden sm:flex sm:flex-1 sm:justify-end">
            <Link
              to="/sign-in"
              className="text-sm font-semibold leading-6 text-white"
            >
              {" "}
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </SignedOut>
      </nav>
      <Dialog
        as="div"
        className="sm:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Harmony Hub</span>
              <img className="h-8 w-auto" src="/assets/logo/mark.png" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-sm p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/25">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-sm px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <SignedIn>
                <div className="py-6">
                  <UserButton />
                </div>
              </SignedIn>
              <SignedOut>
                <div className="py-6">
                  <Link
                    to="/sign-in"
                    className="-mx-3 block rounded-sm px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                  >
                    Log in
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
