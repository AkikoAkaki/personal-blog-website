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
                        className="flex flex-row gap-2 place-items-center text-gray-600 dark:text-zinc-400 
                                    hover:scale-105 hover:drop-shadow-sm transition-all duration-300 ease-out"
                    >
                        <ArrowLeftIcon width={20} />
                        <p>{dict.back_to_home}</p>
                    </Link>
                </div>

                {/* 分类标题 */}
                <header className="mb-8">
                    <h1 className="font-cormorantGaramond text-6xl font-light mb-4 text-neutral-900 dark:text-white">
                        {decodedCategoryName}
                    </h1>
                    <p className="font-poppins text-gray-600 dark:text-zinc-300">
                        {articles.length} {articles.length === 1 ? dict.article : dict.articles} {dict.articles_in_category}
                    </p>
                </header>

                {/* 文章列表 */}
                {articles.length > 0 ? (
                    <section className="flex flex-col gap-6">
                        {articles.map((article) => (
                            <article key={article.id} className="border-b border-gray-100 dark:border-zinc-700 pb-6 last:border-b-0">
                                <Link
                                    href={`/${lang}/${article.id}`}
                                    className="group block py-4 border-b border-gray-100 dark:border-zinc-800 
                                              hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 
                                              transition-all duration-300 ease-out"
                                >
                                    <h2 className="font-cormorantGaramond text-2xl font-medium text-black dark:text-white 
                                                  group-hover:text-gray-700 dark:group-hover:text-zinc-200
                                                  transition-colors duration-300 mb-2 
                                                  relative after:content-[''] after:absolute after:bottom-0 after:left-0 
                                                  after:w-0 after:h-0.5 after:bg-gray-400 dark:after:bg-zinc-500
                                                  after:transition-all after:duration-300 after:ease-out
                                                  group-hover:after:w-full">
                                        {article.title}
                                    </h2>
                                    <p className="font-poppins text-sm text-gray-500 dark:text-zinc-400">
                                        {article.date}
                                    </p>
                                </Link>
                            </article>
                        ))}
                    </section>
                ) : (
                    <div className="text-center py-16">
                            <p className="font-poppins text-gray-500 dark:text-zinc-400 text-lg">
                            {dict.no_articles_found}
                        </p>
                    </div>
                )}
            </section>
        </>
    );
};

export default CategoryPage; 
