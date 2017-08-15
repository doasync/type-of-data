
[![NPM Version][npm-image]][npm-url] ![NPM Downloads][downloads-image] [![GitHub issues][issues-image]][issues-url] [![Telegram][telegram-image]][telegram-url]

[npm-image]: https://img.shields.io/npm/v/type-of-data.svg
[npm-url]: https://www.npmjs.com/package/type-of-data
[downloads-image]: https://img.shields.io/npm/dw/type-of-data.svg
[deps-image]: https://david-dm.org/doasync/type-of-data.svg
[issues-image]: https://img.shields.io/github/issues/doasync/type-of-data.svg
[issues-url]: https://github.com/doasync/type-of-data/issues
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/doasync/type-of-data/master/LICENSE
[telegram-image]: http://i.imgur.com/WANXk3d.png
[telegram-url]: https://t.me/doasync

Check data types
======================

You can use these types:
* **'global'** - global object
* **'process'** - NodeJS process
* **null** - null value
* **'null'** - null value
* **Boolean** - primitive booleans and instances of Boolean
* **'boolean'** - primitive booleans only
* **'Boolean'** - instances of Boolean only
* **String** - primitive strings and instances of String
* **'string'** - primitive strings only
* **'String'** - instances of String only
* **Number** - instances of Number only
* **'number'** - primitive numbers only
* **'Number'** - instances of Number only
* **Symbol** - symbols (they are primitives)
* **Object** - any objects which toString tag is Object
* **Function** - any function (AsyncFunction and GeneratorFunction)
* **JSON** - any valid json string
* **Array**
* **RegExp**
* **Date**
* **Promise**
* **Map**
* **WeakMap**
* **Set**
* **WeakSet**
* **Error**
* **Buffer**
* **Buffer**
* **DataView**
* **Float32Array**
* **Uint8Array**
* ...
* Classes and constructors
* [Symbol.toStringTag]
* toString tag

Do not use 'undefined' type, use 'optional' or 'opt' key.

Installation
-------------

```bash
npm i type-of-data
```

Usage
-------------------

```javascript
const typeOf = require('type-of-data');

function fn (selector, regExp, returnAll = true) {
  // Throw a TypeError if type is not correct
  typeOf([
    {selector, is: String},
    {regExp, is: RegExp},
    {returnAll, is: Boolean}
  ]);
  /* Here you can be sure that the types a correct... */
}
```
More examples:
```javascript
// Single definition
typeOf({regExp, is: RegExp});

// Array of definitions
typeOf([
  {str, is: String}, // Any string
  {str, is: 'string'}, // Primitive string only
  {num: 22, is: Number},
  {variable, is: [null, Object, String]}, // Null type
  {param, is: [Object, Array], optional: true}, // Can be undefined
  {x, is: ['string', 'number', Array]} // Primitive types only
]);
```

Tests:

```javascript
describe('typeOf:', () => {
  it('multiple definitions', () => {
    const Noop = function () {};

    const fn = () => typeOf([
      
      {variable: null, is: null},
      {variable: null, is: 'null'},
      {variable: null, is: [Boolean, null]},
      {variable: null, is: ['null', Number, Boolean]},
      
      {variable: undefined, is: [Number, Boolean], optional: true},
      {variable: undefined, is: Object, opt: true},

      {variable: true, is: Boolean},
      {variable: false, is: Boolean},
      {variable: new Boolean([1,2]), is: Boolean},
      {variable: new Boolean(''), is: Boolean},
      {variable: new Boolean(''), is: 'Boolean'},

      {variable: true, is: 'boolean'},
      {variable: false, is: 'boolean'},

      {variable: -1, is: Number},
      {variable: 0, is: Number},
      {variable: -0, is: Number},
      {variable: +0, is: Number},
      {variable: 1, is: Number},
      {variable: +1, is: Number},
      {variable: new Number(1), is: Number},
      {variable: new Number(''), is: Number},
      {variable: new Number(0), is: 'Number'},

      {variable: 0, is: 'number'},
      {variable: 2.456, is: 'number'},
      {variable: -100, is: 'number'},
      {variable: NaN, is: 'number'}, // Is primitive number
      {variable: Infinity, is: 'number'}, // Is primitive number
      {variable: +Infinity, is: 'number'},
      {variable: -Infinity, is: 'number'},

      {variable: '', is: String},
      {variable: 'gsd', is: String},
      {variable: String(''), is: String},
      {variable: new String(1), is: String},
      {variable: new String(false), is: 'String'},

      {variable: String(''), is: 'string'},
      {variable: String('test'), is: 'string'},
      {variable: '', is: 'string'},
      {variable: 'test', is: 'string'},

      {variable: Symbol('fsd'), is: Symbol},
      {variable: Symbol(), is: 'symbol'},
      {variable: Symbol('fsd'), is: 'symbol'},

      {variable: [], is: Array},
      {variable: [1,2,3], is: 'Array'},
      {variable: new Array(10), is: Array},

      {variable: {}, is: Object},
      {variable: {x: 2}, is: 'Object'},
      {variable: new Object({a: 2}), is: Object},
      {variable: new (function Noop () {}), is: Object},
      {variable: new Noop, is: Noop},
      {variable: new Noop, is: 'Object'},
      {variable: new Noop, is: Object},
      {variable: new (function () {}), is: Object},

      {variable: function () {}, is: Function},
      {variable: function named () {}, is: Function},
      {variable: function named () {}, is: 'Function'},
      {variable: () => {}, is: Function},
      {variable: async function () {}, is: Function},
      {variable: async () => {}, is: Function},
      {variable: function* gen () {}, is: Function},

      {variable: new Date(), is: Date},
      {variable: new Date(), is: 'Date'},

      {variable: /\d+/, is: RegExp},
      {variable: new RegExp('\d+'), is: RegExp},
      {variable: new RegExp('\d+'), is: 'RegExp'},

      {variable: new Promise(() => {}), is: Promise},
      {variable: Promise.resolve(), is: Promise},
      {variable: Promise.reject(), is: Promise},
      {variable: Promise.reject(), is: 'Promise'},

      {variable: new Map(), is: Map},
      {variable: new Map(), is: 'Map'},
      {variable: new Set(), is: Set},
      {variable: new Set(), is: 'Set'},
      {variable: new WeakMap(), is: WeakMap},
      {variable: new WeakMap(), is: 'WeakMap'},
      {variable: new WeakSet(), is: WeakSet},
      {variable: new WeakSet(), is: 'WeakSet'}
    ]);

    expect(fn).not.to.throw();
  });
});
```
Throws TypeError:
```javascript
describe('typeOf:', () => {
  it('single definition throws', () => {
    const fns = [
      () => typeOf({variable: new Boolean({}), is: 'boolean'}), // Not primitive
      () => typeOf({variable: false, is: 'Boolean'}), // Not object
      () => typeOf({variable: new String('test'), is: 'string'}),
      () => typeOf({variable: 'test-string', is: 'String'}),
      () => typeOf({variable: new Number(214), is: 'number'}),
      () => typeOf({variable: Infinity, is: Number}), // Not a valid number
      () => typeOf({variable: NaN, is: Number}), // Not a valid number
      () => typeOf({variable: 124214, is: String}), // Not string
      () => typeOf({variable: true, is: [Array, String]}), // Not found
      () => typeOf({variable: undefined, is: [Array, null]}), // Not optional
      () => typeOf({variable: undefined, is: Object}),
      () => typeOf({variable: undefined, is: null})
    ];

    for (const fn of fns) {
      expect(fn).to.throw(TypeError);
    }
  });
});
```

Tip
------------------

You can find more examples in tests.