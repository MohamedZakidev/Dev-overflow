"use client"

import { Input } from "@/components/ui/input"
import { formURLQuery } from "@/lib/utils"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface CustomInputProps {
    route: string
    iconPosition: string,
    imgSrc: string
    placeholder: string
    otherClasses?: string
}

function LocalSearchBar({ route, iconPosition, imgSrc, placeholder, otherClasses }: CustomInputProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get("test")
    const [search, setSearch] = useState(query || "")

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newURL = formURLQuery({
                    queryParamaters: searchParams.toString(), // Query paramaters or strings
                    key: "q",
                    value: search
                })
                // console.log(newURL)
                router.push(newURL, { scroll: false })
            }
        }, 300)
        // Wtf is happening here?????
        return () => clearTimeout(delayDebounceFn)
    }, [search, searchParams, route])

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
                className="background-light800_darkgradient placeholder no-focus paragraph-regular border-none shadow-none outline-none"
            />
        </div>
    )
}

export default LocalSearchBar
