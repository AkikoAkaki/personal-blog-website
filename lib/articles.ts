import fs from "fs"                      // 导入 Node.js 文件系统模块，用于读取文件
import matter from "gray-matter"         // 导入 gray-matter 库，用于解析 Markdown 文件的前置元数据（frontmatter）
import path from "path"                  // 导入 Node.js 路径模块，用于处理文件路径
import { remark } from "remark"          // 导入 remark 库，用于将 Markdown 转换为 HTML
import moment from "moment"              // 导入 moment 库，用于日期格式化和比较
import html from "remark-html"           // 导入 remark-html 插件，将 Markdown AST 转换为 HTML 字符串

import type { ArticleItem, ArticleData } from "@/types" // 导入自定义的文章数据类型定义
const baseArticlesDirectory = path.join(process.cwd(), "articles") // 获取 articles 文件夹的绝对路径
const supportedLangs = ["en", "zh", "ja"] // 支持的语言列表
let allArticlesCache: (ArticleItem & { lang: string })[] | undefined // 缓存所有文章的元数据


/**
 * @returns {(ArticleItem & { lang: string })[]} 包含所有文章元数据和其所属语言的数组。
 */
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



/**
 * 获取制定语言下所有文章并按日期排序
 * @param {string} lang - 语言代码 (e.g., "zh")
 * @returns {ArticleItem[]} 排序后的文章数组
 */
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

/**
 * 将文章按分类进行分组
 * @param {string} lang 语言代码
 * @returns {Record<string, ArticleItem[]>} 以分类名为键，文章数组为值的对象
 */
export const getCategorizedArticles = (lang: string): Record<string, ArticleItem[]> => {
    const sortedArticles = getSortedArticles(lang) // 获取排序后的所有文章
    const categorizedArticles: Record<string, ArticleItem[]> = {} // 创建空的分类对象

    // 遍历每篇文章，按分类进行分组
    sortedArticles.forEach((article) => {
        const category = article.category || "Uncategorized"
        if (!categorizedArticles[category]) {
            categorizedArticles[category] = [] // 如果这个分类还不存在，创建一个空数组
        }
        categorizedArticles[category].push(article) // 将文章添加到对应的分类数组中
    })

    return categorizedArticles
}

/**
 * 获取单篇文章的完整内容（包括转换后的 HTML）,并附带所有可用翻译版本的信息。
 * @param {string} lang 语言代码
 * @param {string} id 文章的 slug
 * @returns {Promise} 包含文章完整信息的 Promise 对象
 */
export const getArticleData = async (lang: string, id: string): Promise<ArticleData> => {
    const fullPath = path.join(baseArticlesDirectory, lang, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf-8")   // 读取文件内容
    const matterResult = matter(fileContents) // 解析 Markdown 文件，分离元数据和正文

    // 使用 remark 将 Markdown 正文转换为 HTML
    const processedContent = await remark()
        .use(html)  // 使用 html 插件进行转换
        .process(matterResult.content)  // 处理正文内容

    const contentHtml = processedContent.toString()

    const translationId = matterResult.data.translationId
    const translations: Record<string, string> = {}

    if (translationId) {
        // 如果有 translationId，就从所有文章中寻找匹配项
        const allArticles = getAllArticles()
        const availableTranslations = allArticles.filter(
            article => article.translationId === translationId
        )

        // 将所有可用翻译版本的信息添加到 translations 对象中
        availableTranslations.forEach(article => {
            translations[article.lang] = article.id
        })
    } else {
        // 如果没有 translationId，则认为只有当前语言版本可用
        translations[lang] = id
    }

    // 返回符合 ArticleData 类型的完整对象
    return {
        id,
        contentHtml,  // 转换后的 HTML 内容
        title: matterResult.data.title,
        category: matterResult.data.category,
        date: moment(matterResult.data.date).format("YYYY-MM-DD"),  // 格式化日期
        translationId: matterResult.data.translationId,
        translations, // 所有可用翻译版本的信息
    }
}
