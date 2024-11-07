"use client"
import { HomePageFilters } from '@/constants/filters'
import { formURLQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'

function HomeFilters() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [active, setActive] = useState("")

    function handleQuestionsFilter(item: string) {
        if (active === item) {
            setActive("")
            const newURL = formURLQuery({
                queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                key: "filter",
                value: null // search is the query the user type
            })
            router.push(newURL, { scroll: false })
        } else {
            setActive(item)
            const newURL = formURLQuery({
                queryParamaters: searchParams.toString(), // Query paramaters or strings // q=someting
                key: "filter",
                value: item.toLocaleLowerCase() // search is the query the user type
            })
            router.push(newURL, { scroll: false })
        }
    }

    return (
        <div className='mt-10 hidden flex-wrap gap-3 md:flex'>
            {HomePageFilters.map(filter => (
                <Button
                    key={filter.value}
                    className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === filter.value
                        ? 'bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400'
                        : 'bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300'
                        }`}
                    onClick={() => handleQuestionsFilter(filter.value)}
                >
                    {filter.name}
                </Button>
            ))}
        </div>
    )
}

export default HomeFilters
