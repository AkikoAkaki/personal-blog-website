const dictionaries: Record<string, { back_to_home: string }> = {
  en: {
    back_to_home: 'back to home',
  },
  zh: {
    back_to_home: '返回主页',
  },
  ja: {
    back_to_home: 'ホームページに戻る',
  },
}

export const getDictionary = (lang: string) => {
  return dictionaries[lang] ?? dictionaries.en
}
