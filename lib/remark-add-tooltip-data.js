// lib/remark-add-tooltip-data.js

import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'

/**
 * 一个 remark 插件，用于将脚注定义的内容附加到脚注引用的 `data-tooltip` 属性上。
 */
export default function remarkAddTooltipData() {

    return (tree) => {
        // 1. 创建一个 Map 来存储所有脚注定义的内容。
        //    键是脚注的标识符（例如 '1'），值是脚注的文本内容。
        const definitions = new Map()

        // 第一次遍历：收集所有的脚注定义。
        visit(tree, 'footnoteDefinition', (node) => {
            // 尝试不同的标识符格式以确保匹配
            const idOriginal = node.identifier
            const idUpper = node.identifier.toUpperCase()
            const idLower = node.identifier.toLowerCase()

            // 使用 `mdast-util-to-string` 将脚注内容（可能包含 Markdown）转换为纯文本。
            const content = toString(node)

            // 存储多种格式的标识符以提高匹配成功率
            definitions.set(idOriginal, content)
            definitions.set(idUpper, content)
            definitions.set(idLower, content)
        })

        // 2. 第二次遍历：找到所有的脚注引用，并附加上 tooltip 数据。
        visit(tree, 'footnoteReference', (node) => {
            // 尝试多种标识符格式来查找对应的定义内容
            const idOriginal = node.identifier
            const idUpper = node.identifier.toUpperCase()
            const idLower = node.identifier.toLowerCase()

            let content = definitions.get(idOriginal) ||
                definitions.get(idUpper) ||
                definitions.get(idLower)

            if (content) {
                // `data.hProperties` 是 remark/rehype 用来向最终的 HTML 标签添加属性的对象。
                // 我们在这里创建一个 `data-tooltip` 属性。
                if (!node.data) {
                    node.data = {}
                }
                if (!node.data.hProperties) {
                    node.data.hProperties = {}
                }
                node.data.hProperties['data-tooltip'] = content
            }
        })
    }
}
