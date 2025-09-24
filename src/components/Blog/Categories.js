import { slug } from "github-slugger";
import React from "react";
import Category from "./Category";

const Categories = ({ categories, currentSlug, lang, getCategoryLabel }) => {
  return (
    <div className="px-5 sm:px-10 md:px-10 mt-10 border-t-2 text-dark dark:text-light border-b-2 border-solid border-dark dark:border-light py-4 flex items-start flex-wrap font-medium">
      {categories.map((cat) => {
        const displayName = getCategoryLabel ? getCategoryLabel(cat) : cat;
        return (
          <Category
            key={cat}
            link={`/categories/${cat}`}
            name={displayName}
            active={currentSlug === cat}
          />
        );
      })}
    </div>
  );
};

export default Categories;
