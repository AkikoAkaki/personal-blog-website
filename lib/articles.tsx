import fs from "fs";
import path from "path";
import matter from "gray-matter";
import moment from "moment";
import { unified, type Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import remarkStringify from "remark-stringify";
import { Fragment, type ReactElement, type ComponentProps } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { visit } from "unist-util-visit";
import type { Root, Content } from "mdast";

import Footnote from "@/components/Footnote";
import type { ArticleItem, ArticleData } from "@/types";

const baseArticlesDirectory = path.join(process.cwd(), "articles");
const supportedLangs = ["en", "zh", "ja"];
let allArticlesCache: (ArticleItem & { lang: string })[] | undefined;

// ... (前半部分函数无需改动) ...
const getAllArticles = (): (ArticleItem & { lang: string })[] => {
    if (allArticlesCache) return allArticlesCache;
    const allarticles: (ArticleItem & { lang: string })[] = [];
    supportedLangs.forEach(lang => {
        const langDirectory = path.join(baseArticlesDirectory, lang);
        if (!fs.existsSync(langDirectory)) return;
        const fileNames = fs.readdirSync(langDirectory);
        fileNames.forEach((fileName) => {
            if (!fileName.endsWith(".md")) return;
            const id = fileName.replace(/\.md$/, "");
            const fullPath = path.join(langDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const matterResult = matter(fileContents);
            allarticles.push({
                id,
                lang,
                title: matterResult.data.title,
                date: matterResult.data.date,
                category: matterResult.data.category,
                translationId: matterResult.data.translationId,
            });
        });
    });
    allArticlesCache = allarticles;
    return allarticles;
};

const getSortedArticles = (lang: string): ArticleItem[] => {
    const allArticles = getAllArticles();
    const articlesForLang = allArticles.filter(article => article.lang === lang);
    return articlesForLang.sort((a, b) => {
        const format = "YYYY-MM-DD";
        const dateA = moment(a.date, format);
        const dateB = moment(b.date, format);
        return dateA.isBefore(dateB) ? 1 : -1;
    });
};

export const getCategorizedArticles = (lang: string): Record<string, ArticleItem[]> => {
    const sortedArticles = getSortedArticles(lang);
    const categorizedArticles: Record<string, ArticleItem[]> = {};
    sortedArticles.forEach((article) => {
        const category = article.category || "Uncategorized";
        if (!categorizedArticles[category]) {
            categorizedArticles[category] = [];
        }
        categorizedArticles[category].push(article);
    });
    return categorizedArticles;
};

export const getArticleData = async (lang: string, id: string): Promise<ArticleData> => {
    const fullPath = path.join(baseArticlesDirectory, lang, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(fileContents);

    const footnotesReactMap: Record<string, ReactElement> = {};

    // @ts-ignore remark-gfm 会在 data 属性上附加 footnoteDefinitions
    const { footnoteDefinitions = {} } = (unified().use(remarkParse).use(remarkGfm).parse(matterResult.content)).data ?? {};

    for (const identifier in footnoteDefinitions) {
        const footnoteAst = footnoteDefinitions[identifier] as Root;
        if (!footnoteAst) continue;

        const footnoteContent = (await unified()
            .use(remarkRehype)
            .use(rehypeReact, { Fragment, jsx, jsxs })
            .run(footnoteAst)) as ReactElement;

        footnotesReactMap[identifier] = footnoteContent;
    }

    const content = (await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeReact, {
            Fragment,
            jsx,
            jsxs,
            components: {
                // 最终修正：拦截 a 标签并使用正确的 id 前缀
                a: (props: ComponentProps<'a'>) => {
                    const { id, children } = props;
                    if (id && typeof id === 'string' && id.startsWith('user-content-fnref-')) {
                        const footnoteId = id.substring('user-content-fnref-'.length);
                        const footnoteContent = footnotesReactMap[footnoteId];

                        if (footnoteContent) {
                            return <Footnote id={footnoteId} content={footnoteContent} />;
                        }
                    }
                    return <a {...props}>{children}</a>;
                },
                // 我们不再需要拦截 sup 了，因为 id 不在 sup 上
            },
        })
        .process(matterResult.content)).result as ReactElement;

    const translationId = matterResult.data.translationId;
    const translations: Record<string, string> = {};

    if (translationId) {
        const allArticles = getAllArticles();
        const availableTranslations = allArticles.filter(
            article => article.translationId === translationId
        );
        availableTranslations.forEach(article => {
            translations[article.lang] = article.id;
        });
    } else {
        translations[lang] = id;
    }

    return {
        id,
        content,
        footnotes: footnotesReactMap,
        title: matterResult.data.title,
        category: matterResult.data.category,
        date: moment(matterResult.data.date).format("YYYY-MM-DD"),
        translationId: matterResult.data.translationId,
        translations,
    };
};
