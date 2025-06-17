import fs from "fs";
import matter from "gray-matter";
import path from "path";
import moment from "moment";
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified, Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { toString as mdastToString } from 'mdast-util-to-string'; // 引入新工具
import type { Root, FootnoteDefinition } from 'mdast'; // 引入类型
import type { ArticleItem, ArticleData, Footnotes } from "@/types";

const baseArticlesDirectory = path.join(process.cwd(), "articles");
const supportedLangs = ["en", "zh", "ja"];
let allArticlesCache: (ArticleItem & { lang: string })[] | undefined;


const getAllArticles = (): (ArticleItem & { lang: string })[] => {
    if (allArticlesCache) return allArticlesCache

    const allarticles: (ArticleItem & { lang: string })[] = []

    supportedLangs.forEach(lang => {
        const langDirectory = path.join(baseArticlesDirectory, lang)

        if (!fs.existsSync(langDirectory)) return

        const fileNames = fs.readdirSync(langDirectory)

        fileNames.forEach((fileName) => {
            if (!fileName.endsWith(".md")) return

            const id = fileName.replace(/\.md$/, "")
            const fullPath = path.join(langDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, "utf8")
            const matterResult = matter(fileContents)

            allarticles.push({
                id,
                lang,
                title: matterResult.data.title,
                date: matterResult.data.date,
                category: matterResult.data.category,
                translationId: matterResult.data.translationId,
            })
        })
    })

    allArticlesCache = allarticles
    return allArticlesCache
}

const getSortedArticles = (lang: string): ArticleItem[] => {
    const allArticles = getAllArticles()
    const articlesForLang = allArticles.filter(article => article.lang === lang)

    return articlesForLang.sort((a, b) => {
        const format = "YYYY-MM-DD"
        const dateA = moment(a.date, format)
        const dateB = moment(b.date, format)
        return dateA.isBefore(dateB) ? 1 : -1
    })
}

export const getCategorizedArticles = (lang: string): Record<string, ArticleItem[]> => {
    const sortedArticles = getSortedArticles(lang)
    const categorizedArticles: Record<string, ArticleItem[]> = {}

    sortedArticles.forEach((article) => {
        const category = article.category || "Uncategorized"
        if (!categorizedArticles[category]) {
            categorizedArticles[category] = []
        }
        categorizedArticles[category].push(article)
    })

    return categorizedArticles
}


const extractFootnotesPlugin: Plugin<[Footnotes], Root> = (options) => {
    return (tree: Root) => {
        console.log('开始提取脚注...');
        visit(tree, 'footnoteDefinition', (node: FootnoteDefinition) => {
            const id = node.identifier;
            const content = mdastToString(node);
            console.log('找到脚注定义:', { id, content: content.substring(0, 100) + '...' });
            if (options) {
                options[id] = content.trim();
            }
        });
        console.log('脚注提取完成，总数:', Object.keys(options || {}).length);
    };
};


// 修正后的 getArticleData 函数
export const getArticleData = async (lang: string, id: string): Promise<Omit<ArticleData, 'content'>> => {
    const fullPath = path.join(baseArticlesDirectory, lang, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(fileContents);

    const footnotes: Footnotes = {};

    // 修正部分：显式地分步执行 parse 和 run
    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(extractFootnotesPlugin, footnotes);

    // 1. 解析 Markdown 内容为语法树
    const tree = processor.parse(matterResult.content);
    // 2. 在树上运行插件以提取脚注
    await processor.run(tree);

    // 翻译链接处理逻辑保持不变
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
        footnotes,
        title: matterResult.data.title,
        category: matterResult.data.category,
        date: moment(moment(matterResult.data.date).toDate()).format("YYYY-MM-DD"),
        translationId: matterResult.data.translationId,
        translations,
    };
}
