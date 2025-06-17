import type { ReactElement } from 'react';

export type ArticleItem = {
  id: string
  title: string
  date: string
  category: string
  translationId: string
}

export type ArticleData = ArticleItem & {
  content: ReactElement
  footnotes: Record<string, ReactElement> // 用于存储脚注内容
  translations: Record<string, string> // 存储可用翻译的对象, e.g., { en: 'slug-en', zh: 'slug-zh' }
}
