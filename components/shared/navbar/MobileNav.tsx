"use client"
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavContent() {
  const pathname = usePathname()

  return (
    <section className="flex flex-col gap-6 pt-16">
      {sidebarLinks.map(item => {
        const isActive = item.route === pathname
        return (
          <SheetClose key={item.route} asChild>
            <Link href={item.route}
              className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${!isActive && "invert-colors"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>{item.label}</p>
            </Link>
          </SheetClose>
        )
      })}
    </section >
  )
}

function MobileNav() {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/assets/icons/hamburger.svg"
            width={36}
            height={36}
            alt="Menu"
            className="invert-colors sm:hidden"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="background-light900_dark200 overflow-auto border-none"
        >
          <Link href={"/"} className="flex items-center gap-1">
            <Image
              src={"/assets/images/site-logo.svg"}
              width={23}
              height={23}
              alt="Dev flow"
            />
            <h1 className="h2-bold text-dark100_light900 font-spaceGrotesk">
              Dev
              <span className="text-primary-500"> Overflow</span>
            </h1>
          </Link>

          <div>
            <SheetClose asChild>
              <NavContent />
            </SheetClose>
            <SignedOut>
              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href="/sign-in">
                    <Button className="small-medium btn-secondary min-h-[40px] w-full rounded-lg px-4 py-3 shadow-none">
                      <span className="primary-text-gradient font-semibold tracking-wide">Log in</span>
                    </Button>
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link href="/sign-up">
                    <Button className="text-dark400_light900 small-medium light-border-2 btn-tertiary min-h-[40px] w-full  rounded-lg px-4 py-3 font-semibold tracking-wider shadow-none">
                      Sign up
                    </Button>
                  </Link>
                </SheetClose>

              </div>
            </SignedOut>

          </div>

        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
