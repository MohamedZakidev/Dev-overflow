"use client"
import { Input } from "@/components/ui/input"
import { formURLQuery, removeQueryParamater } from "@/lib/utils"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import GlobalResult from "./GlobalResult"

function GlobalSearch() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchResultRef = useRef(null)

    const localQuery = searchParams.get("q")
    const globalQuery = searchParams.get("global")

    const [globalSearch, setGlobalSearch] = useState(globalQuery || "")
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // to close on pathname change
        setIsOpen(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function handleOutsideClick(event: any) {
            // @ts-expect-error no need for ts
            if (searchResultRef.current && !searchResultRef.current.contains(event.target)) {
                setIsOpen(false)
                setGlobalSearch("")
            }
        }
        document.addEventListener("click", handleOutsideClick)

        return () => document.removeEventListener("click", handleOutsideClick)
    }, [pathname])


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (globalSearch) {
                const newURL = formURLQuery({
                    queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                    key: "global",
                    value: globalSearch // search is the query the user type
                })
                router.push(newURL, { scroll: false })
            } else if (!globalSearch) {
                const newURL = removeQueryParamater({
                    queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                    keysToRemove: ["global", "type"],
                })
                router.push(newURL, { scroll: false })
            }

        }, 300)
        return () => clearTimeout(delayDebounceFn)
    }, [globalSearch, searchParams, router, pathname, localQuery])


    return (
        <div
            className="relative w-full max-w-[600px] max-lg:hidden"
            ref={searchResultRef}
        >
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
                    value={globalSearch}
                    onChange={(e) => {
                        setGlobalSearch(e.target.value)
                        if (!isOpen) setIsOpen(true)
                        if (e.target.value === "" && isOpen) setIsOpen(false)
                    }}
                    className="paragraph-regular no-focus dark:dark-gradient border-none bg-light-800 shadow-none outline-none"
                />
            </div>
            {isOpen && <GlobalResult />}
        </div>
    )
}

export default GlobalSearch
