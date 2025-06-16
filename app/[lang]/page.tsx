import ArticleItemList from "@/components/ArticleListItem"; // 导入文章列表组件，用于展示单个分类下的文章。
import { getCategorizedArticles } from "@/lib/articles"; // 导入数据处理函数，用于获取并分类所有文章。

/**
 * HomePage 是博客的主页。
 * 它在服务端获取所有文章，按分类进行组织，并渲染出文章列表。
 */
const HomePage = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params; // 在Next.js 15中，params是一个Promise，需要await
  const articles = getCategorizedArticles(lang); // 调用函数，获取按分类组织好的文章数据。

  return (
    <section className="mx-auto w-11/12 md:w-1/2 mt-20 flex flex-col gap-16 mb-20">
      {/* 博客标题区域，使用 Tailwind CSS 工具类来定义字体、大小、字重和边距。 */}
      <header className="font-cormorantGaramond text-neutral-900 text-center">
        <h1 className="text-[100px]" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
          Aki&apos;s Blog
        </h1>
      </header>

      {/* 文章列表区域，在桌面端为两栏网格布局。 */}
      <section className="md:grid md:grid-cols-2 flex flex-col gap-10">
        {/* 确保 articles 对象存在后，遍历其中的每个分类名。 */}
        {articles !== null &&
          Object.keys(articles).map((categoryName) => (
            // 为每个分类渲染一个 ArticleItemList 组件。
            <ArticleItemList
              category={categoryName} // category: 传入当前分类的名称。
              articles={articles[categoryName]} // articles: 传入该分类下的文章数组。
              lang={lang} // lang: 传入当前语言。
              key={categoryName} // key: 使用分类名作为 React 列表渲染的唯一标识。
            />
          ))}
      </section>
    </section>
  );
};

// 默认导出主页组件。
export default HomePage;
