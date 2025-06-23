import CategoryCard from "@/components/CategoryCard"; // 导入新的分类卡片组件
import { getCategoryStats } from "@/lib/articles"; // 导入分类统计函数
import { getDictionary } from "@/lib/dictionaries"; // 导入字典函数
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * HomePage 是博客的主页。
 * 显示分类卡片，用户需要点击分类来查看具体文章
 */
const HomePage = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params; // 在Next.js 15中，params是一个Promise，需要await
  const categoryStats = getCategoryStats(lang); // 获取分类统计信息
  const dict = getDictionary(lang); // 获取多语言字典

  return (
    <>
      <div className="w-11/12 md:w-1/2 mx-auto my-4 flex justify-end">
        <LanguageSwitcher />
      </div>
      
      <section className="mx-auto w-11/12 md:w-2/3 lg:w-1/2 mt-20 flex flex-col gap-16 mb-20">
        {/* 博客标题区域 */}
        <header className="font-cormorantGaramond text-neutral-900 dark:text-white text-center">
          <h1 className="text-[80px] sm:text-[85px] md:text-[90px] lg:text-[100px]" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
            Aki&apos;s Blog
          </h1>
          <p className="font-poppins text-gray-600 dark:text-gray-300 text-lg mt-4">
            {dict.explore_subtitle}
          </p>
        </header>

        {/* 分类卡片网格 */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryStats.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              lang={lang}
              dict={{ article: dict.article, articles: dict.articles }}
            />
          ))}
        </section>

        {/* 如果没有分类，显示提示信息 */}
        {categoryStats.length === 0 && (
          <div className="text-center py-16">
            <p className="font-poppins text-gray-500 dark:text-zinc-400 text-lg">
              {dict.no_articles_available}
            </p>
          </div>
        )}
      </section>
    </>
  );
};

// 默认导出主页组件。
export default HomePage;
