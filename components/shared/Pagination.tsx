"use client"
import { formURLQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'

interface Props {
    pageNumber: number,
    isNext: boolean
}

function Pagination({ pageNumber, isNext }: Props) {
    const searchParams = useSearchParams()
    const router = useRouter()

    function handleNavigation(direction: string) {
        const futurePageNumber = direction === "prev" ?
            pageNumber - 1 :
            pageNumber + 1

        const newURL = formURLQuery({
            queryParamaters: searchParams.toString(),
            key: "page",
            value: futurePageNumber.toString()
        })
        router.push(newURL)
    }

    // if (!isNext && pageNumber === 1) return null

    return (
        <div className='mt-10 flex w-full items-center justify-center gap-2'>
            <Button
                disabled={pageNumber === 1}
                onClick={() => handleNavigation("prev")}
                className='light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border'
            >
                <p className='body-medium text-dark200_light800'>Prev</p>
            </Button>

            <div className='flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2'>
                <p className='body-semibold text-light-900'>{pageNumber}</p>
            </div>

            <Button
                disabled={!isNext}
                onClick={() => handleNavigation("next")}
                className='light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border'
            >
                <p className='body-medium text-dark200_light800'>Next</p>
            </Button>

        </div>
    )
}

export default Pagination
