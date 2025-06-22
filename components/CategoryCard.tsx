import Link from "next/link";
import type { CategoryStat } from "@/types";

interface Props {
    category: CategoryStat;
    lang: string;
    dict: {
        article: string;
        articles: string;
    };
}

/**
 * CategoryCard - 分类卡片组件（高级感纯净深灰色 + Zara风格）
 * 用于在主页展示单个分类的信息，包含分类名称、文章数量和链接
 * 使用纯净的深灰色，避免偏蓝调的颜色
 */
const CategoryCard = ({ category, lang, dict }: Props) => {
    return (
        <Link
            href={`/${lang}/category/${encodeURIComponent(category.name)}`}
            className="group block p-6 border border-gray-200 dark:border-zinc-700 
                       rounded-lg hover:shadow-lg dark:hover:shadow-zinc-800/50 
                       bg-white dark:bg-zinc-900 
                       hover:scale-[1.02] transition-all duration-300 ease-out
                       hover:-translate-y-1"
        >
            <div className="flex items-center justify-between">
                <h3 className="font-cormorantGaramond text-xl font-bold mb-2 text-gray-900 dark:text-zinc-100 
                              group-hover:scale-105 transition-all duration-300 ease-out">
                    {category.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-zinc-400 
                                group-hover:scale-110 group-hover:font-semibold 
                                transition-all duration-300 ease-out">
                    {category.articleCount} {category.articleCount === 1 ? dict.article : dict.articles}
                </span>
            </div>

            {/* 可选：分类描述 */}
            {category.description && (
                <p className="text-gray-600 dark:text-zinc-300 text-sm mt-3 leading-relaxed">
                    {category.description}
                </p>
            )}
        </Link>
    );
};

export default CategoryCard; 
