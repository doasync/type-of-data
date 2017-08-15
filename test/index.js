/* eslint-disable no-unused-expressions */

const {describe, it} = require('mocha');
const {expect, assert} = require('chai');
const type = require('type-detect');

const typeOf = require('../index');

function getTag (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

// Unhandled Promise Rejection
process.on('unhandledRejection', err => err && console.error(err));

/*
  true, false, new Boolean({}), new Boolean(0),
  -1, 0, -0, +0, 1, +1, new Number(1),
  '', 'gsd', new String(1), String(''),
  null, undefined,
  +'fsa', Infinity, -Infinity, +Infinity,
  Symbol('fsd'), Symbol(),
  [], [1,2,3], new Array(10),
  {}, {a: 1}, new Object({a: 2}),
  new (function C () {}),
  function () {}, function named () {}, () => {},
  async function () {}, async () => {},
  function* gen () {},
  new Date(),
  /\d+/, new RegExp('\d'),
  Promise.resolve(0), Promise.reject(),
  new Map(), new Set(), new WeakMap(), new WeakSet()
*/

describe('Constructor names', () => {
  assert(Boolean.name === 'Boolean');
  assert(String.name === 'String');
  assert(Number.name === 'Number');
  assert(Object.name === 'Object');
  assert(Function.name === 'Function');
  assert(Array.name === 'Array');
  assert(RegExp.name === 'RegExp');
  assert(Date.name === 'Date');
  assert(Symbol.name === 'Symbol');
  assert(Map.name === 'Map');
  assert(WeakMap.name === 'WeakMap');
  assert(Set.name === 'Set');
  assert(WeakSet.name === 'WeakSet');
  assert(JSON.name === undefined && JSON[Symbol.toStringTag] === 'JSON');

  assert(Promise.name === 'Promise');
  assert(Int8Array.name === 'Int8Array');
  assert(Uint8Array.name === 'Uint8Array');
  assert(Int16Array.name === 'Int16Array');
  assert(Uint16Array.name === 'Uint16Array');
  assert(Int32Array.name === 'Int32Array');
  assert(Float32Array.name === 'Float32Array');
  assert(Float64Array.name === 'Float64Array');
  assert(ArrayBuffer.name === 'ArrayBuffer');
  assert(ArrayBuffer.name === 'ArrayBuffer');
  assert(ArrayBuffer.name === 'ArrayBuffer');
  assert(ArrayBuffer.name === 'ArrayBuffer');
  assert(ArrayBuffer.name === 'ArrayBuffer');

  const Noop = function () {};
  function Nothing () {}
  const noop = new Noop();
  assert(Noop.name === 'Noop');
  assert(Nothing.name === 'Nothing');
  assert(noop.constructor.name === 'Noop');

  const myObject = {};
  myObject[Symbol.toStringTag] = 'myCustomType';
  assert(type(myObject) === 'myCustomType');

  assert(getTag(async () => {}) === 'AsyncFunction');
  assert(getTag(function* generator () {}) === 'GeneratorFunction');

});

describe('Instanceof', () => {
  assert(!(true instanceof Boolean));
  assert((new Boolean()) instanceof Boolean);

  assert(!('hello world' instanceof String));
  assert((new String('hello')) instanceof String);

  assert(!(1 instanceof Number));
  assert(!(1.234 instanceof Number));
  assert(!(-1 instanceof Number));
  assert(!(-1.234 instanceof Number));
  assert(!(Infinity instanceof Number));
  assert(!(NaN instanceof Number));
  assert((new Number(1)) instanceof Number);

  assert(({}) instanceof Object);
  const Noop = function () {};
  assert((new Noop) instanceof Object);
  assert((new Object({s: 2})) instanceof Object);

  assert((function () {}) instanceof Function);
  assert((async function () {}) instanceof Function);
  assert((async () => {}) instanceof Function);
  assert((() => {}) instanceof Function);
  assert((function named () {}) instanceof Function);
  assert((function* g () {}) instanceof Function);

  assert((new Map() instanceof Map));
  assert((new WeakMap()) instanceof WeakMap);
  assert((new Set()) instanceof Set);
  assert((new WeakSet()) instanceof WeakSet);
  assert((new Promise(function () {}) instanceof Promise));
  assert((new Int8Array()) instanceof Int8Array);
  assert((new Uint8Array()) instanceof Uint8Array);
  assert((new Int16Array()) instanceof Int16Array);
  assert((new Uint16Array()) instanceof Uint16Array);
  assert((new Int32Array()) instanceof Int32Array);
  assert((new Float32Array()) instanceof Float32Array);
  assert((new Float64Array()) instanceof Float64Array);
  assert((new ArrayBuffer()) instanceof ArrayBuffer);
  assert((new DataView(new ArrayBuffer())) instanceof DataView);

  assert(!(Symbol('s') instanceof Symbol));

  // ERRORS:
  // assert(!(([]) instanceof 'Array'));
  // assert((new Array()) instanceof 'Array');
  // assert((/a-z/gi) instanceof 'RegExp');
  // assert((new RegExp('a-z')) instanceof 'RegExp');
  // assert((new Date()) instanceof 'Date');
});

describe('type-detect', () => {
  assert(type(true) === 'boolean');
  assert(type(new Boolean()) === 'Boolean');

  assert(type('hello world') === 'string');
  assert(type(String('hello')) === 'string');
  assert(type(new String('hello')) === 'String');

  assert(type(1) === 'number');
  assert(type(1.234) === 'number');
  assert(type(-1) === 'number');
  assert(type(-1.234) === 'number');
  assert(type(Infinity) === 'number');
  assert(type(NaN) === 'number');
  assert(type(new Number(1)) === 'Number');

  assert(type(undefined) === 'undefined');
  assert(type(null) === 'null');

  assert(type(Symbol()) === 'symbol');

  const Noop = function () {};
  assert(type({}) === 'Object');
  assert(type(Noop) !== 'Object');
  assert(type(new Noop) === 'Object');
  assert(type(new Object) === 'Object');
  assert(type({}) === 'Object');

  assert(type(function () {}) === 'function');

  assert(type([]) === 'Array');
  assert(type(new Array()) === 'Array');

  assert(type(/a-z/gi) === 'RegExp');
  assert(type(new RegExp('a-z')) === 'RegExp');

  assert(type(new Date) === 'Date');

  assert(type(new Map() === 'Map'));
  assert(type(new WeakMap()) === 'WeakMap');
  assert(type(new Set()) === 'Set');
  assert(type(new WeakSet()) === 'WeakSet');
  assert(type(new Promise(function() {}) === 'Promise'));
  assert(type(new Int8Array()) === 'Int8Array');
  assert(type(new Uint8Array()) === 'Uint8Array');
  assert(type(new Int16Array()) === 'Int16Array');
  assert(type(new Uint16Array()) === 'Uint16Array');
  assert(type(new Int32Array()) === 'Int32Array');
  assert(type(new Float32Array()) === 'Float32Array');
  assert(type(new Float64Array()) === 'Float64Array');
  assert(type(new ArrayBuffer()) === 'ArrayBuffer');
  assert(type(new DataView(new ArrayBuffer())) === 'DataView');

  const myObject = {};
  myObject[Symbol.toStringTag] = 'myCustomType';
  assert(type(myObject) === 'myCustomType');
});

describe('type-of-data', () => {
  describe('is', () => {
    describe('Boolean', () => {
      it('boolean primitive true', () => {
        const bool = true;
        const fn = () => typeOf([
          {bool, is: Boolean}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
          .to.be.an('object')
          .that.have.property('bool')
          .that.is.a('boolean')
          .that.is.equal(bool)
          .that.is.equal(true);
      });

      it('boolean primitive false', () => {
        const bool = false;
        const fn = () => typeOf([
          {bool, is: Boolean}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
          .to.be.an('object')
          .that.have.property('bool')
          .that.is.a('boolean')
          .that.is.equal(bool)
          .that.is.equal(false);
      });

      it('Boolean instance', () => {
        const bool = new Boolean({});
        bool.prop = 0;
        bool.prop2 = 'test';
        const fn = () => typeOf([
          {bool, is: Boolean}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
          .to.be.an('object')
          .that.have.property('bool')
          .that.is.a('boolean')
          .that.is.equal(bool)
          .that.is.not.equal(true);

        expect(result.bool == true).to.be.true;
      });

      it('Boolean instance', () => {
        const bool = new Boolean({});
        bool.prop = 0;
        bool.prop2 = 'test';
        const fn = () => typeOf([
          {bool, is: 'Boolean'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.an('object')
        .that.have.property('bool')
        .that.is.a('boolean')
        .that.is.equal(bool)
        .that.is.not.equal(true);

        expect(result.bool == true).to.be.true;
      });

      it('Boolean instance', () => {
        const bool = new Boolean(0);
        bool.prop = 0;
        bool.prop2 = 'test';
        const fn = () => typeOf([
          {bool, is: Boolean}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.an('object')
        .that.have.property('bool')
        .that.is.a('boolean')
        .that.is.equal(bool)
        .that.is.not.equal(false);

        expect(result.bool == false).to.be.true;
      });
    });

    describe('Boolean primitive', () => {
      it('boolean primitive true', () => {
        const bool = true;
        const fn = () => typeOf([
          {bool, is: 'boolean'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.an('object')
        .that.have.property('bool')
        .that.is.a('boolean')
        .that.is.equal(bool)
        .that.is.equal(true);
      });

      it('boolean primitive false', () => {
        const bool = false;
        const fn = () => typeOf([
          {bool, is: 'boolean'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.an('object')
        .that.have.property('bool')
        .that.is.a('boolean')
        .that.is.equal(bool)
        .that.is.equal(false);
      });
    });

    describe('Boolean primitive throws', () => {

      it('Boolean primitive true throw on instance', () => {
        const bool = new Boolean({});
        const fn = () => typeOf([
          {bool, is: 'boolean'}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Boolean primitive false throw on instance', () => {
        const bool = new Boolean(0);
        const fn = () => typeOf([
          {bool, is: 'boolean'}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Boolean primitive throws', () => {
        const types = [
          new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: 'boolean'}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Boolean throws', () => {
      it('boolean primitive true', () => {
        const bool = true;
        const fn = () => typeOf([
          {bool, is: 'Boolean'}
        ]);
        expect(fn).to.throw();
      });

      it('Boolean throws', () => {
        const types = [
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet(),
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Boolean}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('String', () => {
      it('string primitive', () => {
        const str = 'test-string';
        str.prop = 0;
        str.prop2 = 'test';
        const fn = () => typeOf([
          {str, is: String}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
          .to.be.a('object')
          .that.have.property('str')
          .that.is.a('string')
          .that.is.equal(str)
          .that.is.equal('test-string');
      });

      it('string primitive', () => {
        const str = 'test-string';
        str.prop = 0;
        str.prop2 = 'test';
        const fn = () => typeOf([
          {str, is: 'string'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.equal('test-string');
      });

      it('empty string', () => {
        const str = '';
        str.prop = 0;
        str.prop2 = 'dfh';
        const fn = () => typeOf([
          {str, is: String}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
          .to.be.a('object')
          .that.have.property('str')
          .that.is.a('string')
          .that.is.equal(str)
          .that.is.equal('');

        expect(result.str == false).to.be.true;
      });

      it('String constructor', () => {
        const str = new String('\0');
        str.prop = 0;
        str.prop2 = 'dfh';
        const fn = () => typeOf([
          {str, is: String}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.not.equal('\0');

        expect(result.str == '\0').to.be.true;
      });

      it('String factory', () => {
        const str = String('test');
        const fn = () => typeOf([
          {str, is: String}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.equal('test');
      });
    });

    describe('String primitive', () => {
      it('string primitive', () => {
        const str = 'test-string';
        const fn = () => typeOf([
          {str, is: 'string'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.equal('test-string');
      });

      it('empty string', () => {
        const str = '';
        const fn = () => typeOf([
          {str, is: 'string'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.not.equal(new String(''));

        expect(result.str == false).to.be.true;
      });

      it('string function', () => {
        const str = String('123');
        const fn = () => typeOf([
          {str, is: 'string'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.not.equal(new String(''));
      });
    });

    describe('String primitive throws', () => {
      it('String primitive throw on instance', () => {
        const str = new String('test');
        const fn = () => typeOf([
          {str, is: 'string'}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('string primitive', () => {
        const str = 'test-string';
        str.prop = 0;
        str.prop2 = 'test';
        const fn = () => typeOf([
          {str, is: 'String'}
        ]);
        expect(fn).to.throw();
      });

      it('String primitive throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          new String(1), new String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet(),
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: 'string'}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('String throws', () => {
      it('String throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet(),
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: 'string'}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Number', () => {
      it('number primitive', () => {
        const num = 124214;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(124214);
      });

      it('number primitive float', () => {
        const num = 124214.55555;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(124214.55555);
      });

      it('0', () => {
        const num = 0;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(0);
      });

      it('+0', () => {
        const num = +0;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(+0)
        .that.is.equal(0);
      });

      it('-0', () => {
        const num = -0;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(-0)
        .that.is.equal(0);
      });

      it('1', () => {
        const num = 1;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(1);
      });

      it('+1', () => {
        const num = +1;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(+1)
        .that.is.equal(1);
      });

      it('-1', () => {
        const num = -1;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(-1);
      });

      it('Number instance', () => {
        const num = new Number(54);
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
          .to.be.a('object')
          .that.have.property('num')
          .that.is.a('number')
          .that.is.equal(num)
          .that.is.not.equal(54);

        expect(result.num == 54).to.be.true;
      });
    });

    describe('Number primitive', () => {
      it('number primitive', () => {
        const num = 124214;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(124214);
      });

      it('number primitive float', () => {
        const num = 124214.32523;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(124214.32523);
      });

      it('Infinity primitive', () => {
        const num = Infinity;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(Infinity);
      });

      it('NaN primitive', () => {
        const num = +'blabla';
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.NaN
      });

      it('0', () => {
        const num = 0;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(0);
      });

      it('+0', () => {
        const num = +0;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(+0)
        .that.is.equal(0);
      });

      it('-0', () => {
        const num = -0;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(-0)
        .that.is.equal(0);
      });

      it('1', () => {
        const num = 1;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(1);
      });

      it('+1', () => {
        const num = +1;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(+1)
        .that.is.equal(1);
      });

      it('-1', () => {
        const num = -1;
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(-1);
      });
    });

    describe('Number primitive throws', () => {
      it('number primitive throw on instance', () => {
        const num = new Number(214);
        const fn = () => typeOf([
          {num, is: 'number'}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Number primitive throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: 'number'}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Number throws', () => {
      it('number primitive', () => {
        const num = 124214;
        const fn = () => typeOf([
          {num, is: 'Number'}
        ]);
        expect(fn).to.throw();
      });

      it('Infinity primitive not a number', () => {
        const num = Infinity;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Plus Infinity primitive not a number', () => {
        const num = +Infinity;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Minus Infinity primitive not a number', () => {
        const num = -Infinity;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('NaN primitive in not a Number', () => {
        const num = +'blabla';
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('NaN primitive in not a Number', () => {
        const num = NaN;
        const fn = () => typeOf([
          {num, is: Number}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Number throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Number}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Symbol', () => {
      it('Symbol primitive', () => {
        const sym = Symbol('kl');
        const fn = () => typeOf([
          {sym, is: Symbol}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol('kl'));
      });

      it('Symbol primitive', () => {
        const sym = Symbol();
        const fn = () => typeOf([
          {sym, is: Symbol}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol());
      });

      it('Symbol toStringTag', () => {
        const sym = Symbol('kl');
        const fn = () => typeOf([
          {sym, is: 'symbol'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol('kl'));
      });
    });

    describe('Symbol primitive', () => {
      it('Symbol primitive', () => {
        const sym = Symbol('kl');
        const fn = () => typeOf([
          {sym, is: 'symbol'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol('kl'));
      });

      it('Symbol primitive', () => {
        const sym = Symbol();
        const fn = () => typeOf([
          {sym, is: 'symbol'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol());
      });
    });

    describe('Symbol throws', () => {
      it('Symbol throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Symbol}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Symbol primitive throws', () => {
      it('Symbol throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: 'symbol'}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Object', () => {
      it('object', () => {
        const obj = {a: 1};
        const fn = () => typeOf([
          {obj, is: 'Object'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('obj')
        .that.is.a('object')
        .that.is.equal(obj)
        .that.is.deep.equal({a: 1});
      });

      it('object', () => {
        const obj = {a: 1};
        const fn = () => typeOf([
          {obj, is: Object}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('obj')
        .that.is.a('object')
        .that.is.equal(obj)
        .that.is.deep.equal({a: 1});
      });

      it('object instance', () => {
        const obj = new Object({a: 1});
        const fn = () => typeOf([
          {obj, is: Object}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('obj')
        .that.is.a('object')
        .that.is.equal(obj)
        .that.is.deep.equal({a: 1});
      });
    });

    describe('Object throws', () => {
      it('custom name', () => {
        const Noop = function () {}
        const obj = new Noop;
        const fn = () => typeOf([
          {obj, is: 'Noop'}
        ]);
        expect(fn).to.throw();
      });

      it('Object throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Object}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Array', () => {
      it('Array empty', () => {
        const arr = [];
        const fn = () => typeOf([
          {arr, is: 'Array'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('arr')
        .that.is.a('array')
        .that.is.equal(arr)
        .that.is.deep.equal([]);
      });

      it('Array empty', () => {
        const arr = [];
        const fn = () => typeOf([
          {arr, is: Array}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('arr')
        .that.is.a('array')
        .that.is.equal(arr)
        .that.is.deep.equal([]);
      });

      it('Array normal', () => {
        const arr = [-1, 2, 3, null, undefined];
        const fn = () => typeOf([
          {arr, is: Array}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('arr')
        .that.is.a('array')
        .that.is.equal(arr)
        .that.is.deep.equal([-1, 2, 3, null, undefined]);
      });

      it('Array created with length', () => {
        const arr = new Array(3);
        const fn = () => typeOf([
          {arr, is: Array}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('arr')
        .that.is.a('array')
        .that.is.equal(arr)
        .that.is.deep.equal([undefined, undefined, undefined]);
      });

      it('Array created with items', () => {
        const arr = new Array(3, 4, 5);
        const fn = () => typeOf([
          {arr, is: Array}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('arr')
        .that.is.a('array')
        .that.is.equal(arr)
        .that.is.deep.equal([3, 4, 5]);
      });
    });

    describe('Array throws', () => {
      it('Array throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Array}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Function', () => {
      it('Normal function', () => {
        const func = function () {};
        const fn = () => typeOf([
          {func, is: 'Function'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('func')
        .that.is.a('function')
        .that.is.equal(func);
      });

      it('Normal function', () => {
        const func = function () {};
        const fn = () => typeOf([
          {func, is: Function}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('func')
        .that.is.a('function')
        .that.is.equal(func);
      });

      it('Arrow function', () => {
        const func = () => {};
        const fn = () => typeOf([
          {func, is: Function}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('func')
        .that.is.a('function')
        .that.is.equal(func);
      });

      it('Normal async function', () => {
        const func = async function () {};
        const fn = () => typeOf([
          {func, is: Function}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('func')
        .that.is.a('function')
        .that.is.equal(func);
      });

      it('Arrow async function', () => {
        const func = async () => {};
        const fn = () => typeOf([
          {func, is: Function}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('func')
        .that.is.a('function')
        .that.is.equal(func);
      });

      it('Generator function', () => {
        const func = function* generator () {};
        const fn = () => typeOf([
          {func, is: Function}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('func')
        .that.is.a('function')
        .that.is.equal(func);
      });
    });

    describe('Function throws', () => {
      it('Function name in not a type', () => {
        function namedFn () {}
        const func = namedFn;
        const fn = () => typeOf([
          {func, is: namedFn}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Function throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Function}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('RegExp', () => {
      it('Regexp normal', () => {
        const reg = /\d+/;
        const fn = () => typeOf([
          {reg, is: RegExp}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('reg')
        .that.is.a('RegExp');
      });

      it('Regexp normal', () => {
        const reg = /\d+/;
        const fn = () => typeOf([
          {reg, is: 'RegExp'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('reg')
        .that.is.a('RegExp');
      });

      it('Regexp constructed', () => {
        const reg = new RegExp('\d+');
        const fn = () => typeOf([
          {reg, is: RegExp}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('reg')
        .that.is.a('RegExp');
      });
    });

    describe('RegExp throws', () => {
      it('RegExp throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: RegExp}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Date', () => {
      it('Date', () => {
        const date = new Date();
        const fn = () => typeOf([
          {date, is: 'Date'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('date')
        .that.is.a('Date');
      });

      it('Date', () => {
        const date = new Date();
        const fn = () => typeOf([
          {date, is: Date}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('date')
        .that.is.a('Date');
      });
    });

    describe('Date throws', () => {
      it('Date throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Date}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Promise', () => {
      it('Promise', () => {
        const promise = Promise.resolve();
        const fn = () => typeOf([
          {promise, is: 'Promise'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('promise')
        .that.is.a('Promise');
      });

      it('Promise', () => {
        const promise = Promise.resolve();
        const fn = () => typeOf([
          {promise, is: Promise}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('promise')
        .that.is.a('Promise');
      });
    });

    describe('Promise throws', () => {
      it('Promise throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Promise}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Map', () => {
      it('Empty Map', () => {
        const map = new Map();
        const fn = () => typeOf([
          {map, is: 'Map'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('map')
        .that.is.a('Map');
      });

      it('Empty Map', () => {
        const map = new Map();
        const fn = () => typeOf([
          {map, is: Map}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('map')
        .that.is.a('Map');
      });

      it('Populated Map', () => {
        const map = new Map([
          [1, 'val'],
          ['x', 2]
        ]);
        const fn = () => typeOf([
          {map, is: Map}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('map')
        .that.is.a('Map');

        expect(result.map.get('x') === 2).to.be.true;
      });
    });

    describe('Map throws', () => {
      it('Map throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Map}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('WeakMap', () => {
      it('Empty WeakMap', () => {
        const map = new WeakMap();
        const fn = () => typeOf([
          {map, is: 'WeakMap'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('map')
        .that.is.a('WeakMap');
      });

      it('Empty WeakMap', () => {
        const map = new WeakMap();
        const fn = () => typeOf([
          {map, is: WeakMap}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('map')
        .that.is.a('WeakMap');
      });

      it('Populated WeakMap', () => {
        const obj = {};
        const map = new WeakMap([
          [{}, 'val'],
          [obj, 2]
        ]);
        const fn = () => typeOf([
          {map, is: WeakMap}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('map')
        .that.is.a('WeakMap');

        expect(result.map.get(obj) === 2).to.be.true;
      });
    });

    describe('WeakMap throws', () => {
      it('WeakMap throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: WeakMap}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Set', () => {
      it('Empty Set', () => {
        const set = new Set();
        const fn = () => typeOf([
          {set, is: 'Set'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('set')
        .that.is.a('Set');
      });

      it('Empty Set', () => {
        const set = new Set();
        const fn = () => typeOf([
          {set, is: Set}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('set')
        .that.is.a('Set');
      });

      it('Populated Set', () => {
        const set = new Set([1, 2, 3]);
        const fn = () => typeOf([
          {set, is: Set}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('set')
        .that.is.a('Set');
      });
    });

    describe('Set throws', () => {
      it('Set throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Set}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('WeakSet', () => {
      it('Empty WeakSet', () => {
        const weakSet = new WeakSet();
        const fn = () => typeOf([
          {weakSet, is: 'WeakSet'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('weakSet')
        .that.is.a('WeakSet');
      });

      it('Empty WeakSet', () => {
        const weakSet = new WeakSet();
        const fn = () => typeOf([
          {weakSet, is: WeakSet}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('weakSet')
        .that.is.a('WeakSet');
      });

      it('Populated WeakSet', () => {
        const weakSet = new WeakSet([{}, {}, {}]);
        const fn = () => typeOf([
          {weakSet, is: WeakSet}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('weakSet')
        .that.is.a('WeakSet');
      });
    });

    describe('WeakSet throws', () => {
      it('WeakSet throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: WeakSet}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Class', () => {
      it('Simple class instance', () => {
        class Noop {
          constructor () {
            this.name = 'noop';
          }
        }
        const noop = new Noop();
        const fn = () => typeOf([
          {noop, is: Noop}
        ]);

        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('noop')
        .that.is.an('Object');
      });

      it('Simple class instance', () => {
        class Noop {
          constructor () {
            this.name = 'noop';
          }
        }
        const noop = new Noop();
        const fn = () => typeOf([
          {noop, is: 'Object'}
        ]);

        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('noop')
        .that.is.an('Object');
      });

      it('Simple class instance is Object', () => {
        class Noop {
          constructor () {
            this.name = 'noop';
          }
        }
        const noop = new Noop();
        const fn = () => typeOf([
          {noop, is: Object}
        ]);

        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('noop')
        .that.is.an('Object');
      });

      it('Constructor name changed', () => {
        class Noop {
          constructor () {
            this.name = 'noop';
          }
        }
        Noop.name = 'Noopy';
        const noop = new Noop();
        const fn = () => typeOf([
          {noop, is: Noop}
        ]);

        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('noop')
        .that.is.an('Object');
      });

      it('Child class instance', () => {
        class Noop {
          constructor () {
            this.name = 'noop';
          }
        }

        class Noopy extends Noop {
          method () {}
        }

        const noop = new Noopy();
        const fn = () => typeOf([
          {noop, is: Noopy}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('noop')
        .that.is.an('Object');
      });
    });

    describe('Class throws', () => {
      it('Constructor string', () => {
        class Noop {
          constructor () {
            this.name = 'noop';
          }
        }
        const noop = new Noop();
        const fn = () => typeOf([
          {noop, is: 'Noop'}
        ]);

        expect(fn).to.throw(TypeError);
      });

      it('Constructor name changed', () => {
        class Noop {
          constructor () {
            this.name = 'noop';
          }
        }
        Noop.name = 'Noopy';
        const noop = new Noop();
        const fn = () => typeOf([
          {noop, is: 'Noopy'}
        ]);

        expect(fn).to.throw(TypeError);
      });

      it('Child is not Parent', () => {
        class Noop {
          constructor () {
            this.name = 'noop';
          }
        }

        class Noopy extends Noop {
          method () {}
        }

        const noop = new Noopy();
        const fn = () => typeOf([
          {noop, is: Noop}
        ]);
        expect(fn).to.throw(TypeError);
      });
    });

    describe('Other types', () => {
      it('ArrayBuffer', () => {
        const arrBuf = new ArrayBuffer();
        const fn = () => typeOf([
          {arrBuf, is: ArrayBuffer}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('arrBuf')
        .that.is.a('ArrayBuffer');
      });

      it('DataView', () => {
        const arrBuf = new ArrayBuffer(2);
        const dataView = new DataView(arrBuf);
        const fn = () => typeOf([
          {dataView, is: DataView}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('dataView')
        .that.is.a('DataView');
      });

      it('Error', () => {
        try {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error();
        } catch (err) {
          const fn = () => typeOf([
            {err, is: Error}
          ]);
          expect(fn).not.to.throw();
          const result = fn();
          expect(result)
          .to.be.a('object')
          .that.have.property('err')
          .that.is.a('Error');
        }
      });

      it('Generator', () => {
        function * generator () {
          yield true;
        }
        const gen = generator();
        const fn = () => typeOf([
          {gen, is: 'Generator'}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('gen')
        .that.is.a('Generator');
      });

      it('Int8Array', () => {
        const int8 = new Int8Array();
        const fn = () => typeOf([
          {int8, is: Int8Array}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('int8')
        .that.is.a('Int8Array');
      });
    });

    describe('ArrayBuffer throws', () => {
      it('ArrayBuffer throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        let fns;

        fns = types.map(type => () => typeOf([
          {type, is: ArrayBuffer}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('JSON', () => {
      it('JSON array', () => {
        const json = '[1, 2, "3", true, false, null, "string"]';
        const fn = () => typeOf([
          {json, is: JSON}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('json')
        .that.is.a('string');
      });

      it('JSON object', () => {
        const json = '{"a": 1, "b": 2, "c": "3", "d": true, "e": false, "f": null, "g": "string"}';
        const fn = () => typeOf([
          {json, is: JSON}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('json')
        .that.is.a('string');
      });

      it('JSON array from String()', () => {
        const json = String('[1, 2, "3", true, false, null, "string"]');
        const fn = () => typeOf([
          {json, is: JSON}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('json')
        .that.is.a('String');
      });

      it('JSON object from new String()', () => {
        const json = new String('{"a": 1, "b": 2, "c": "3", "d": true, "e": false, "f": null, "g": "string"}');
        const fn = () => typeOf([
          {json, is: JSON}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('json')
        .that.is.a('String');
      });
    });

    describe('JSON throws', () => {
      it('JSON string type throws', () => {
        const json = '[]';
        const fn = () => typeOf([
          {json, is: 'JSON'}
        ]);
        expect(fn).to.throw();
      });

      it('JSON throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(546), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet(),
          '0', '-1', 'true', 'false', 'null',
          new String(''), new String(0), new String(1),
          new String(true), new String(false),new String(null)
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: JSON}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('multiple definitions', () => {
      it('multiple', () => {
        const Noop = function () {};

        const fn = () => typeOf([
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
          {variable: NaN, is: 'number'},
          {variable: Infinity, is: 'number'},
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

    describe('multiple definitions', () => {
      it('throws', () => {
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
          {variable: NaN, is: 'number'},
          {variable: Infinity, is: 'number'},
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

    describe('single definitions (no array)', () => {
      it('single', () => {
        const Noop = function () {};

        const fns = [
          () => typeOf({variable: true, is: Boolean}),
          () => typeOf({variable: false, is: Boolean}),
          () => typeOf({variable: new Boolean([1,2]), is: Boolean}),
          () => typeOf({variable: new Boolean(''), is: Boolean}),

          () => typeOf({variable: true, is: 'boolean'}),
          () => typeOf({variable: false, is: 'boolean'}),

          () => typeOf({variable: -1, is: Number}),
          () => typeOf({variable: 0, is: Number}),
          () => typeOf({variable: -0, is: Number}),
          () => typeOf({variable: +0, is: Number}),
          () => typeOf({variable: 1, is: Number}),
          () => typeOf({variable: +1, is: Number}),
          () => typeOf({variable: new Number(1), is: Number}),
          () => typeOf({variable: new Number(''), is: Number}),

          () => typeOf({variable: 0, is: 'number'}),
          () => typeOf({variable: 2.456, is: 'number'}),
          () => typeOf({variable: -100, is: 'number'}),
          () => typeOf({variable: NaN, is: 'number'}),
          () => typeOf({variable: Infinity, is: 'number'}),
          () => typeOf({variable: +Infinity, is: 'number'}),
          () => typeOf({variable: -Infinity, is: 'number'}),

          () => typeOf({variable: '', is: String}),
          () => typeOf({variable: 'gsd', is: String}),
          () => typeOf({variable: new String(1), is: String}),
          () => typeOf({variable: String(''), is: String}),

          () => typeOf({variable: String(''), is: 'string'}),
          () => typeOf({variable: String('test'), is: 'string'}),
          () => typeOf({variable: '', is: 'string'}),
          () => typeOf({variable: 'test', is: 'string'}),

          () => typeOf({variable: Symbol('fsd'), is: Symbol}),
          () => typeOf({variable: Symbol(), is: 'symbol'}),
          () => typeOf({variable: Symbol('fsd'), is: 'symbol'}),

          () => typeOf({variable: [], is: Array}),
          () => typeOf({variable: [1,2,3], is: 'Array'}),
          () => typeOf({variable: new Array(10), is: Array}),

          () => typeOf({variable: {}, is: Object}),
          () => typeOf({variable: {x: 2}, is: 'Object'}),
          () => typeOf({variable: new Object({a: 2}), is: Object}),
          () => typeOf({variable: new (function Noop () {}), is: Object}),
          () => typeOf({variable: new Noop, is: Noop}),
          () => typeOf({variable: new Noop, is: 'Object'}),
          () => typeOf({variable: new Noop, is: Object}),
          () => typeOf({variable: new (function () {}), is: Object}),

          () => typeOf({variable: function () {}, is: Function}),
          () => typeOf({variable: function named () {}, is: Function}),
          () => typeOf({variable: function named () {}, is: 'Function'}),
          () => typeOf({variable: () => {}, is: Function}),
          () => typeOf({variable: async function () {}, is: Function}),
          () => typeOf({variable: async () => {}, is: Function}),
          () => typeOf({variable: function* gen () {}, is: Function}),

          () => typeOf({variable: new Date(), is: Date}),
          () => typeOf({variable: new Date(), is: 'Date'}),

          () => typeOf({variable: /\d+/, is: RegExp}),
          () => typeOf({variable: new RegExp('\d+'), is: RegExp}),
          () => typeOf({variable: new RegExp('\d+'), is: 'RegExp'}),

          () => typeOf({variable: new Promise(() => {}), is: Promise}),
          () => typeOf({variable: Promise.resolve(), is: Promise}),
          () => typeOf({variable: Promise.reject(), is: Promise}),
          () => typeOf({variable: Promise.reject(), is: 'Promise'}),

          () => typeOf({variable: new Map(), is: Map}),
          () => typeOf({variable: new Map(), is: 'Map'}),
          () => typeOf({variable: new Set(), is: Set}),
          () => typeOf({variable: new Set(), is: 'Set'}),
          () => typeOf({variable: new WeakMap(), is: WeakMap}),
          () => typeOf({variable: new WeakMap(), is: 'WeakMap'}),
          () => typeOf({variable: new WeakSet(), is: WeakSet}),
          () => typeOf({variable: new WeakSet(), is: 'WeakSet'})
        ];

        for (const fn of fns) {
          expect(fn).not.to.throw();
        }
      });

      it('single throws', () => {
        const Noop = function () {};

        const fns = [
          () => typeOf({variable: 1, is: Boolean}),
          () => typeOf({variable: 1, is: Boolean}),
          () => typeOf({variable: 1, is: Boolean}),
          () => typeOf({variable: 1, is: Boolean}),

          () => typeOf({variable: 1, is: 'boolean'}),
          () => typeOf({variable: 1, is: 'boolean'}),

          () => typeOf({variable: 'str', is: Number}),
          () => typeOf({variable: 'str', is: Number}),
          () => typeOf({variable: 'str', is: Number}),
          () => typeOf({variable: 'str', is: Number}),
          () => typeOf({variable: 'str', is: Number}),
          () => typeOf({variable: 'str', is: Number}),
          () => typeOf({variable: 'str', is: Number}),
          () => typeOf({variable: 'str', is: Number}),

          () => typeOf({variable: 'str', is: 'number'}),
          () => typeOf({variable: 'str', is: 'number'}),
          () => typeOf({variable: 'str', is: 'number'}),
          () => typeOf({variable: 'str', is: 'number'}),
          () => typeOf({variable: 'str', is: 'number'}),
          () => typeOf({variable: 'str', is: 'number'}),
          () => typeOf({variable: 'str', is: 'number'}),

          () => typeOf({variable: 1, is: String}),
          () => typeOf({variable: 1, is: String}),
          () => typeOf({variable: 1, is: String}),
          () => typeOf({variable: 1, is: String}),

          () => typeOf({variable: 1, is: 'string'}),
          () => typeOf({variable: 1, is: 'string'}),
          () => typeOf({variable: 1, is: 'string'}),
          () => typeOf({variable: 1, is: 'string'}),

          () => typeOf({variable: 1, is: Symbol}),
          () => typeOf({variable: 1, is: 'symbol'}),
          () => typeOf({variable: 1, is: 'symbol'}),

          () => typeOf({variable: 1, is: Array}),
          () => typeOf({variable: 1, is: 'Array'}),
          () => typeOf({variable: 1, is: Array}),

          () => typeOf({variable: 1, is: Object}),
          () => typeOf({variable: 1, is: 'Object'}),
          () => typeOf({variable: 1, is: Object}),
          () => typeOf({variable: 1, is: Object}),
          () => typeOf({variable: 1, is: Noop}),
          () => typeOf({variable: 1, is: 'Object'}),
          () => typeOf({variable: 1, is: Object}),
          () => typeOf({variable: 1, is: Object}),

          () => typeOf({variable: 1, is: Function}),
          () => typeOf({variable: 1, is: Function}),
          () => typeOf({variable: 1, is: 'Function'}),
          () => typeOf({variable: 1, is: Function}),
          () => typeOf({variable: 1, is: Function}),
          () => typeOf({variable: 1, is: Function}),
          () => typeOf({variable: 1, is: Function}),

          () => typeOf({variable: 1, is: Date}),
          () => typeOf({variable: 1, is: 'Date'}),

          () => typeOf({variable: 1, is: RegExp}),
          () => typeOf({variable: 1, is: RegExp}),
          () => typeOf({variable: 1, is: 'RegExp'}),

          () => typeOf({variable: 1, is: Promise}),
          () => typeOf({variable: 1, is: Promise}),
          () => typeOf({variable: 1, is: Promise}),
          () => typeOf({variable: 1, is: 'Promise'}),

          () => typeOf({variable: 1, is: Map}),
          () => typeOf({variable: 1, is: 'Map'}),
          () => typeOf({variable: 1, is: Set}),
          () => typeOf({variable: 1, is: 'Set'}),
          () => typeOf({variable: 1, is: WeakMap}),
          () => typeOf({variable: 1, is: 'WeakMap'}),
          () => typeOf({variable: 1, is: WeakSet}),
          () => typeOf({variable: 1, is: 'WeakSet'})
        ];

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });

      describe('single', () => {
        it('throws', () => {
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
    });

    describe('null type', () => {
      it('null', () => {
        const fns = [
          () => typeOf({variable: null, is: null}),
          () => typeOf({variable: null, is: 'null'}),
          () => typeOf({variable: null, is: [Boolean, null]}),
          () => typeOf({variable: null, is: [Boolean, 'null']}),
          () => typeOf({variable: null, is: [Number, Boolean, null]}),
          () => typeOf({variable: null, is: [null, Number, Boolean]}),
          () => typeOf({variable: null, is: ['null', Number, Boolean]})
        ];

        for (const fn of fns) {
          expect(fn).not.to.throw();
          const result = fn();
          expect(result)
            .to.be.a('object')
            .that.have.property('variable')
            .that.is.null;
        }
      });

      it('not null', () => {
        const fns = [
          () => typeOf({variable: true, is: [Boolean, null]}),
          () => typeOf({variable: false, is: [Boolean, null]}),
          () => typeOf({variable: 'null', is: [String, null]}),
          () => typeOf({variable: 0, is: [Number, Boolean, null]}),
          () => typeOf({variable: 1, is: [Number, Boolean, null]}),
          () => typeOf({variable: NaN, is: ['number', null]}),
          () => typeOf({variable: Infinity, is: ['number', null]}),
          () => typeOf({variable: '', is: [String, null]}),
          () => typeOf({variable: 'gsd', is: [null, String]}),
          () => typeOf({variable: Symbol('fsd'), is: [null, Symbol]}),
          () => typeOf({variable: [null], is: [Array, null]}),
          () => typeOf({variable: {0: null}, is: [Object, null]}),
          () => typeOf({variable: /\d+/, is: [null, String, RegExp]}),
          () => typeOf({variable: new Promise(() => {}), is: [Promise, null]}),
          () => typeOf({variable: true, is: [Boolean, 'null']}),
          () => typeOf({variable: false, is: [Boolean, 'null']}),
          () => typeOf({variable: 'null', is: [String, 'null']}),
          () => typeOf({variable: 0, is: [Number, Boolean, 'null']}),
          () => typeOf({variable: 1, is: [Number, Boolean, 'null']}),
          () => typeOf({variable: NaN, is: ['number', 'null']}),
          () => typeOf({variable: Infinity, is: ['number', 'null']}),
          () => typeOf({variable: '', is: [String, 'null']}),
          () => typeOf({variable: 'gsd', is: ['null', String]}),
          () => typeOf({variable: Symbol('fsd'), is: ['null', Symbol]}),
          () => typeOf({variable: [null], is: [Array, 'null']}),
          () => typeOf({variable: {0: null}, is: [Object, 'null']}),
          () => typeOf({variable: /\d+/, is: ['null', String, RegExp]}),
          () => typeOf({variable: new Promise(() => {}), is: [Promise, 'null']})
        ];

        for (const fn of fns) {
          expect(fn).not.to.throw();
          const result = fn();
          expect(result)
            .to.be.a('object')
            .that.have.property('variable')
            .that.is.not.null;
        }
      });

      it('null throws', () => {
        const fns = [
          () => typeOf({variable: null, is: Boolean}),
          () => typeOf({variable: null, is: [Boolean, String]}),
          () => typeOf({variable: null, is: ['boolean', String]}),
          () => typeOf({variable: null, is: ['boolean', String]}),
          () => typeOf({variable: null, is: ['boolean', String, 'undefined']})
        ];

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('undefined type is ignored at the end', () => {
      it('not undefined', () => {
        const fns = [
          () => typeOf({variable: true, is: [Boolean, undefined]}),
          () => typeOf({variable: false, is: [Boolean, undefined]}),
          () => typeOf({variable: 'null', is: [String, undefined]}),
          () => typeOf({variable: 0, is: [Number, Boolean, undefined]}),
          () => typeOf({variable: 1, is: [Number, Boolean, undefined]}),
          () => typeOf({variable: NaN, is: ['number', undefined]}),
          () => typeOf({variable: Infinity, is: ['number', undefined]}),
          () => typeOf({variable: '', is: [String, undefined]}),
          () => typeOf({variable: 'gsd', is: [String, undefined]}),
          () => typeOf({variable: Symbol('fsd'), is: [Symbol, undefined]}),
          () => typeOf({variable: [null], is: [Array, undefined]}),
          () => typeOf({variable: {0: null}, is: [Object, undefined]}),
          () => typeOf({variable: /\d+/, is: [String, RegExp, undefined]}),
          () => typeOf({variable: new Promise(() => {}), is: [Promise, undefined]}),
          () => typeOf({variable: true, is: [Boolean, 'undefined']}),
          () => typeOf({variable: false, is: [Boolean, 'undefined']}),
          () => typeOf({variable: 'null', is: [String, 'undefined']}),
          () => typeOf({variable: 0, is: [Number, Boolean, 'undefined']}),
          () => typeOf({variable: 1, is: [Number, Boolean, 'undefined']}),
          () => typeOf({variable: NaN, is: ['number', 'undefined']}),
          () => typeOf({variable: Infinity, is: ['number', 'undefined']}),
          () => typeOf({variable: '', is: [String, 'undefined']}),
          () => typeOf({variable: 'gsd', is: ['undefined', String]}),
          () => typeOf({variable: Symbol('fsd'), is: ['undefined', Symbol]}),
          () => typeOf({variable: [null], is: [Array, 'undefined']}),
          () => typeOf({variable: {0: null}, is: [Object, 'undefined']}),
          () => typeOf({variable: /\d+/, is: ['undefined', String, RegExp]}),
          () => typeOf({variable: new Promise(() => {}), is: [Promise, 'undefined']})
        ];

        for (const fn of fns) {
          expect(fn).not.to.throw();
          const result = fn();
          expect(result)
          .to.be.a('object')
          .that.have.property('variable')
            .that.is.not.undefined;
        }
      });

      it('undefined throws TypeError if not optional', () => {
        const fns = [
          () => typeOf({variable: undefined, is: undefined}),
          () => typeOf({variable: undefined, is: Boolean}),
          () => typeOf({variable: undefined, is: [Boolean, String]}),
          () => typeOf({variable: undefined, is: ['boolean', String]}),
          () => typeOf({variable: undefined, is: [null, 'boolean', String]}),
          () => typeOf({variable: undefined, is: ['boolean', String, 'null']}),
          () => typeOf({variable: undefined, is: 'undefined'}),
          () => typeOf({variable: undefined, is: [Boolean, undefined]}),
          () => typeOf({variable: undefined, is: [null, Boolean, 'undefined']}),
          () => typeOf({variable: undefined, is: [Number, null, Boolean, undefined]}),
          () => typeOf({variable: undefined, is: [Number, Boolean]}),
          () => typeOf({variable: undefined, is: ['undefined', null, Number, Boolean]})
        ];

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });

      it('undefined throws Error on type undefined', () => {
        const fns = [
          () => typeOf({variable: 'str', is: undefined}),
          () => typeOf({variable: 'str', is: [undefined, String]}),
          () => typeOf({variable: 'str', is: ['boolean', undefined, String]})
        ];

        for (const fn of fns) {
          expect(fn).to.throw(Error);
        }
      });
    });
  });

  describe('opt', () => {
    describe('opt/optional', () => {
      it('opt undefined', () => {
        const num = undefined;
        const fn = () => typeOf([
          {num, is: Number, opt: true}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.undefined;
      });

      it('opt undefined', () => {
        const num = undefined;
        const fn = () => typeOf([
          {num, is: [Number, Date, String], opt: true}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
          .that.is.undefined;
      });

      it('opt undefined', () => {
        const str = {};
        const fn = () => typeOf([
          {str: str.none, is: String, opt: true}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.undefined;
      });

      it('optional undefined', () => {
        const bool = undefined;
        const fn = () => typeOf([
          {bool, is: Boolean, optional: true}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('bool')
        .that.is.undefined;
      });

      it('optional undefined', () => {
        const str = undefined;
        const fn = () => typeOf([
          {str, is: String, optional: true}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.undefined;
      });
    });

    describe('opt throws', () => {
      it('no optional undefined', () => {
        const str = undefined;
        const fn = () => typeOf([
          {str, is: String}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt undefined', () => {
        const num = undefined;
        const fn = () => typeOf([
          {num, is: [Number, Date, String]}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('no optional undefined', () => {
        const str = null;
        const fn = () => typeOf([
          {str, is: String}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt null', () => {
        const str = null;
        const fn = () => typeOf([
          {str, is: String, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt 0', () => {
        const bool = 0;
        const fn = () => typeOf([
          {bool, is: Boolean, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt empty string', () => {
        const bool = '';
        const fn = () => typeOf([
          {bool, is: Boolean, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt false', () => {
        const date = false;
        const fn = () => typeOf([
          {date, is: Date, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt NaN', () => {
        const num = NaN;
        const fn = () => typeOf([
          {num, is: Number, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt -Infinity', () => {
        const str = -Infinity;
        const fn = () => typeOf([
          {str, is: String, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt "0"', () => {
        const obj = '0';
        const fn = () => typeOf([
          {obj, is: Object, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt []', () => {
        const str = [];
        const fn = () => typeOf([
          {str, is: String, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt [0]', () => {
        const str = [0];
        const fn = () => typeOf([
          {str, is: String, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt [[]]', () => {
        const str = [[]];
        const fn = () => typeOf([
          {str, is: String, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt (0).toExponential()', () => {
        const str = (0).toExponential();
        const fn = () => typeOf([
          {str, is: RegExp, opt: true}
        ]);
        expect(fn).to.throw(TypeError);
      });
    });

    describe('optional throws', () => {
      it('opt null', () => {
        const str = null;
        const fn = () => typeOf([
          {str, is: String, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt 0', () => {
        const bool = 0;
        const fn = () => typeOf([
          {bool, is: Boolean, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt empty string', () => {
        const bool = '';
        const fn = () => typeOf([
          {bool, is: Boolean, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt false', () => {
        const date = false;
        const fn = () => typeOf([
          {date, is: Date, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt NaN', () => {
        const num = NaN;
        const fn = () => typeOf([
          {num, is: Number, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt -Infinity', () => {
        const str = -Infinity;
        const fn = () => typeOf([
          {str, is: String, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt "0"', () => {
        const str = '0';
        const fn = () => typeOf([
          {str, is: Number, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt []', () => {
        const str = [];
        const fn = () => typeOf([
          {str, is: String, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt [0]', () => {
        const str = [0];
        const fn = () => typeOf([
          {str, is: String, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt [[]]', () => {
        const str = [[]];
        const fn = () => typeOf([
          {str, is: String, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('opt (0).toExponential()', () => {
        const str = (0).toExponential();
        const fn = () => typeOf([
          {str, is: Boolean, optional: true}
        ]);
        expect(fn).to.throw(TypeError);
      });
    });
  });

  describe('array', () => {
    describe('one element throws', () => {
      it('boolean primitive true', () => {
        const bool = true;
        const fn = () => typeOf([
          {bool, is: [Boolean]}
        ]);
        expect(fn).to.throw(Error);
      });

      it('two elements ok', () => {
        const bool = new Boolean({});
        bool.prop = 0;
        bool.prop2 = 'test';
        const fn = () => typeOf([
          {bool, is: [Number, Boolean]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.an('object')
        .that.have.property('bool')
        .that.is.a('boolean')
        .that.is.equal(bool);

        expect(result.bool == true).to.be.true;
      });

      it('custom elements ok', () => {
        const bool = true;
        const fn = () => typeOf([
          {bool, is: ['boolean', String, Date]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.an('object')
        .that.have.property('bool')
        .that.is.a('boolean')
        .that.is.equal(bool)
        .that.is.equal(true);
      });

      it('two custom elements ok', () => {
        const bool = false;
        const fn = () => typeOf([
          {bool, is: ['string', Number, 'boolean']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.an('object')
        .that.have.property('bool')
        .that.is.a('boolean')
        .that.is.equal(bool)
        .that.is.equal(false);
      });
    });

    describe('String', () => {
      it('string primitive', () => {
        const str = 'test-string';
        str.prop = 0;
        str.prop2 = 'test';
        const fn = () => typeOf([
          {str, is: [String, Number]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.equal('test-string');
      });

      it('empty string', () => {
        const str = '';
        str.prop = 0;
        str.prop2 = 'dfh';
        const fn = () => typeOf([
          {str, is: [Boolean, String, 'boolean']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.equal('');

        expect(result.str == false).to.be.true;
      });

      it('String constructor', () => {
        const str = new String('\0');
        str.prop = 0;
        str.prop2 = 'dfh';
        const fn = () => typeOf([
          {str, is: [Object, String, 'number']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.not.equal('\0');

        expect(result.str == '\0').to.be.true;
      });

      it('String factory', () => {
        const str = String(1);
        const fn = () => typeOf([
          {str, is: ['number', String, Number]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.equal('1');
      });
    });

    describe('String primitive', () => {
      it('string primitive', () => {
        const str = 'test-string';
        const fn = () => typeOf([
          {str, is: ['number', 'string']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.equal('test-string');
      });

      it('empty string', () => {
        const str = '';
        const fn = () => typeOf([
          {str, is: [Boolean, 'string', 'boolean']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.not.equal(new String(''));

        expect(result.str == false).to.be.true;
      });

      it('string function', () => {
        const str = String('123');
        const fn = () => typeOf([
          {str, is: ['string', Number]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('str')
        .that.is.a('string')
        .that.is.equal(str)
        .that.is.not.equal(new String(''));
      });
    });

    describe('String primitive throws', () => {
      it('String array throw on string', () => {
        const str = '';
        const fn = () => typeOf([
          {str, is: ['string']}
        ]);
        expect(fn).to.throw(Error);
      });
    });

    describe('String throws', () => {
      it('String primitive throw on instance', () => {
        const str = new String('test');
        const fn = () => typeOf([
          {str, is: [String]}
        ]);
        expect(fn).to.throw(Error);
      });

      it('String throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet(),
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: ['string', String]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Number', () => {
      it('number primitive', () => {
        const num = 124214;
        const fn = () => typeOf([
          {num, is: [String, Number]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(124214);
      });

      it('number primitive float', () => {
        const num = 124214.55555;
        const fn = () => typeOf([
          {num, is: [Number, Boolean]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(124214.55555);
      });
    });

    describe('Number primitive', () => {
      it('number primitive', () => {
        const num = 124214;
        const fn = () => typeOf([
          {num, is: [Boolean, 'number']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(124214);
      });

      it('number primitive float', () => {
        const num = 124214.32523;
        const fn = () => typeOf([
          {num, is: ['string', 'number']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('num')
        .that.is.a('number')
        .that.is.equal(num)
        .that.is.equal(124214.32523);
      });
    });

    describe('Number primitive throws', () => {
      it('number primitive throw on instance', () => {
        const num = 6;
        const fn = () => typeOf([
          {num, is: ['number']}
        ]);
        expect(fn).to.throw(Error);
      });

      it('number primitive throws if not found', () => {
        const num = 7;
        const fn = () => typeOf([
          {num, is: ['string', 'boolean', String]}
        ]);
        expect(fn).to.throw(TypeError);
      });
    });

    describe('Number throws', () => {
      it('Infinity primitive not a number', () => {
        const num = Infinity;
        const fn = () => typeOf([
          {num, is: [Number]}
        ]);
        expect(fn).to.throw(Error);
      });

      it('Number throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [Number, 'number']}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Symbol', () => {
      it('Symbol primitive', () => {
        const sym = Symbol('kl');
        const fn = () => typeOf([
          {sym, is: [String, Symbol]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol('kl'));
      });

      it('Symbol primitive', () => {
        const sym = Symbol();
        const fn = () => typeOf([
          {sym, is: ['number', Symbol]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol());
      });
    });

    describe('Symbol primitive', () => {
      it('Symbol primitive', () => {
        const sym = Symbol('kl');
        const fn = () => typeOf([
          {sym, is: [String, 'symbol']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol('kl'));
      });

      it('Symbol primitive', () => {
        const sym = Symbol();
        const fn = () => typeOf([
          {sym, is: ['symbol', Symbol, 'number']}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('sym')
        .that.is.a('symbol')
        .that.is.equal(sym)
        .that.is.not.equal(Symbol());
      });
    });

    describe('Symbol throws', () => {

      it('Symbol throws if not found', () => {
        const arr = Symbol('j');
        const fn = () => typeOf([
          {arr, is: [Object, String, 'sym']}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Symbol throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [Symbol, 'symbol']}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Object', () => {
      it('object', () => {
        const obj = {a: 1};
        const fn = () => typeOf([
          {obj, is: [Boolean, Object]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('obj')
        .that.is.a('object')
        .that.is.equal(obj)
        .that.is.deep.equal({a: 1});
      });

      it('object instance', () => {
        const obj = new Object({a: 1});
        const fn = () => typeOf([
          {obj, is: ['string', Object]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('obj')
        .that.is.a('object')
        .that.is.equal(obj)
        .that.is.deep.equal({a: 1});
      });
    });

    describe('Object throws', () => {
      it('Object empty throws if not found', () => {
        const arr = {};
        const fn = () => typeOf([
          {arr, is: [Array, Number, 'string', 'object', 'obj']}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Object throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          [], [1,2,3], new Array(10),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [Object, Symbol]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Array', () => {
      it('Array empty', () => {
        const arr = [];
        const fn = () => typeOf([
          {arr, is: [Object, Array]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('arr')
        .that.is.a('array')
        .that.is.equal(arr)
        .that.is.deep.equal([]);
      });
    });

    describe('Array throws', () => {

      it('Array empty throws', () => {
        const arr = [];
        const fn = () => typeOf([
          {arr, is: [Object, String, 'array', 'arr']}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Array throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: Array}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Function', () => {
      it('Normal function', () => {
        const func = function () {};
        const fn = () => typeOf([
          {func, is: [String, Function]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('func')
        .that.is.a('function')
        .that.is.equal(func);
      });
    });

    describe('Function throws', () => {
      it('Normal function', () => {
        const func = function () {};
        const fn = () => typeOf([
          {func, is: [Object, String, 'function']}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Function throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [Function, Date]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('RegExp', () => {
      it('Regexp normal', () => {
        const reg = /\d+/;
        const fn = () => typeOf([
          {reg, is: [String, RegExp]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('reg')
        .that.is.a('RegExp');
      });

      it('Regexp constructed', () => {
        const reg = new RegExp('\d+');
        const fn = () => typeOf([
          {reg, is: [RegExp, String]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('reg')
        .that.is.a('RegExp');
      });
    });

    describe('RegExp throws', () => {
      it('Regexp throw', () => {
        const reg = new RegExp('\d+');
        const fn = () => typeOf([
          {reg, is: [String, 'regex', 'regexp']}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('RegExp throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [RegExp, 'regex', Number]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Date', () => {
      it('Date', () => {
        const date = new Date();
        const fn = () => typeOf([
          {date, is: [Date, Number]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('date')
        .that.is.a('Date');
      });
    });

    describe('Date throws', () => {
      it('Date', () => {
        const date = new Date();
        const fn = () => typeOf([
          {date, is: [Number, 'date']}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Date throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [Date, Set]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Promise', () => {
      it('Promise', () => {
        const promise = Promise.resolve();
        const fn = () => typeOf([
          {promise, is: [Promise, Function]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('promise')
        .that.is.a('Promise');
      });
    });

    describe('Promise throws', () => {
      it('Promise', () => {
        const promise = Promise.resolve();
        const fn = () => typeOf([
          {promise, is: [Function, 'promise']}
        ]);
        expect(fn).to.throw();
      });

      it('Promise throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          new Map(), new Set(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [Promise, WeakMap]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Map', () => {
      it('Empty Map', () => {
        const map = new Map();
        const fn = () => typeOf([
          {map, is: [Map, Set]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('map')
        .that.is.a('Map');
      });
    });

    describe('Map throws', () => {
      it('Map', () => {
        const map = new Map();
        const fn = () => typeOf([
          {map, is: ['map', Set]}
        ]);
        expect(fn).to.throw(TypeError);
      });

      it('Map throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [Map, Set]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('WeakMap', () => {
      it('Empty WeakMap', () => {
        const map = new WeakMap();
        const fn = () => typeOf([
          {map, is: [WeakMap, Map]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('map')
        .that.is.a('WeakMap');
      });
    });

    describe('WeakMap throws', () => {
      it('Empty WeakMap', () => {
        const map = new WeakMap();
        const fn = () => typeOf([
          {map, is: ['weakmap', Map]}
        ]);
        expect(fn).to.throw();
      });

      it('WeakMap throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [WeakMap, Set]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('Set', () => {
      it('Empty Set', () => {
        const set = new Set();
        const fn = () => typeOf([
          {set, is: [Set, Date]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('set')
        .that.is.a('Set');
      });
    });

    describe('Set throws', () => {
      it('Empty Set', () => {
        const set = new Set();
        const fn = () => typeOf([
          {set, is: ['set', Date]}
        ]);
        expect(fn).to.throw();
      });

      it('Set throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new WeakMap(), new WeakSet()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [Set, Object]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('WeakSet', () => {
      it('Empty WeakSet', () => {
        const weakSet = new WeakSet();
        const fn = () => typeOf([
          {weakSet, is: [WeakSet, Number]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('weakSet')
        .that.is.a('WeakSet');
      });
    });

    describe('WeakSet throws', () => {
      it('Empty WeakSet', () => {
        const weakSet = new WeakSet();
        const fn = () => typeOf([
          {weakSet, is: ['weakset', Number]}
        ]);
        expect(fn).to.throw();
      });

      it('WeakSet throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(1), String(''),
          undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          [], [1,2,3], new Array(10),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap()
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [WeakSet, null]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('JSON', () => {
      it('JSON array', () => {
        const json = '[1, 2, "3", true, false, null, "string"]';
        const fn = () => typeOf([
          {json, is: [Number, JSON]}
        ]);
        expect(fn).not.to.throw();
        const result = fn();
        expect(result)
        .to.be.a('object')
        .that.have.property('json')
        .that.is.a('string');
      });
    });

    describe('JSON throws', () => {
      it('JSON array', () => {
        const json = '[1, 2, "3", true, false, null, "string"]';
        const fn = () => typeOf([
          {json, is: [Array, Object, Function, 'json']}
        ]);
        expect(fn).to.throw();
      });

      it('JSON obj', () => {
        const json = '{"a": "1"}';
        const fn = () => typeOf([
          {json, is: [Array, Object, Function, 'json']}
        ]);
        expect(fn).to.throw();
      });

      it('JSON throws', () => {
        const types = [
          true, false, new Boolean({}), new Boolean(0),
          -1, 0, -0, +0, 1, +1, new Number(1),
          '', 'gsd', new String(546), String(''),
          null, undefined,
          +'fsa', Infinity, -Infinity, +Infinity,
          Symbol('fsd'), Symbol(),
          {}, {a: 1}, new Object({a: 2}),
          new (function C () {}),
          function () {}, function named () {}, () => {},
          async function () {}, async () => {},
          function* gen () {},
          new Date(),
          /\d+/, new RegExp('\d'),
          Promise.resolve(0), Promise.reject(),
          new Map(), new Set(), new WeakMap(), new WeakSet(),
          '0', '-1', 'true', 'false', 'null',
          new String(''), new String(0), new String(1),
          new String(true), new String(false),new String(null)
        ];

        const fns = types.map(type => () => typeOf([
          {type, is: [JSON, Array]}
        ]));

        for (const fn of fns) {
          expect(fn).to.throw(TypeError);
        }
      });
    });

    describe('multiple definitions', () => {
      it('multiple', () => {
        const Noop = function () {};

        const fn = () => typeOf([
          {variable: true, is: [Boolean, Array]},
          {variable: false, is: [String, Boolean]},
          {variable: new Boolean([1,2]), is: [Number, Boolean]},
          {variable: new Boolean(''), is: [Object, Boolean]},

          {variable: true, is: ['boolean', String, 'string']},
          {variable: false, is: ['boolean', Number, 'b']},

          {variable: -1, is: ['string', Number]},
          {variable: 0, is: [Number, 'Array']},

          {variable: 0, is: ['number', Boolean]},

          {variable: '', is: [String, Number]},
          {variable: 2, is: [String, Number]},

          {variable: String(''), is: ['string', String]},
          {variable: String('test'), is: ['string', Array]},
          {variable: '', is: ['boolean', 'string']},
          {variable: 'test', is: [Number, 'string', Boolean]},

          {variable: Symbol('fsd'), is: [Symbol, Array]},
          {variable: Symbol(), is: [Number, String, Symbol]},

          {variable: [], is: [Array, Boolean]},
          {variable: [1,2,3], is: [String, Array, Boolean]},

          {variable: {}, is: [Object, Function]},
          {variable: {x: 2}, is: [String, Function, Object]},

          {variable: function () {}, is: [Function, 'string']},
          {variable: function named () {}, is: [Array, Function]},


          {variable: new Date(), is: [String, Date]},

          {variable: /\d+/, is: [String, RegExp]},
          {variable: new RegExp('\d+'), is: [String, RegExp]},

          {variable: new Promise(() => {}), is: [String, Promise]},
          {variable: Promise.resolve(), is: [String, Promise]},
          {variable: Promise.reject(), is: [String, Promise]},

          {variable: new Map(), is: [String, Map]},
          {variable: new Set(), is: [String, Set]},
          {variable: new WeakMap(), is: [String, WeakMap]},
          {variable: new WeakSet(), is: [String, WeakSet]}
        ]);

        expect(fn).not.to.throw();
      });
    });
  });
});
