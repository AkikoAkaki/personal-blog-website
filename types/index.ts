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
  // 将 contentHtml: string 修改为 content: JSX.Element
  content: JSX.Element;
  // 新增一个字段来存储所有脚注
  footnotes: Footnotes;
  translations: Record<string, string>;
}
