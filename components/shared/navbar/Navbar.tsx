import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href={"/"} className="flex items-center gap-1">
        <Image
          src={"/assets/images/site-logo.svg"}
          width={23}
          height={23}
          alt="Dev flow"
        />
        <h1 className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev
          <span className="text-primary-500"> Overflow</span>
        </h1>
      </Link>

      <p>globalsearch</p>
      <div className="flex">
        theme change
        {/* <SignedIn> */}
        <UserButton />
        {/* </SignedIn> */}
      </div>
    </nav>
  );
}

export default Navbar;
