import { slug } from "github-slugger";
import React from "react";
import Category from "./Category";

const Categories = ({ categories, currentSlug, lang, getCategoryLabel }) => {
  return (
    <div className="mt-10 border-t-2 text-dark dark:text-light border-b-2 border-solid border-dark dark:border-light py-4 flex items-start flex-wrap font-medium">
      {categories.map((cat) => {
        const displayName = getCategoryLabel ? getCategoryLabel(cat) : cat;
        // 使用相对路径，让 next-intl 的 Link 组件自动处理语言前缀
        const link = cat === "all" ? "/tags" : `/tags/${cat}`;
        return (
          <Category
            key={cat}
            link={link}
            name={displayName}
            active={currentSlug === cat}
            lang={lang}
          />
        );
      })}
    </div>
  );
};

export default Categories;
