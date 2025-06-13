import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import { getArticleData } from "@/lib/articles"

const Article = async ({ params }: { params: { slug: string } }) => {
    const articleData = await getArticleData(params.slug)

    return (
        <section className="mx-auto w-10/12 md:w-1/2 mt-20 flex flex-col gap-5">
            <div className="flex justify-between font-poppins mb-8">
                <Link href="/" className="flex flex-row gap-2 place-items-center text-gray-600 hover:text-[#3d7fdc] transition-colors">
                    <ArrowLeftIcon width={20} />
                    <p>back to home</p>
                </Link>
                <p className="text-gray-500">{articleData.date.toString()}</p>
            </div>
            <h1 className="font-cormorantGaramond text-4xl font-light mb-8 text-neutral-900">
                {articleData.title}
            </h1>
            <article
                className="article"
                dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
            />
        </section>
    )
}

export default Article
