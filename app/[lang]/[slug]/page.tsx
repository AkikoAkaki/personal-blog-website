import Link from "next/link"; // 导入 Next.js 的 Link 组件，用于客户端导航。
import { ArrowLeftIcon } from "@heroicons/react/24/solid"; // 从 Heroicons 图标库导入左箭头图标。
import { getArticleData } from "@/lib/articles"; // 导入用于获取单篇文章数据的函数。
import { getDictionary } from "@/lib/dictionaries"; // 导入用于获取字典数据的函数。
import LanguageSwitcher from "@/components/LanguageSwitcher"; // 导入语言切换组件

/**
 * Article 页面是一个动态路由页面，用于显示单篇文章的内容。
 * 这是一个异步的服务端组件 (Server Component)，可以在渲染前直接获取数据。
 */
const Article = async ({ params }: { params: Promise<{ slug: string, lang: string }> }) => {
  const { slug, lang } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const articleData = await getArticleData(lang, decodedSlug);
  const dict = getDictionary(lang);

  return (
    <>
      <div className="w-11/12 md:w-1/2 mx-auto my-4 flex justify-end">
        <LanguageSwitcher translations={articleData.translations} />
      </div>
      <section className="mx-auto w-11/12 md:w-[45rem] mt-20 flex flex-col gap-5">
        <div className="flex justify-between font-poppins mb-8">
          <Link href={`/${lang}`} className="flex flex-row gap-2 place-items-center text-gray-600 hover:text-[#3d7fdc] transition-colors">
            <ArrowLeftIcon width={20} />
            <p>{dict.back_to_home}</p>
          </Link>
          <p className="text-gray-500">{articleData.date.toString()}</p>
        </div>

        <h1 className="font-cormorantGaramond text-6xl font-light mb-8 text-neutral-900">
          {articleData.title}
        </h1>

        {/* * 直接渲染由 rehype-react 生成的 React 元素。
                  * `articleData.content` 现在是一个完整的组件树，其中包含了我们的 <Footnote /> 组件。
                  * 我们不再需要使用 dangerouslySetInnerHTML。
                  */}
        <article className="article">
          {articleData.content}
        </article>
      </section>
    </>
  );
};

export default Article;
