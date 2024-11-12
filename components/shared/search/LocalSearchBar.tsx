"use client"

import { Input } from "@/components/ui/input"
import { formURLQuery, removeQueryParamater } from "@/lib/utils"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface CustomInputProps {
    route: string
    iconPosition: string,
    imgSrc: string
    placeholder: string
    otherClasses?: string
}

function LocalSearchBar({ route, iconPosition, imgSrc, placeholder, otherClasses }: CustomInputProps) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get("q")

    const [search, setSearch] = useState(query || "")

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newURL = formURLQuery({
                    queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                    key: "q",
                    value: search // search is the query the user type
                })
                router.push(newURL, { scroll: false })
            } else if (pathname === route) {
                const newURL = removeQueryParamater({
                    queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                    keysToRemove: ["q"],
                })
                router.push(newURL, { scroll: false })
            }

        }, 300)
        return () => clearTimeout(delayDebounceFn)
    }, [search, searchParams, route, router, pathname])

    return (
        <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
            <Image
                src={imgSrc}
                width={24}
                height={24}
                alt="search icon"
                className={`cursor-pointer ${iconPosition === "right" && "order-1"}`}
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-dark400_light700 placeholder no-focus paragraph-regular border-none bg-transparent shadow-none outline-none"
            />
        </div>
    )
}

export default LocalSearchBar
