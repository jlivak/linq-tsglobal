# Linq for TypeScript, Exported as a Global Modifying Module

[![Version](https://img.shields.io/npm/v/linq-tsglobal.svg)](https://npmjs.com/package/linq-tsglobal)

This package adds many commonly used .NET Linq methods directly to javascript's Array prototype on import.  It does so by making use of Typescript's global modifying module pattern.

It is a fork of the linq.ts project, but moves all of the methods out of a separate List type and into the Array prototype.

## Install

```sh
$ npm install linq-tsglobal
```

## Usage

Import `linq-tsglobal` at the top of your entry point file.
~~~typescript
import 'linq-tsglobal';
~~~

Call linq methods directly on array objects.
```typescript
let demoArray: string[] = ["Cat", "Dog", "Snake", "Seven"];

demoArray.remove("Seven");
demoArray.removeAt(1);
demoArray.insert(1, "Monkey");
// > ["Cat", "Monkey", "Snake"]

let numbersArray: number[] = [1, 2, 3, 4, 5];

let arr = numbersArray
  .Where(x => x > 3)
  .Select(y => y * 2);
// > [8, 10]
```

## Tests

TODO:  Add updated test coverage.

## License

Modified linq-tsglobal project distributed under MIT © [linq-tsglobal](https://github.com/jlivak/linq-tsglobal) Contributors.

Original linq.ts project distributed under MIT © [Flavio Corpa](http://flaviocorpa.com).
