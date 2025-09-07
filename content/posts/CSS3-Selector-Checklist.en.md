---
title: "CSS3 Selector Checklist"
date: 2015-08-21T17:53:55+08:00
draft: false
description: "Complete checklist of CSS3 selectors and usage methods to improve development efficiency"
tags: ["CSS", "CSS3", "Selectors", "Frontend"]
categories: ["Frontend Development"]
featured: true
featuredImage: "cover-css.svg"
language: en
translationKey: "css3-selector-checklist"
---

Selectors are a very important part of CSS. Using selectors can improve work efficiency when modifying stylesheets during development and make CSS writing structure clearer and simpler. CSS3 has added some new selectors based on previous versions, so today I'll summarize the features and usage of CSS3 selectors.

## Attribute Selectors

CSS3 added 3 new attribute selectors: **E[foo^="bar"]**, **E[foo$="bar"]**, **E[foo*="bar"]**.

* **E[foo^="bar"]**: Matches E elements that define the foo attribute and have a prefix of "bar"
* **E[foo$="bar"]**: Matches E elements that define the foo attribute and have a suffix of "bar"
* **E[foo*="bar"]**: Matches E elements that define the foo attribute and contain "bar" in the attribute value

> When the "E" is omitted before the attribute selector, it means matching any type of element. These three attribute selectors follow conventional coding rules, using "^", "$", "*" to represent start, end, and any respectively.

## Structural Pseudo-class Selectors

* **E:root** - Matches the root element of the document where E element is located, usually the HTML element
* **E:nth-child(n)** - Matches the E element at the nth position among its parent node's children
* **E:nth-last-child(n)** - Matches the E element at the **last** nth position among its parent node's children (similar to above)
* **E:nth-of-type(n)** - Matches the E element at the nth position of the same type among its parent node's children, other types of elements don't participate in sorting
* **E:nth-last-of-type(n)** - Matches the E element at the **last** nth position of the same type among its parent node's children
* **E:first-child** - Matches the first child element of type E
* **E:last-child** - Matches the last child element of type E
* **E:first-of-type** - Matches the first element of type E among its siblings
* **E:last-of-type** - Matches the last element of type E among its siblings
* **E:only-child** - Matches E elements that are the only child of their parent
* **E:only-of-type** - Matches E elements that are the only element of their type among their siblings
* **E:empty** - Matches E elements that have no children (including text nodes)

## UI State Pseudo-class Selectors

* **E:enabled** - Matches enabled form elements
* **E:disabled** - Matches disabled form elements
* **E:checked** - Matches checked form elements (checkboxes, radio buttons)
* **E:indeterminate** - Matches form elements in an indeterminate state
* **E:valid** - Matches form elements with valid input
* **E:invalid** - Matches form elements with invalid input
* **E:required** - Matches required form elements
* **E:optional** - Matches optional form elements
* **E:in-range** - Matches form elements with values within the specified range
* **E:out-of-range** - Matches form elements with values outside the specified range
* **E:read-only** - Matches read-only form elements
* **E:read-write** - Matches read-write form elements

## Target and Language Pseudo-class Selectors

* **E:target** - Matches the E element that is the target of the current URL fragment
* **E:lang(language)** - Matches E elements with the specified language attribute

## Negation Pseudo-class Selector

* **E:not(selector)** - Matches E elements that do not match the specified selector

## Common Usage Examples

### 1. **Attribute Selectors**
```css
/* Links starting with "https" */
a[href^="https"] {
    color: green;
}

/* Images ending with ".jpg" */
img[src$=".jpg"] {
    border: 2px solid blue;
}

/* Elements with "error" in class */
[class*="error"] {
    background-color: red;
}
```

### 2. **Structural Selectors**
```css
/* First and last children */
li:first-child {
    font-weight: bold;
}

li:last-child {
    border-bottom: none;
}

/* Every 3rd item */
li:nth-child(3n) {
    background-color: #f0f0f0;
}

/* Odd and even items */
tr:nth-child(odd) {
    background-color: #f9f9f9;
}

tr:nth-child(even) {
    background-color: white;
}

/* Empty elements */
div:empty {
    display: none;
}
```

### 3. **UI State Selectors**
```css
/* Form styling */
input:enabled {
    border: 1px solid #ccc;
}

input:disabled {
    background-color: #f5f5f5;
    color: #999;
}

input:checked + label {
    font-weight: bold;
}

input:valid {
    border-color: green;
}

input:invalid {
    border-color: red;
}
```

### 4. **Target and Language Selectors**
```css
/* Highlight target section */
:target {
    background-color: yellow;
}

/* Language-specific styling */
:lang(en) {
    font-family: Arial, sans-serif;
}

:lang(zh) {
    font-family: "Microsoft YaHei", sans-serif;
}
```

### 5. **Negation Selector**
```css
/* All inputs except checkboxes */
input:not([type="checkbox"]) {
    width: 200px;
}

/* All paragraphs except those with class "intro" */
p:not(.intro) {
    margin-bottom: 1em;
}
```

## Advanced Selector Combinations

### 1. **Complex Attribute Selectors**
```css
/* Multiple attribute conditions */
input[type="text"][required] {
    border: 2px solid blue;
}

/* Case-insensitive attribute matching */
a[href*="example" i] {
    color: purple;
}
```

### 2. **Nth-child Variations**
```css
/* Every 2nd item starting from the 3rd */
li:nth-child(2n+3) {
    color: blue;
}

/* Last 3 items */
li:nth-last-child(-n+3) {
    font-weight: bold;
}

/* First 3 items */
li:nth-child(-n+3) {
    border-top: 1px solid #ccc;
}
```

### 3. **Type-specific Selectors**
```css
/* First paragraph in each section */
section p:first-of-type {
    font-size: 1.2em;
}

/* Last image in each article */
article img:last-of-type {
    margin-bottom: 0;
}
```

## Performance Considerations

### 1. **Selector Efficiency**
```css
/* Good: Specific and efficient */
.header .nav li:first-child {
    margin-left: 0;
}

/* Avoid: Too generic */
* {
    box-sizing: border-box;
}

/* Better: More specific */
*, *::before, *::after {
    box-sizing: border-box;
}
```

### 2. **Complex Selectors**
```css
/* Good: Simple and direct */
.button:disabled {
    opacity: 0.5;
}

/* Avoid: Overly complex */
div > ul > li:nth-child(odd) > a:hover {
    color: red;
}

/* Better: Use classes */
.nav-link:hover {
    color: red;
}
```

## Browser Support

### 1. **Well-supported Selectors**
- Basic attribute selectors: `[attr]`, `[attr="value"]`
- Structural selectors: `:first-child`, `:last-child`, `:nth-child()`
- UI state selectors: `:hover`, `:focus`, `:active`

### 2. **Modern Selectors**
- `:nth-last-child()`, `:nth-of-type()`
- `:target`, `:not()`
- `:enabled`, `:disabled`, `:checked`

### 3. **Fallback Strategies**
```css
/* Modern browsers */
input:valid {
    border-color: green;
}

/* Fallback for older browsers */
input.valid {
    border-color: green;
}
```

## Best Practices

### 1. **Use Semantic Selectors**
```css
/* Good: Semantic and clear */
.navigation .current-page {
    font-weight: bold;
}

/* Avoid: Too generic */
div div span {
    font-weight: bold;
}
```

### 2. **Combine Selectors Efficiently**
```css
/* Good: Specific and efficient */
.form-group input:focus {
    outline: 2px solid blue;
}

/* Avoid: Redundant specificity */
.form-group input:focus:focus {
    outline: 2px solid blue;
}
```

### 3. **Use Attribute Selectors for Dynamic Content**
```css
/* Good: Flexible attribute matching */
[data-status="loading"] {
    opacity: 0.5;
}

[data-status="error"] {
    color: red;
}
```

## Conclusion

CSS3 selectors provide powerful tools for styling web pages:

1. **Attribute selectors** for flexible attribute matching
2. **Structural pseudo-classes** for position-based styling
3. **UI state selectors** for interactive element styling
4. **Target and language selectors** for specific use cases
5. **Negation selectors** for exclusion-based styling

Key benefits:
- **Improved efficiency** in CSS development
- **Cleaner and more maintainable** code
- **Better separation** of content and presentation
- **Enhanced user experience** through targeted styling

Remember to:
- Use selectors appropriately for your use case
- Consider browser support for modern selectors
- Maintain good performance with efficient selectors
- Combine selectors logically for maintainable code

These selectors form the foundation of modern CSS development and are essential for creating responsive, interactive, and maintainable web applications.