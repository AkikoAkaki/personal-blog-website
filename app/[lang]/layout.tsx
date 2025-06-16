import type { Metadata } from "next"; // 导入 Next.js 的元数据类型，用于 SEO。
import { Cormorant_Garamond, Poppins, Noto_Sans_SC, Noto_Serif_SC, Lora } from "next/font/google"; // 导入字体，以优化性能并避免布局偏移。
import "./globals.css"; // 导入全局样式。
import LanguageSwitcher from "@/components/LanguageSwitcher";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const lora = Lora({
  subsets: ["latin"],
  style: ['normal', 'italic'],
  weight: ["400", "500", "600", "700"],
  variable: '--font-lora',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "700"], 
  display: 'swap',
  variable: '--font-noto-sans-sc', 
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: 'swap',
  variable: '--font-noto-serif-sc',
});

// 导出应用的默认元数据。
export const metadata: Metadata = {
  title: "Aki's Blog",
  description: "A personal blog website",
};

/**
 * RootLayout 是应用的根布局，会包裹所有页面。
 * @param {object} props - 包含子组件的 props。
 * @param {React.ReactNode} props.children - 由 Next.js 传入的页面或嵌套布局。
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${poppins.variable} ${notoSansSC.variable} ${notoSerifSC.variable} ${lora.variable}`} // 将字体变量作为 className 应用，使其在 CSS 中可用。
        suppressHydrationWarning={true} // 压制 hydration 警告，这通常用于处理服务器与客户端渲染的微小差异。
      >
        <div className="w-11/12 md:w-1/2 mx-auto my-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
