---
title: "Set vs Map Collection Comparison"
date: 2018-12-15T16:58:09+08:00
draft: false
description: "Detailed comparison and usage scenario analysis of Set and Map collections in JavaScript"
tags: ["JavaScript", "Set", "Map", "data structures"]
categories: ["Frontend Development"]
featured: true
featuredImage: "cover-js.svg"
language: en
translationKey: "set-vs-map-comparison"
---

| Feature Comparison | Set| WeakSet | Map  | WeakMap 
|:-----------: |:-------------:| :---------:|:-----------:| :--------------:|
|Initialization| ```new Set([1,2,3,4])``` | ```new WeakSet([1,2,3,4])```  | ```new Map([["name", "Bright"], ["sex", "男"]])```  | ```new WeakMap([["name", "Bright"], [" sex", "男"]])```
|Definition | An ordered list containing multiple non-duplicate values | A special Set collection that **only supports storing weak references to objects**  | An ordered collection of multiple key-value pairs | A special Map collection that **only supports object-type keys**
|[Iterable](#iterable)| Yes | No  | Yes | No
|Reference Feature | Member objects [strong reference](#strong-reference) | Member objects [weak reference](#weak-reference) | Member objects [strong reference](#strong-reference)  | Member objects [weak reference](#weak-reference)
|Properties & Methods| add() has()  delete() clear() forEach() keys() values() size | add() has() delete() | set()  get()  has()  delete() clear() forEach() keys() values() size | set () get() has() delete()
|Usage Recommendation| [Due to the limitations of object property existence detection](#object-limitations), this collection is more suitable for detecting whether a given value exists in the collection. Based on its non-duplicate value feature, it can be used for array deduplication | Can only store object types and facilitates tracking of referenced objects  | Used for handling key-value pair data, storing data that needs frequent access | Used for handling key-value pair data, keys can only store object types, and facilitates tracking of referenced objects. The main use is to save DOM elements of web pages

-----

#### Iterable
Whether iterable is used to indicate whether the collection supports traversing member properties, including the use of methods such as forEach(), keys(), values(), for...of, etc.

#### Object Limitations
Using if in objects to determine whether a value exists is not rigorous enough. When the property itself doesn't exist and exists with a value of false, the judgment results are the same, which brings problems. There's another method to determine whether a property exists in an object using 'in', but this method will traverse up the inherited prototype properties, also bringing some unknown problems, unless the object inherits from null.

#### Strong Reference
As long as the reference exists, the garbage collection mechanism will not release the memory space of the referenced object.

#### Weak Reference
When the referenced object is set to null, the collection doesn't save the reference, triggering the garbage collection mechanism.
