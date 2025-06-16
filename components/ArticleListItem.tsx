import Link from "next/link"; // Next.js 路由组件，用于无刷新页面跳转。
import type { ArticleItem } from "@/types"; // 文章条目的 TypeScript 类型定义。

// 定义组件的 props 类型。
interface Props {
    category: string; // 分类标题。
    articles: ArticleItem[]; // 该分类下的文章列表。
    lang: string; // 语言。
}

/**
 * 渲染单个文章分类及其下的文章链接列表。
 * @param {Props} props - 包含分类名和文章数组。
 */
const ArticleItemList = ({ category, articles, lang }: Props) => {
    return (
        // 单个分类区块的根容器。
        <div className="flex flex-col gap-4">
            {/* 分类标题 */}
            <h2
                className="font-cormorantGaramond text-[2.5rem] font-light mb-2"
                style={{ fontWeight: 300 }}
            >
                {category}
            </h2>

            {/* 文章链接列表 */}
            <div className="flex flex-col gap-2">
                {/* 遍历文章数组，为每篇文章生成一个链接 */}
                {articles.map((article) => (
                    <Link
                        href={`/${lang}/${article.id}`} // 指向文章详情页的动态路由。
                        key={article.id} // React 列表渲染优化所需的 key。
                        className="font-cormorantGaramond text-xl text-black hover:text-[#3d7fdc]" // 文章链接的样式和悬停效果。
                    >
                        {article.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};

// 默认导出组件，供页面使用。
export default ArticleItemList;
