"use client"
import { Input } from "@/components/ui/input"
import { formURLQuery, removeQueryParamater } from "@/lib/utils"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

function GlobalSearch() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get("global")

    const [search, setSearch] = useState(query || "")

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newURL = formURLQuery({
                    queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                    key: "global",
                    value: search // search is the query the user type
                })
                router.push(newURL, { scroll: false })
            } else if (query) {
                const newURL = removeQueryParamater({
                    queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                    keysToRemove: ["global"],
                })
                router.push(newURL, { scroll: false })
            }

        }, 300)
        return () => clearTimeout(delayDebounceFn)
    }, [search, searchParams, router, pathname])


    return (
        <div className=" relative w-full max-w-[600px] max-lg:hidden ">
            <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
                <Image
                    src="/assets/icons/search.svg"
                    alt="search"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
                <Input
                    type="text"
                    placeholder="Search globally"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="paragraph-regular no-focus dark:dark-gradient border-none bg-light-800 shadow-none outline-none"
                />
            </div>
        </div>
    )
}

export default GlobalSearch
