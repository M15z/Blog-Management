"use client";
import Logo from "@/public/logo.webp";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import ChatButtonIcon from "./ui/ChatButtonIcon";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const pathname = usePathname();
  console.log(pathname);

  const { data: session } = useSession();

  console.log(session?.user);

  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      {/* className max-w-screen-xl */}
      <div className="mx-auto mt-2 flex flex-wrap items-center justify-between px-3 sm:p-4 sm:px-25">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src={Logo}
            width={50}
            height={50}
            className="rounded-2xl"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            BLOG IT
          </span>
        </Link>
        <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          
          <div className="relative">
            {/* check for session if its null or not */}
            {session ? (
              <div className="flex items-center space-x-3">
                <Link href="/chat">
                  <ChatButtonIcon />
                </Link>
                <button
                  type="button"
                  className="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 md:me-0 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  {session.user?.image ? (
                    <Image
                      className="rounded-full"
                      src={session.user.image}
                      alt="user photo"
                      width={50}
                      height={50}
                    />
                  ) : (
                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                      {session.user?.name?.[0] || "?"}
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <Button
                // onClick={() => signIn()}
                className="h-10 bg-blue-500 hover:bg-blue-800"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}

            {session && (
              <div
                className={`z-50 ${
                  isDropdownOpen ? "block" : "hidden"
                } absolute right-0 mt-2 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow-sm dark:divide-gray-600 dark:bg-gray-700`}
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {session.user?.name}
                  </span>
                  <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                    {session.user?.email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => signOut()}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={toggleMobileMenu}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full md:order-1 md:flex md:w-auto`}
          id="navbar-user"
        >
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 text-2xl font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
            <li>
              <Link
                href="/"
                className={`${pathname == "/" ? "text-blue-700" : "text-gray-900"} block rounded-sm px-3 py-2 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                aria-current="page"
                name="home"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/create"
                className={`${pathname == "/create" ? "text-blue-700" : "text-gray-900"} block rounded-sm px-3 py-2 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                name="create"
              >
                Create
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`${pathname == "/about" ? "text-blue-700" : "text-gray-900"} block rounded-sm px-3 py-2 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500`}
                name="about"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}