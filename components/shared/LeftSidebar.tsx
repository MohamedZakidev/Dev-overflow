"use client"
import { sidebarLinks } from "@/constants"
import { SignedOut, useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

function LeftSidebar() {
    const { userId } = useAuth()
    const pathname = usePathname()
    return (
        <aside className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
            <div className="flex flex-1 flex-col gap-6">
                {sidebarLinks.map(item => {
                    const isActive = (item.route.length > 0 && item.route === pathname)
                    if (item.route === "/profile") {
                        if (userId) {
                            item.route = `${item.route}/${userId}`
                        } // i removed the else return null it doesnot seem to do anything because /profile is a protected router
                    }

                    return (
                        <Link key={item.route} href={item.route}
                            className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
                        >
                            <Image
                                src={item.imgURL}
                                alt={item.label}
                                width={20}
                                height={20}
                                className={`${!isActive && "invert-colors"}`}
                            />
                            <p className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}>{item.label}</p>
                        </Link>
                    )
                })}
            </div >
            <SignedOut>
                <div className="flex flex-col gap-3">
                    <Link href="/sign-in">
                        <Button className="small-medium btn-secondary min-h-[40px] w-full rounded-lg px-4 py-3 shadow-none">
                            <Image
                                src="/assets/icons/account.svg"
                                alt="login"
                                width={20}
                                height={20}
                                className="invert-colors lg:hidden"
                            />
                            <span className="primary-text-gradient font-semibold tracking-wide max-lg:hidden">Log in</span>
                        </Button>
                    </Link>

                    <Link href="/sign-up">
                        <Button className="text-dark400_light900 small-medium light-border-2 btn-tertiary min-h-[40px] w-full  rounded-lg px-4 py-3 font-semibold tracking-wider shadow-none">
                            <Image
                                src="/assets/icons/sign-up.svg"
                                alt="signup"
                                width={20}
                                height={20}
                                className="invert-colors lg:hidden"
                            />
                            <span className="max-lg:hidden">Sign up</span>
                        </Button>
                    </Link>
                </div>
            </SignedOut>
        </aside>
    )
}

export default LeftSidebar
