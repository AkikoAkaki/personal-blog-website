import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getCategorizedArticles } from "@/lib/articles";
import { getDictionary } from "@/lib/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * CategoryPage - 分类页面
 * 显示指定分类下的所有文章列表
 */
const CategoryPage = async ({
    params
}: {
    params: Promise<{ lang: string; categoryName: string }>
}) => {
    const { lang, categoryName } = await params;
    const decodedCategoryName = decodeURIComponent(categoryName);

    // 获取该语言下的所有分类文章
    const categorizedArticles = getCategorizedArticles(lang);
    const articles = categorizedArticles[decodedCategoryName] || [];

    const dict = getDictionary(lang);

    return (
        <>
            <div className="w-11/12 md:w-1/2 mx-auto my-4 flex justify-end">
                <LanguageSwitcher />
            </div>

            <section className="mx-auto w-11/12 md:w-1/2 mt-20 flex flex-col gap-8 mb-20">
                {/* 导航区域 */}
                <div className="flex justify-between items-center font-poppins mb-8">
                    <Link
                        href={`/${lang}`}
                        className="flex flex-row gap-2 place-items-center text-gray-600 hover:text-[#3d7fdc] transition-colors"
                    >
                        <ArrowLeftIcon width={20} />
                        <p>{dict.back_to_home}</p>
                    </Link>
                </div>

                {/* 分类标题 */}
                <header className="mb-8">
                    <h1 className="font-cormorantGaramond text-6xl font-light mb-4 text-neutral-900">
                        {decodedCategoryName}
                    </h1>
                    <p className="font-poppins text-gray-600">
                        {articles.length} {articles.length === 1 ? dict.article : dict.articles} {dict.articles_in_category}
                    </p>
                </header>

                {/* 文章列表 */}
                {articles.length > 0 ? (
                    <section className="flex flex-col gap-6">
                        {articles.map((article) => (
                            <article key={article.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                <Link
                                    href={`/${lang}/${article.id}`}
                                    className="group block"
                                >
                                    <h2 className="font-cormorantGaramond text-2xl font-medium text-black group-hover:text-[#3d7fdc] transition-colors mb-2">
                                        {article.title}
                                    </h2>
                                    <p className="font-poppins text-sm text-gray-500">
                                        {article.date}
                                    </p>
                                </Link>
                            </article>
                        ))}
                    </section>
                ) : (
                    <div className="text-center py-16">
                        <p className="font-poppins text-gray-500 text-lg">
                            {dict.no_articles_found}
                        </p>
                    </div>
                )}
            </section>
        </>
    );
};

export default CategoryPage; 
