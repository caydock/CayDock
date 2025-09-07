---
title: "React Event Callback Function bind(this) Analysis"
date: 2018-07-27 18:23:25
draft: false
lang: en
translationKey: "react-event-callback-bind-this"
---

When using React (under ES6 Class syntax), I've always been puzzled by one thing: event binding. For example, event handlers for onClick and onChange must be written like this:

``` html
<button onClick={this.handleClick.bind(this)}>Click</button>
```

Or declared in the constructor function:

``` js
this.handleClick = this.handleClick.bind(this);
```

### Confusion

Why do we need to bind **this** when we're clearly using a function under **this**? It's like saying "I want to use my own phone but I have to declare that this is my phone." Regardless of whether the syntax is correct, I feel the code's readability and aesthetics are not good.

### Analysis

JavaScript is a relatively special language. To talk about this problem, we need to start with scope. First, JavaScript only has static scope, not dynamic scope. Some might say, isn't `this` dynamic? NO, it just seems like it.

As the name suggests, static scope means that the scope is determined by where your code is written, while dynamic scope is determined when the call is executed. That's right, `this` is like that.

The role of `this` is to find the position where the function is called and bound. The position search has rules, and here are four search rules:

#### 1. Default Binding

Default binding, as the name suggests, is the binding rule used when other rules cannot be applied. This rule is also the most commonly used in functions, called **independent function calls**. For example:

``` js
function foo() { 
  console.log( this.a );
}

var a = 2; 

foo(); // 2
```

**foo** is called with a function reference without any modification, so only the default binding rule can be used. At this time, **this** points to the global scope by default, which is **window** (of course, in non-strict mode). In strict mode, it would be **undefined**.

#### 2. Implicit Binding

There's another situation where the function exists in an object and is referenced by the object. For example:

``` js
function foo() { 
  console.log( this.a );
}
var obj = { 
  a: 2,
  foo: foo 
};

obj.foo(); // 2
```

In this case, **this** is bound to obj because the function exists in the object and is called by that object.

Even if the foo function exists inside the object, sometimes its context can't be found. For example:

``` js
function foo() { 
  console.log( this.a );
}
var obj = { 
  a: 2,
  foo: foo 
};
// Assign the foo function to a variable
var bar = obj.foo; 

bar(); // undefined
```

At this time, the function bar is a reference to obj.foo. Strictly speaking, it has nothing to do with the object obj. At this time, the execution of bar can apply the default binding rule, so its context `this` points to window or undefined.

There's another situation where referencing in callback functions can also cause the context to be lost, resulting in `this` binding loss:

``` js
function foo() { 
  console.log( this.a );
}

var a = 'window a';

var obj = { 
  a: 'obj a',
  foo: foo 
};

// obj.foo is passed as a parameter to setTimeout 
setTimeout( obj.foo, 100 ); 
```

At this time, `this` binding is lost and will apply default binding, finding window.

#### 3. Explicit Binding

Explicit binding is through the call(..) and apply(..) methods, forcibly pointing `this` to the incoming object. This method is also called hard binding:

``` js
function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}
var obj = {
    a: 2
};
var bar = function() {
    return foo.apply(obj, arguments);
};
var b = bar(3);

console.log( b ); // 5
```

#### 4. New Binding

`new` is usually used to construct an object with a function, and the `this` pointed to in that function will be bound to this object. Here's an example 🌰:

``` js
function foo(a) {
    this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2
```

When using `new` to call foo(..), we construct a new object bar and bind it to the `this` in the foo(..) call.

`new` is the last method that can affect the `this` binding behavior when a function is called. We call it new binding.

### React Situation

Based on the above, the React situation is easy to understand:

``` html
<button onClick={this.handleClick.bind(this)}>Click</button>
```

**The `this.handleClick` method is executed through callback function parameter passing, and in Class syntax, there is no default binding of the current `this`, so the `this` binding will be lost. In strict mode, `this` is undefined.**

Function.prototype.bind() is the function's built-in context binding method, similar in function to call(..) and apply(..). After bind(this), it creates a new function and binds `this` to the current desired location.

React documentation describes this problem:

**You have to be careful about the meaning of this in JSX callbacks. In JavaScript, class methods are not bound by default. If you forget to bind this.handleClick and pass it to onClick, this will be undefined when the function is actually called.**

### Alternatives

Of course, the `this.handleClick.bind(this)` syntax has other alternative ways of writing, mainly two:

**First**, you can use arrow functions, because arrow functions belong to static scope, so `this` will be directly bound to the current scope:

``` js
<button onClick={(e) => this.handleClick(e)}>
```

**Second**, use [public class fields](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/) syntax, so you don't need to bind `this` every time and can use it directly. Of course, this specification is still in the experimental stage and needs to be compiled and executed through babel.
