"use client"
import { Button } from "@/components/ui/button"
import { GlobalSearchFilters } from "@/constants/filters"
import { formURLQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

function GlobalFilters() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const typeParams = searchParams.get("type")

    const [active, setActive] = useState(typeParams || "")

    function handleTypeFilter(item: string) {
        if (active === item) {
            setActive("")
            const newURL = formURLQuery({
                queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                key: "type",
                value: null // search is the query the user type
            })
            router.push(newURL, { scroll: false })


        } else {
            setActive(item)
            const newURL = formURLQuery({
                queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                key: "type",
                value: item.toLowerCase() // search is the query the user type
            })
            router.push(newURL, { scroll: false })
        }
    }

    return (
        <div className="flex items-center gap-5 px-5">
            <p className="text-dark400_light900 body-medium">Type:</p>
            <div className="flex gap-3">
                {GlobalSearchFilters.map(item => (
                    <Button
                        key={item.value}
                        type="button"
                        className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 ${active === item.value ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 hover:bg-light-700 hover:text-primary-500 dark:bg-dark-500"}`}
                        onClick={() => handleTypeFilter(item.value)}
                    >
                        {item.name}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default GlobalFilters
