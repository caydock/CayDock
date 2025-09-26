import { cx } from "@/src/utils";
import { Link as IntlLink } from '@/src/i18n/routing';
import Link from "next/link";
import React from "react";

const Category = ({ link = "#", name, active, lang, ...props }) => {
  // 如果有 lang 参数，使用 next-intl 的 Link 并指定 locale
  if (lang) {
    return (
      <IntlLink
        href={link}
        locale={lang}
        className={cx(
          "inline-block py-1.5  md:py-2 px-6  md:px-10   rounded-full border-2 border-solid border-dark dark:border-light hover:scale-105 transition-all ease duration-200 m-2 capitalize",
          props.className,
          active ? "bg-dark text-light dark:bg-light dark:text-dark" : "bg-light text-dark dark:bg-dark dark:text-light"
        )}
      >
        #{name}
      </IntlLink>
    );
  }
  
  // 没有 lang 参数时使用普通 Link
  return (
    <Link
      href={link}
      className={cx(
        "inline-block py-1.5  md:py-2 px-6  md:px-10   rounded-full border-2 border-solid border-dark dark:border-light hover:scale-105 transition-all ease duration-200 m-2 capitalize",
        props.className,
        active ? "bg-dark text-light dark:bg-light dark:text-dark" : "bg-light text-dark dark:bg-dark dark:text-light"
      )}
    >
      #{name}
    </Link>
  );
};

export default Category;
