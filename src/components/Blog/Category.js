import { cx } from "@/src/utils";
import { Link } from '@/src/i18n/routing';
import React from "react";

const Category = ({ link = "#", name, active, lang, ...props }) => {
  return (
    <Link
      href={link}
      {...(lang && { locale: lang })}
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
