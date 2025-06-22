const dictionaries: Record<string, {
    back_to_home: string;
    article: string;
    articles: string;
    articles_in_category: string;
    no_articles_found: string;
    explore_subtitle: string;
    no_articles_available: string;
}> = {
    en: {
        back_to_home: "back to home",
        article: "article",
        articles: "articles",
        articles_in_category: "in this category",
        no_articles_found: "No articles found in this category.",
        explore_subtitle: "Explore thoughts on philosophy, literature, and art",
        no_articles_available: "No articles available in this language yet.",
    },
    zh: {
        back_to_home: "返回主页",
        article: "篇文章",
        articles: "篇文章",
        articles_in_category: "篇文章",
        no_articles_found: "此分类下暂无文章。",
        explore_subtitle: "探索哲学、文学与艺术的思考",
        no_articles_available: "此语言下暂无文章。",
    },
    ja: {
        back_to_home: "ホームページに戻る",
        article: "記事",
        articles: "記事",
        articles_in_category: "件の記事",
        no_articles_found: "このカテゴリには記事がありません。",
        explore_subtitle: "哲学、文学、芸術についての考察を探る",
        no_articles_available: "この言語の記事はまだありません。",
    },
};

export const getDictionary = (lang: string) => {
    return dictionaries[lang] ?? dictionaries.en;
};
