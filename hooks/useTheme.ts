'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

/**
 * useTheme Hook - 管理深浅色模式
 * 简洁的实现，支持用户偏好保存和系统偏好检测
 */
export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>('system');
    const [mounted, setMounted] = useState(false);

    // 获取当前实际应用的主题（解析system为具体的light/dark）
    const getAppliedTheme = (): 'light' | 'dark' => {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    };

    // 应用主题到DOM
    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;
        const appliedTheme = newTheme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : newTheme;

        if (appliedTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    // 设置主题
    const changeTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    // 切换深浅色模式（简单的light/dark切换）
    const toggleTheme = () => {
        const currentApplied = getAppliedTheme();
        const newTheme = currentApplied === 'light' ? 'dark' : 'light';
        changeTheme(newTheme);
    };

    // 初始化主题
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const initialTheme = savedTheme || 'system';

        setTheme(initialTheme);
        applyTheme(initialTheme);
        setMounted(true);

        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return {
        theme,
        setTheme: changeTheme,
        toggleTheme,
        appliedTheme: mounted ? getAppliedTheme() : 'light',
        mounted, // 用于避免服务端渲染不匹配
    };
}; 
