import Link from 'next/link' // 导入 Next.js 的 Link 组件，用于客户端导航。
import { ArrowLeftIcon } from '@heroicons/react/24/solid' // 从 Heroicons 图标库导入左箭头图标。
import { getArticleData } from '@/lib/articles' // 导入用于获取单篇文章数据的函数。
import { getDictionary } from '@/lib/dictionaries' // 导入用于获取字典数据的函数。
import LanguageSwitcher from '@/components/LanguageSwitcher' // 导入语言切换组件

/**
 * Article 页面是一个动态路由页面，用于显示单篇文章的内容。
 * 这是一个异步的服务端组件 (Server Component)，可以在渲染前直接获取数据。
 *
 * @param {object} props - 包含动态路由参数的 props。
 * @param {{ slug: string, lang: string }} props.params - Next.js 传入的路由参数，slug 即文章的 ID。
 */
const Article = async ({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>
}) => {
  const { slug, lang } = await params // 在Next.js 15中，params是一个Promise，需要await
  const decodedSlug = decodeURIComponent(slug) // 对URL编码的中文字符进行解码
  const articleData = await getArticleData(lang, decodedSlug) // 根据 URL 中的 slug 参数，异步获取文章的标题、HTML 内容等数据。
  const dict = getDictionary(lang)

  return (
    <>
      <div className="mx-auto my-4 flex w-11/12 justify-end md:w-1/2">
        <LanguageSwitcher translations={articleData.translations} />
      </div>
      <section className="mx-auto mt-20 flex w-11/12 flex-col gap-5 md:w-[45rem]">
        {/* 页面顶部导航区，包含返回链接和文章日期 */}
        <div className="mb-8 flex justify-between font-poppins">
          <Link
            href={`/${lang}`}
            className="flex flex-row place-items-center gap-2 text-gray-600 transition-colors hover:text-[#3d7fdc]"
          >
            <ArrowLeftIcon width={20} />
            <p>{dict.back_to_home}</p>
          </Link>
          <p className="text-gray-500">{articleData.date.toString()}</p>
        </div>

        {/* 文章主标题。 */}
        <h1 className="mb-8 font-cormorantGaramond text-6xl font-light text-neutral-900">
          {articleData.title}
        </h1>

        {/*
         * 文章正文容器。
         * 使用 dangerouslySetInnerHTML 是因为文章内容是从 Markdown 转换来的 HTML 字符串。
         * 在此项目中，内容源于本地文件，是可信的，因此可以安全使用。
         */}
        <article
          className="article"
          dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
        />
      </section>
    </>
  )
}

// 默认导出该页面组件。
export default Article
