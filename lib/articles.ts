import fs from "fs"                      // 导入 Node.js 文件系统模块，用于读取文件
import matter from "gray-matter"         // 导入 gray-matter 库，用于解析 Markdown 文件的前置元数据（frontmatter）
import path from "path"                  // 导入 Node.js 路径模块，用于处理文件路径
import { remark } from "remark"          // 导入 remark 库，用于将 Markdown 转换为 HTML
import moment from "moment"              // 导入 moment 库，用于日期格式化和比较
import html from "remark-html"           // 导入 remark-html 插件，将 Markdown AST 转换为 HTML 字符串

// 导入自定义的文章数据类型定义
import type { ArticleItem } from "@/types"

// 获取 articles 文件夹的绝对路径
// process.cwd() 返回当前工作目录，path.join() 将路径片段连接成完整路径
const articlesDirectory = path.join(process.cwd(), "articles")

/**
 * 获取所有文章并按日期排序
 * @returns {ArticleItem[]} 排序后的文章数组
 */
const getSortedArticles = (): ArticleItem[] => {
    
    const fileNames = fs.readdirSync(articlesDirectory) // 读取 articles 目录下的所有文件名

    // 处理每个 .md 文件，提取文章的基本信息
    const allArticlesData = fileNames.map((fileName) => { 
        const id = fileName.replace(/\.md$/, "")                // 去掉文件扩展名 .md，作为文章的唯一标识符
        const fullPath = path.join(articlesDirectory, fileName) // 构建文件的完整路径
        const fileContents = fs.readFileSync(fullPath, "utf8")  // 读取文件内容（UTF-8 编码）

        const matterResult = matter(fileContents) // 使用 gray-matter 解析 Markdown 文件，分离元数据和正文内容

        return {
            id,
            title: matterResult.data.title,       // 文章标题
            date: matterResult.data.date,         // 发布日期
            category: matterResult.data.category, // 文章分类
        }
    })

    // 按日期排序文章（最旧的在前）
    return allArticlesData.sort((a, b) => {
        const format = "YYYY-MM-DD"
        const dateA = moment(a.date, format)
        const dateB = moment(b.date, format)

        // 如果 A 比 B 早，返回 -1（A 排在前面）
        if (dateA.isBefore(dateB)) {
            return -1
        } else if (dateB.isAfter(dateA)) {
            return 1
        } else {
            return 0  // 日期相同
        }
    })
}

/**
 * 将文章按分类进行分组
 * @returns {Record<string, ArticleItem[]>} 以分类名为键，文章数组为值的对象
 */
export const getCategorizedArticles = (): Record<string, ArticleItem[]> => {
    const sortedArticles = getSortedArticles() // 获取排序后的所有文章
    const categorizedArticles: Record<string, ArticleItem[]> = {} // 创建空的分类对象

    // 遍历每篇文章，按分类进行分组
    sortedArticles.forEach((article) => {
        if (!categorizedArticles[article.category]) {
            categorizedArticles[article.category] = [] // 如果这个分类还不存在，创建一个空数组
        }
        categorizedArticles[article.category].push(article) // 将文章添加到对应的分类数组中
    })

    return categorizedArticles
}

/**
 * 获取单篇文章的完整内容（包括转换后的 HTML）
 * @param {string} id 文章的唯一标识符
 * @returns {Promise} 包含文章完整信息的 Promise 对象
 */
export const getArticleData = async (id: string) => {
    const fullPath = path.join(articlesDirectory, `${id}.md`) // 构建文章文件的完整路径
    const fileContents = fs.readFileSync(fullPath, "utf-8")   // 读取文件内容
    const matterResult = matter(fileContents)                 // 解析 Markdown 文件，分离元数据和正文

    // 使用 remark 将 Markdown 正文转换为 HTML
    const processedContent = await remark()
        .use(html)  // 使用 html 插件进行转换
        .process(matterResult.content)  // 处理正文内容

    const contentHtml = processedContent.toString() // 将处理结果转换为字符串

    // 返回文章的完整信息
    return {
        id,
        contentHtml,  // 转换后的 HTML 内容
        title: matterResult.data.title,
        categoty: matterResult.data.category,
        date: moment(matterResult.data.date).format("YYYY-MM-DD"),  // 格式化日期
    }
}
