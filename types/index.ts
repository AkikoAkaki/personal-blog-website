import { JSX } from "react";

export type ArticleItem = {
    id: string
    title: string 
    date: string
    category: string
    translationId: string
}

// 脚注内容的类型
export type Footnotes = Record<string, string>;

export type ArticleData = ArticleItem & {
    contentHtml: string
    translations: Record<string, string>; // 存储可用翻译的对象, e.g., { en: 'slug-en', zh: 'slug-zh' }
}

// 新增：分类统计类型，用于主页显示
export type CategoryStat = {
    name: string;           // 分类名称
    articleCount: number;   // 该分类下的文章数量
    description?: string;   // 可选的分类描述
}
