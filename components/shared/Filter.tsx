"use client"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formURLQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"



interface Props {
    filters: {
        name: string
        value: string
    }[]
    otherclasses?: string,
    containerClasses?: string
}

function Filter({ filters, otherclasses, containerClasses }: Props) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const queryParamatersFilter = searchParams.get("filter")

    function handleUsersFilter(value: string) {
        const newURL = formURLQuery({
            queryParamaters: searchParams.toString(),
            key: "filter",
            value: value.toLocaleLowerCase()
        })
        router.push(newURL, { scroll: false })
    }


    return (
        <div className={`relative ${containerClasses}`}>
            <Select
                onValueChange={handleUsersFilter}
                defaultValue={queryParamatersFilter || undefined}
            >
                <SelectTrigger className={`${otherclasses} body-regular light-border background-light800_dark300 no-focus text-dark500_light700 border px-5 py-2.5 outline-none `}>
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select a Filter" />
                    </div>
                </SelectTrigger>
                <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
                    <SelectGroup>
                        {filters.map(filter => (
                            <SelectItem
                                key={filter.value}
                                value={filter.value}
                                className="cursor-pointer"
                            >
                                {filter.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

        </div>
    )
}

export default Filter
