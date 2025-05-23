import UserCard from "@/components/cards/UserCard"
import Filter from "@/components/shared/Filter"
import Pagination from "@/components/shared/Pagination"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { UserFilters } from "@/constants/filters"
import { getAllUsers } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Community | Dev Overflow"
}

async function Community({ searchParams }: SearchParamsProps) {

    const result = await getAllUsers({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1
    })

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Our Community</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchBar
                    route="/community"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    otherClasses="flex-1"
                />
                <Filter
                    filters={UserFilters}
                    otherclasses={"min-h-[56px] sm:min-w-[170px]"}
                />
            </div>

            <section className="mt-12 flex flex-wrap gap-4">
                {result.users.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    result.users.map((user: any) => (
                        <UserCard key={user._id} user={user} />
                    ))
                ) : (
                    <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
                        <p>No users yet</p>
                        <Link href="/sign-up"
                            className="mt-2 block font-bold text-accent-blue"
                        >
                            Join to be the first
                        </Link>
                    </div>
                )}
            </section>
            <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext}
            />
        </>
    )
}

export default Community
