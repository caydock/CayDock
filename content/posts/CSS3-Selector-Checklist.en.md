---
title: "CSS3 Selector Checklist"
date: 2015-08-21T17:53:55+08:00
draft: false
description: "Complete checklist and usage methods of CSS3 selectors to improve development efficiency"
tags: ["CSS", "CSS3", "selectors", "frontend"]
categories: ["Frontend Development"]
featured: true
featuredImage: "cover-css.svg"
language: en
---

Selectors are a very important part of CSS. Using selectors can improve work efficiency when modifying stylesheets during development and make CSS writing structure clearer and simpler. CSS3 has added some new selectors based on previous versions, so today I'll summarize the features and usage of CSS3 selectors.

### Attribute Selectors
CSS3 has added 3 new attribute selectors: **E[foo^="bar"]**, **E[foo$="bar"]**, **E[foo*="bar"]**.
* E[foo^="bar"]: Matches E elements that define the foo attribute and have "bar" as prefix
* E[foo$="bar"]: Matches E elements that define the foo attribute and have "bar" as suffix
* E[foo*="bar"]: Matches E elements that define the foo attribute and have "bar" in the attribute value

> When the "E" is omitted before the attribute selector, it means matching any type of element. These three attribute selectors follow conventional coding rules, using "^", "$", "*" to represent start, end, and any respectively.

### Structural Pseudo-class Selectors
* E:root matches the root element of the document where E element is located, generally the root element is Html
* E:nth-child(n) matches the E element at the nth position in its parent node (child node).
* E:nth-last-child(n) matches the E element at the **last** nth position in its parent node (similar to the above)
* E:nth-of-type(n) matches the E element of the same type at the nth position in its parent node, other type elements do not participate in sorting
* E:nth-last-of-type(n) matches the E element of the same type at the **last** nth position in its parent node
* E:last-child as the name suggests, matches the last E element in its parent node
* E:first-of-type matches the first E element of the same type in its parent node
* E:last-of-type matches the last E element of the same type in its parent node
* E:only-child matches the E element that is the only element in its parent node
* E:only-of-type matches the E element that is the only element of the same type in its parent node
* E:empty matches E element that contains no child nodes `Note that text is also a node`

> Above, n can be a number starting from 1, or a formula like 2n (matches even numbers), 2n+1 (matches odd numbers), or keywords odd (matches odd numbers), even (matches even numbers)

### UI Pseudo-class Selectors
In CSS3, in addition to structural pseudo-class selectors, there are also UI pseudo-class selectors. The common feature of these selectors is: the specified styles only take effect when in a certain state.
* E:enabled matches all available E elements in the user interface
* E:disabled matches all unavailable E elements in the user interface
* E:checked matches all E elements in selected state in the user interface

### Other Selectors
* E~F sibling selector, matches all F elements after E element, both are at the same level structure.
* E:not(s) negation selector, matches E elements except those that match selector "s", "s" is a simple structural selector.
* E:target matches E elements selected by URL, such as "blog.caydock.com/#element" will match E elements with id="element".
