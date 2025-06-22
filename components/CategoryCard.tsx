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
 * CategoryCard - 分类卡片组件（性能优化版本）
 * 用于在主页展示单个分类的信息，包含分类名称、文章数量和链接
 * 字典通过props传入，避免重复调用getDictionary
 */
const CategoryCard = ({ category, lang, dict }: Props) => {
    return (
        <Link
            href={`/${lang}/category/${encodeURIComponent(category.name)}`}
            className="group block"
        >
            <div className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 ease-in-out group-hover:-translate-y-1">
                {/* 分类名称 */}
                <h2 className="font-cormorantGaramond text-2xl font-medium text-neutral-900 mb-3 group-hover:text-[#3d7fdc] transition-colors">
                    {category.name}
                </h2>

                {/* 文章数量统计 */}
                <div className="flex items-center justify-between">
                    <p className="text-gray-500 font-poppins text-sm">
                        {category.articleCount} {category.articleCount === 1 ? dict.article : dict.articles}
                    </p>

                    {/* 箭头图标 */}
                    <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-[#3d7fdc] group-hover:translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>

                {/* 可选：分类描述 */}
                {category.description && (
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                        {category.description}
                    </p>
                )}
            </div>
        </Link>
    );
};

export default CategoryCard; 
