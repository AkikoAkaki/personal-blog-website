'use client'; // 声明这是一个客户端组件

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';

// 定义组件的 props 类型
interface Props {
    translations?: Record<string, string>;
}

// 定义支持的语言列表
const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
];

const LanguageSwitcher = ({ translations }: Props) => {
    const pathname = usePathname();

    // 根据当前路径生成切换语言后的新路径
    const getLinkForLangDefault = (lang: string) => {
        if (!pathname) return '/';
        const segments = pathname.split('/');
        segments[1] = lang; // 替换 URL 的第二部分 ([lang]) 为新的语言代码
        return segments.join('/');
    };

    return (
        <div className="flex gap-3 text-sm font-poppins text-gray-500 items-center">
            {supportedLanguages.map((lang, index) => (
                // Fragment 用于包裹每个语言链接和分隔符
                <Fragment key={lang.code}>
                    {translations ? (
                        // --- 智能模式 (文章页) ---
                        translations[lang.code] ? (
                            // 如果该语言的翻译存在，则渲染一个可点击的 Link
                            <Link
                                href={`/${lang.code}/${translations[lang.code]}`}
                                className="hover:text-[#3d7fdc] transition-colors"
                            >
                                {lang.name}
                            </Link>
                        ) : (
                            // 如果翻译不存在，则渲染一个不可点击的、样式不同的 span
                            <span className="text-gray-400 cursor-not-allowed">
                                {lang.name}
                            </span>
                        )
                    ) : (
                        // --- 默认模式 (非文章页) ---
                        <Link href={getLinkForLangDefault(lang.code)} className="hover:text-[#3d7fdc]">
                            {lang.name}
                        </Link>
                    )}

                    {/* 在最后一个语言链接后不显示分隔符 */}
                    {index < supportedLanguages.length - 1 && <span>/</span>}
                </Fragment>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
