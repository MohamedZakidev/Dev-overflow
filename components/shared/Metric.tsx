import Image from "next/image"
import Link from "next/link"

interface MetricProps {
    imgUrl: string
    alt: string
    value: number | string
    title?: string
    textStyles?: string
    href?: string
    isAuthor?: boolean
}

function Metric({ imgUrl, alt, value, title, textStyles, href, isAuthor }: MetricProps) {
    const metricContent = (
        <>
            <Image
                src={imgUrl}
                alt={alt}
                width={16}
                height={16}
                className={`object-contain ${href ? "rounded-full" : ""}`}
            />

            <p className={`${textStyles} flex items-center`}>
                {value}
                <span className={`small-regular ml-1 line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}>
                    {title}
                </span>
            </p>
        </>
    )

    // to make it clickable if it is the author metric
    if (href) {
        return (
            <Link href={href} className="flex-center flex-wrap gap-1">
                {metricContent}
            </Link>
        )
    }

    return (
        <div className="flex-center flex-wrap gap-1">
            {metricContent}
        </div>
    )
}

export default Metric
