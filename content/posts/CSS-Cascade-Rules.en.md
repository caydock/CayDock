---
title: "CSS Cascade Rules"
date: 2015-09-21 17:53:55
draft: false
language: en
translationKey: "css-cascade-rules"
---

Today I accidentally saw a frontend interview question about CSS specificity calculation. CSS cascade rules are related to style rendering and parsing. If you can't master specificity calculation and cascade rules well, you will encounter situations where the written styles don't achieve the expected effects when writing CSS. So today I'll spend some time summarizing CSS specificity and cascade issues.

First, each selector has the concept of specificity. For each selector, the user agent calculates the specificity of the selector and compares based on the level of specificity. The specificity value includes four parts, like 0,0,0,0. The specific calculation rules are as follows:

1. For rules with `!important` added after various elements, the weight is highest.
2. For inline styles of various elements, specificity adds 1,0,0,0 (which is 1000).
3. For given ID attribute values, specificity adds 0,1,0,0 (which is 100).
4. For given class attributes, attribute selectors, or pseudo-classes, specificity adds 0,0,1,0 (which is 10).
5. For given elements and pseudo-elements, specificity adds 0,0,0,1 (which is 1).
6. Combinators and universal selectors contribute no specificity.

After calculating the specificity of various selector rules, we still can't finally determine the page rendering rules. We also need to sort according to cascade rules.

## CSS Specificity Calculation

### 1. **Specificity Values**
```css
/* Specificity: 0,0,0,1 (1) */
div { color: red; }

/* Specificity: 0,0,1,0 (10) */
.class { color: blue; }

/* Specificity: 0,1,0,0 (100) */
#id { color: green; }

/* Specificity: 1,0,0,0 (1000) */
<div style="color: purple;">Inline style</div>

/* Specificity: 1,0,0,0 (1000) */
div { color: orange !important; }
```

### 2. **Complex Selector Specificity**
```css
/* Specificity: 0,0,1,1 (11) */
div.class { color: red; }

/* Specificity: 0,1,0,1 (101) */
div#id { color: blue; }

/* Specificity: 0,0,2,1 (21) */
div.class.another-class { color: green; }

/* Specificity: 0,1,1,1 (111) */
div#id.class { color: purple; }
```

### 3. **Pseudo-class and Pseudo-element Specificity**
```css
/* Specificity: 0,0,1,1 (11) */
div:hover { color: red; }

/* Specificity: 0,0,0,2 (2) */
div::before { content: ""; }

/* Specificity: 0,0,1,2 (12) */
div.class:hover::before { content: ""; }
```

## CSS Cascade Order

### 1. **By Weight (Importance)**
```css
/* Normal declaration */
div { color: red; }

/* Important declaration - wins */
div { color: blue !important; }
```

### 2. **By Source (Origin)**
The weight of selectors is also affected by the source of rules, divided into 5 levels, with weights from large to small:

1. **Reader's important declarations** (user styles with !important)
2. **Author's important declarations** (author styles with !important)
3. **Author's normal declarations** (author styles)
4. **Reader's normal declarations** (user styles)
5. **User agent declarations** (browser default styles)

```css
/* User agent stylesheet */
div { display: block; }

/* Author stylesheet */
div { color: red; }

/* User stylesheet */
div { color: blue; }

/* Author stylesheet with !important */
div { color: green !important; }

/* User stylesheet with !important - wins */
div { color: purple !important; }
```

### 3. **By Specificity**
```css
/* Specificity: 0,0,0,1 (1) */
div { color: red; }

/* Specificity: 0,0,1,0 (10) - wins */
.special { color: blue; }

/* Specificity: 0,1,0,0 (100) - wins */
#unique { color: green; }
```

### 4. **By Order (Source Order)**
When two rules have the same weight, source, and specificity, they are equally strong. Then only the last one wins, as the saying goes "the later wave pushes the earlier wave, one wave is stronger than the other."

```css
/* Both have same specificity: 0,0,1,0 (10) */
.first { color: red; }
.second { color: blue; } /* This wins - comes later */
```

## Practical Examples

### 1. **Basic Specificity**
```css
/* Specificity: 0,0,0,1 */
p { color: red; }

/* Specificity: 0,0,1,0 - wins */
.highlight { color: blue; }

/* Specificity: 0,1,0,0 - wins */
#main { color: green; }
```

### 2. **Complex Selectors**
```css
/* Specificity: 0,0,1,1 (11) */
div.container { color: red; }

/* Specificity: 0,0,2,0 (20) - wins */
.container.special { color: blue; }

/* Specificity: 0,1,1,0 (110) - wins */
#main.container { color: green; }
```

### 3. **Attribute Selectors**
```css
/* Specificity: 0,0,1,0 (10) */
[type="text"] { color: red; }

/* Specificity: 0,0,1,1 (11) - wins */
input[type="text"] { color: blue; }

/* Specificity: 0,0,2,1 (21) - wins */
input[type="text"].special { color: green; }
```

### 4. **Pseudo-classes and Pseudo-elements**
```css
/* Specificity: 0,0,1,1 (11) */
a:hover { color: red; }

/* Specificity: 0,0,2,1 (21) - wins */
a.special:hover { color: blue; }

/* Specificity: 0,0,1,2 (12) */
a::before { content: "→ "; }

/* Specificity: 0,0,2,2 (22) - wins */
a.special::before { content: "★ "; }
```

## Common Pitfalls

### 1. **Overusing !important**
```css
/* Bad: Overuse of !important */
.button { color: red !important; }
.button.primary { color: blue !important; }
.button.primary.large { color: green !important; }

/* Good: Use specificity instead */
.button { color: red; }
.button.primary { color: blue; }
.button.primary.large { color: green; }
```

### 2. **Incorrect Specificity Calculation**
```css
/* These have the same specificity: 0,0,1,0 (10) */
.class1 { color: red; }
.class2 { color: blue; } /* Wins due to source order */

/* To make .class1 win, increase specificity */
.class1.class1 { color: red; } /* Specificity: 0,0,2,0 (20) */
.class2 { color: blue; }
```

### 3. **Inline Styles Override**
```css
/* This won't work - inline styles have higher specificity */
<div style="color: red;">Text</div>

/* This won't work either - inline styles still win */
div { color: blue !important; }

/* Only user !important can override inline styles */
div { color: green !important; } /* In user stylesheet */
```

## Best Practices

### 1. **Use Specificity Wisely**
```css
/* Good: Clear specificity hierarchy */
.button { color: red; }
.button.primary { color: blue; }
.button.primary.large { color: green; }
```

### 2. **Avoid !important When Possible**
```css
/* Bad */
.button { color: red !important; }

/* Good */
.button { color: red; }
.button.important { color: red; }
```

### 3. **Use CSS Custom Properties for Theming**
```css
:root {
  --button-color: red;
  --button-hover-color: darkred;
}

.button {
  color: var(--button-color);
}

.button:hover {
  color: var(--button-hover-color);
}
```

### 4. **Organize CSS by Specificity**
```css
/* Base styles - low specificity */
.button { color: red; }

/* Modifier styles - higher specificity */
.button.primary { color: blue; }
.button.large { font-size: 1.2em; }

/* State styles - highest specificity */
.button.primary.large:hover { color: darkblue; }
```

## Debugging Specificity

### 1. **Browser DevTools**
- Use browser devtools to see which rules are applied
- Check the specificity values
- See which rules are overridden

### 2. **Specificity Calculator**
```css
/* Use online tools to calculate specificity */
div#main.container.special:hover::before
/* Specificity: 0,1,2,2 (122) */
```

### 3. **CSS Linting Tools**
- Use tools like Stylelint to catch specificity issues
- Set rules for maximum specificity
- Warn about !important usage

## Conclusion

CSS cascade rules determine how styles are applied and which styles take precedence:

1. **Specificity Calculation**: Each selector has a specificity value
2. **Cascade Order**: Weight → Source → Specificity → Order
3. **Importance**: `!important` declarations have highest weight
4. **Source Hierarchy**: User important > Author important > Author normal > User normal > User agent
5. **Source Order**: Last rule wins when everything else is equal

Key takeaways:
- **Understand specificity** to write effective CSS
- **Avoid overusing !important** - use specificity instead
- **Organize CSS** by specificity levels
- **Use devtools** to debug cascade issues
- **Plan specificity** when designing component systems

Mastering CSS cascade rules is essential for writing maintainable and predictable stylesheets. It helps avoid common issues like styles not applying as expected and makes debugging much easier.