
import { HomePageFilters } from '@/constants/filters'
import { Button } from '../ui/button'

function HomeFilters() {
    const active = 'newest'

    return (
        <div className='mt-10 hidden flex-wrap gap-3 md:flex'>
            {HomePageFilters.map(filter => (
                <Button
                    key={filter.value}
                    className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === filter.value ? "bg-primary-100 text-primary-500 hover:bg-orange-100" : "bg-light-800 text-light-500 hover:bg-light-700"} `}
                >
                    {filter.name}
                </Button>
            ))}
        </div>
    )
}

export default HomeFilters
