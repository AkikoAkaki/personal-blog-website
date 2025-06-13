'use client'; // 声明这是一个客户端组件

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const LanguageSwitcher = () => {
    const pathname = usePathname();

    // 根据当前路径生成切换语言后的新路径
    const getLinkForLang = (lang: string) => {
        if (!pathname) return '/';
        const segments = pathname.split('/');
        segments[1] = lang; // URL 的第二部分 ([lang]) 会被替换为新的语言代码
        return segments.join('/');
    };

    return (
        <div className="flex gap-3 text-sm font-poppins text-gray-500">
            <Link href={getLinkForLang('en')} className="hover:text-[#3d7fdc]">English</Link>
            <span>/</span>
            <Link href={getLinkForLang('zh')} className="hover:text-[#3d7fdc]">中文</Link>
            <span>/</span>
            <Link href={getLinkForLang('ja')} className="hover:text-[#3d7fdc]">日本語</Link>
        </div>
    );
};

export default LanguageSwitcher;
