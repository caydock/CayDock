import { cx } from "@/src/utils";
import SmartLink from "./SmartLink";
import React from "react";

const Tag = ({ link = "#", name, locale, ...props }) => {
  return (
    <SmartLink
      href={link}
      locale={locale}
      className={cx(
        "inline-block py-2 sm:py-3 px-6 sm:px-10  bg-dark text-light rounded-full capitalize font-semibold border-2 border-solid border-light hover:scale-105 transition-all ease duration-200 text-sm sm:text-base",
        props.className
      )}
    >
      {name}
    </SmartLink>
  );
};

export default Tag;
