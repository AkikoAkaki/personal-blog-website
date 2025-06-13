import Link from "next/link"
import type { ArticleItem } from "@/types"

interface Props {
    category: string
    articles: ArticleItem[]
}

const ArticleItemList = ({ category, articles }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <h2
                className="font-cormorantGaramond text-[2.5rem] font-light mb-2"
                style={{ fontWeight: 300 }}
            >
                {category}
            </h2>
            <div className="flex flex-col gap-1">
                {articles.map((article) => (
                    <Link
                        href={`/${article.id}`}
                        key={article.id}
                        className="font-poppins text-lg text-black hover:text-[#3d7fdc]"
                    >
                        {article.title}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ArticleItemList
