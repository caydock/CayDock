import { cx } from "@/src/utils";
import SmartLink from "./SmartLink";
import React from "react";

const Tag = ({ link = "#", name, locale, ...props }) => {
  // 如果传入了自定义 className，使用自定义样式，否则使用默认样式
  const hasCustomClassName = props.className && props.className.includes('!');
  
  return (
    <SmartLink
      href={link}
      locale={locale}
      className={cx(
        hasCustomClassName 
          ? "inline-block rounded-full capitalize font-semibold border-2 border-solid hover:scale-105 transition-all ease duration-200"
          : "inline-block py-2 sm:py-3 px-6 sm:px-10 bg-dark text-light rounded-full capitalize font-semibold border-2 border-solid border-light hover:scale-105 transition-all ease duration-200 text-sm sm:text-base",
        props.className
      )}
    >
      {name}
    </SmartLink>
  );
};

export default Tag;
