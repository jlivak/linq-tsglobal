# LinQ for TypeScript, Exported as a Global Modifying Module (linq-tsglobal)


## Install

```sh
$ npm i linq-tsglobal
```

## Usage

```typescript
import { List } from 'linqts';

const arr = new List<number>([1, 2, 3, 4, 5])
  .Where(x => x > 3)
  .Select(y => y * 2)
  .ToArray(); // > [8, 10]

const query = people.Join(pets,
  person => person,
  pet => pet.Owner,
  (person, pet) =>
    ({ OwnerName: person.Name, Pet: pet.Name }));
```

## Documentation

If you do not know LinQ or just want to remember what is all about, have a look at the [docs](http://kutyel.github.io/linq.ts/docs/classes/list/index.html).

## Tests

TODO:  Add updated test coverage.

## License

Modified linq-tsglobal project distributed under MIT © [linq-tsglobal](https://github.com/jlivak/linq-tsglobal) Contributors.

Original linq.ts project distributed under MIT © [Flavio Corpa](http://flaviocorpa.com).
