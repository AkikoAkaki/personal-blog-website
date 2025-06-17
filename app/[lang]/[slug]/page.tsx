import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getArticleData } from "@/lib/articles";
import { getDictionary } from "@/lib/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footnote from "@/components/Footnote";

import React, { Fragment, ComponentProps } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const Article = async ({ params }: { params: { slug: string, lang: string } }) => {
  const { slug, lang } = params;
  const decodedSlug = decodeURIComponent(slug);

  const articleData = await getArticleData(lang, decodedSlug);
  const dict = getDictionary(lang);

  const fullPath = path.join(process.cwd(), "articles", lang, `${decodedSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { content: markdownContent } = matter(fileContents);

  // 配置 rehype-react
  const contentElement = (await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeReact, {
      jsx: jsx,
      jsxs: jsxs,
      Fragment: Fragment,
      components: {
        // 拦截 <sup> 标签的渲染
        sup(props: ComponentProps<'sup'>) {
          const { id, children } = props;
          console.log('拦截到sup标签:', { id, children, props });

          // 检查 id 是否符合脚注引用的格式，如 "fnref-1"
          if (id && id.startsWith('fnref-')) {
            const footnoteId = id.substring(6);
            const footnoteContent = articleData.footnotes[footnoteId];

            console.log('脚注匹配检查:', {
              footnoteId,
              footnoteContent: footnoteContent?.substring(0, 50) + '...',
              hasContent: !!footnoteContent,
              allFootnotes: Object.keys(articleData.footnotes)
            });

            // 如果在数据中找到了对应的脚注内容，就渲染我们的自定义组件
            if (footnoteContent) {
              return <Footnote id={footnoteId} content={footnoteContent} />;
            }
          }

          // 否则，按默认方式渲染 sup 标签
          console.log('使用默认sup渲染:', props);
          return <sup {...props} />;
        },
        // 拦截并移除页面底部的默认脚注列表
        section(props: ComponentProps<'section'>) {
          if (props.className && props.className.includes('footnotes')) {
            return null;
          }
          return <section {...props} />;
        }
      },
    })
    .process(markdownContent)).result;

  return (
    <>
      <div className="w-11/12 md:w-1/2 mx-auto my-4 flex justify-end">
        <LanguageSwitcher translations={articleData.translations} />
      </div>
      <section className="mx-auto w-11/12 md:w-[45rem] mt-20 flex flex-col gap-5">
        <div className="flex justify-between font-poppins mb-8">
          <Link href={`/${lang}`} className="flex flex-row gap-2 place-items-center text-gray-600 hover:text-[#3d7fdc] transition-colors">
            <ArrowLeftIcon width={20} />
            <p>{dict.back_to_home}</p>
          </Link>
          <p className="text-gray-500">{articleData.date.toString()}</p>
        </div>

        <h1 className="font-cormorantGaramond text-6xl font-light mb-8 text-neutral-900">
          {articleData.title}
        </h1>

        <article className="article">
          {contentElement}
        </article>
      </section>
    </>
  );
};

export default Article;
