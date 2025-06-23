'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface NavigationMenuProps {
    currentLang: string;
    categories?: { name: string }[];
    // 预留未来扩展的其他菜单内容
}

/**
 * NavigationMenu - 通用导航菜单组件
 * 当前只支持分类导航，未来可扩展其他功能
 */
const NavigationMenu = ({ currentLang, categories = [] }: NavigationMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className="flex flex-row gap-2 place-items-center text-gray-600 dark:text-zinc-400 
                           hover:scale-105 transition-all duration-200 ease-out"
            >
                {/* 简单的菜单图标 - 根据状态显示不同图标 */}
                <span className="transition-transform duration-200 ease-out">
                    {isOpen ? '✕' : '☰'}
                </span>
            </button>

            {/* 分类菜单列表 - 毛玻璃质感效果 */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 min-w-48
                                animate-in fade-in-0 zoom-in-95 duration-200 ease-out
                                slide-in-from-top-2">
                    {/* 毛玻璃容器 */}
                    <div className="backdrop-blur-xl bg-white/80 dark:bg-black/80 
                                    border border-white/20 dark:border-white/10
                                    rounded-xl shadow-2xl shadow-gray-500/20 dark:shadow-black/40
                                    ring-1 ring-black/5 dark:ring-white/5">
                        <div className="p-3">
                            {/* 首页链接 */}
                            <Link
                                href={`/${currentLang}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-zinc-200 
                                           hover:bg-white/60 dark:hover:bg-white/10 rounded-lg
                                           transition-all duration-150 ease-out
                                           hover:scale-[1.02] hover:translate-x-1"
                            >
                                首页
                            </Link>

                            {/* 分类列表 */}
                            {categories.length > 0 && (
                                <>
                                    <hr className="my-3 border-gray-200/50 dark:border-white/10" />
                                    <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 px-3 py-1 mb-1">分类</div>
                                    {categories.map((category, index) => (
                                        <Link
                                            key={category.name}
                                            href={`/${currentLang}/category/${encodeURIComponent(category.name)}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-zinc-200
                                                       hover:bg-white/60 dark:hover:bg-white/10 rounded-lg
                                                       transition-all duration-150 ease-out
                                                       hover:scale-[1.02] hover:translate-x-1"
                                            style={{
                                                animationDelay: `${(index + 1) * 50}ms`,
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavigationMenu; 
