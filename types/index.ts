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
