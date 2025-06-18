'use client';

import { useState, useMemo } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

interface Props {
    id: string;
    content: string; // 我们期望接收原始的 Markdown 文本
}

/**
 * 自定义脚注组件，负责渲染上标和悬浮提示框。
 */
const Footnote = ({ id, content }: Props) => {
    const [isHovered, setIsHovered] = useState(false);

    // 添加调试信息
    console.log('Footnote组件渲染:', { id, content: content?.substring(0, 50) + '...' });

    // 使用 useMemo 进行性能优化，只有当 content 变化时才重新处理 Markdown
    const contentHtml = useMemo(() => {
        if (!content) {
            console.log('警告: 脚注内容为空', { id });
            return '';
        }
        // 这个管道将脚注的 Markdown 内容安全地转换为 HTML
        return unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeStringify)
            .processSync(content)
            .toString();
    }, [content]);

    return (
        // 将交互事件放在外层容器上，以获得更稳定的悬停效果
        <span
            className="relative inline-block align-super" // 使用 align-super 确保对齐
            onMouseEnter={() => {
                console.log('鼠标进入脚注:', id);
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                console.log('鼠标离开脚注:', id);
                setIsHovered(false);
            }}
        >
            {/* 这是页面上显示的脚注引用，例如 [1] */}
            <span className="font-serif text-sm text-gray-500 hover:underline cursor-pointer">
                [{id}]
            </span>

            {/* 这是悬浮提示框 */}
            {isHovered && (
                <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-white border border-gray-200 rounded-md shadow-lg text-sm text-gray-700 font-serif leading-relaxed"
                    style={{
                        zIndex: 9999,
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '8px',
                        pointerEvents: 'none'
                    }}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            )}
        </span>
    );
};

export default Footnote;
