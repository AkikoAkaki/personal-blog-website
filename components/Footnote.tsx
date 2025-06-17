'use client'; // 最终版本需要交互，所以是客户端组件

import { useState, type ReactElement } from 'react';

// 定义组件的 Props 类型
interface Props {
    id: string;
    content: ReactElement;
}

const Footnote = ({ id, content }: Props) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <sup className="cursor-pointer text-blue-500 hover:underline">
                [{id}]
            </sup>
            <div
                className={`
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 
                    rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-lg
                    transition-all duration-300 ease-in-out
                    ${isHovered ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'}
                `}
            >
                {content}
            </div>
        </span>
    );
};

export default Footnote;
