import { JSX } from "react";
import type { Root } from "hast";

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
    content: Root; // 从 string 类型的 HTML 改为 any，准备接收 hast 树
    translations: Record<string, string>; // 存储可用翻译的对象, e.g., { en: 'slug-en', zh: 'slug-zh' }
}

// 新增：分类统计类型，用于主页显示
export type CategoryStat = {
    name: string;           // 分类名称
    articleCount: number;   // 该分类下的文章数量
    description?: string;   // 可选的分类描述
}
