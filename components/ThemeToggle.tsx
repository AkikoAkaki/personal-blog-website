'use client';

import { useTheme } from '@/hooks/useTheme';

/**
 * ThemeToggle - 低调优雅的主题切换按钮（高对比度深色模式优化）
 * 设计为悬浮在页面右下角的小型按钮，不干扰阅读体验
 */
const ThemeToggle = () => {
    const { appliedTheme, toggleTheme, mounted } = useTheme();

    // 避免服务端渲染不匹配
    if (!mounted) {
        return (
            <div className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-gray-100 animate-pulse z-50" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-900/80 
                       border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm
                       hover:bg-white dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600
                       transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg dark:hover:shadow-black/40
                       flex items-center justify-center group z-50"
            aria-label={appliedTheme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            title={appliedTheme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
        >
            {/* 太阳图标 (浅色模式时显示) */}
            {appliedTheme === 'light' ? (
                <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            ) : (
                /* 月亮图标 (深色模式时显示) */
                <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle; 
 