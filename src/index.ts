/**
 * LinQ + TypeScript, now added directly to the Array prototype.
 *
 * Documentation from LinQ .NET specification (https://msdn.microsoft.com/en-us/library/system.linq.enumerable.aspx)
 *
 * A fork of 'LinQ + TypeScript' originally created by Flavio Corpa (@kutyel)
 */
import { composeComparers, negate, isObj, equal, keyComparer } from './helpers'

type PredicateType<T> = (value?: T, index?: number, list?: T[]) => boolean

declare global {
    interface Array<T> {
        add(element: T): void;
        append(element: T): void;
        prepend(element: T): void;
        addRange(elements: T[]): void;
        aggregate<U>(
            accumulator: (accum: U, value?: T, index?: number, list?: T[]) => any,
            initialValue?: U
          ): any;
        all(predicate: PredicateType<T>): boolean;
        any(): boolean;
        any(predicate?: PredicateType<T>): boolean;
        average(): number;
        average(
          transform?: (value?: T, index?: number, list?: T[]) => any
        ): number;
        cast<U>(): Array<U>;
        clear(): void;
        concat(array: Array<T>): Array<T>;
        contains(element: T): boolean;
        count(): number;
        count(predicate?: PredicateType<T>): number;
        defaultIfEmpty(defaultValue?: T): Array<T>;
        distinct(): Array<T>;
        distinctBy(keySelector: (key: T) => string | number): Array<T>;
        elementAt(index: number): T;
        elementAtOrDefault(index: number): T | null;
        except(source: Array<T>): Array<T>;
        first(): T;
        first(predicate?: PredicateType<T>): T;
        firstOrDefault(): T;
        firstOrDefault(predicate?: PredicateType<T>): T;
        groupBy<TResult = T>(
          grouper: (key: T) => string | number): { [key: string]: TResult[] };
        groupJoin<U, R>(
          list: Array<U>,
          key1: (k: T) => any,
          key2: (k: U) => any,
          result: (first: T, second: Array<U>) => R
        ): Array<R>;
        insert(index: number, element: T): void | Error;
        intersect(source: Array<T>): Array<T>;
        last(): T;
        last(predicate?: PredicateType<T>): T;
        lastOrDefault(): T;
        lastOrDefault(predicate?: PredicateType<T>): T;
        max(): number;
        max(selector?: (value: T, index: number, array: T[]) => number
          ): number;
        min(): number;
        min(selector?: (value: T, index: number, array: T[]) => number
          ): number;
        ofType<U>(type: any): Array<U>;
        orderBy(keySelector: (key: T) => any): Array<T>;
        orderByDescending(keySelector: (key: T) => any): Array<T>;
        thenBy(keySelector: (key: T) => any): Array<T>;
        thenByDescending(keySelector: (key: T) => any): Array<T>;
        remove(element: T): boolean;
        removeAll(predicate: PredicateType<T>): Array<T>;
        removeAt(index: number): void;
        select<TOut>(
          selector: (element: T, index: number) => TOut
        ): Array<TOut>;
        selectMany<TOut extends Array<any>>(
          selector: (element: T, index: number) => TOut
        ): TOut;
        sequenceEqual(list: Array<T>): boolean;
        single(predicate?: PredicateType<T>): T;
        singleOrDefault(predicate?: PredicateType<T>): T;
        skip(amount: number): Array<T>;
        skipLast(amount: number): Array<T>;
        skipWhile(predicate: PredicateType<T>): Array<T>;
        sum(): number;
        sum(transform?: (value?: T, index?: number, list?: T[]) => number
          ): number;
        take(amount: number): Array<T>;
        takeLast(amount: number): Array<T>;
        takeWhile(predicate: PredicateType<T>): Array<T>;
        union(list: Array<T>): Array<T>;
        where(predicate: PredicateType<T>): Array<T>;
        zip<U, TOut>(
            list: Array<U>,
            result: (first: T, second: U) => TOut
          ): Array<TOut>;
    }
}

  /**
   * Adds an object to the end of the List<T>.
   */
  Array.prototype.add = function<T>(this: Array<T>, element: T): void {
    this.push(element);
  };

  /**
   * Appends an object to the end of the List<T>.
   */
  Array.prototype.append = function<T>(this: Array<T>, element: T): void {
    this.add(element);
  };

  /**
   * Add an object to the start of the List<T>.
   */
  Array.prototype.prepend = function<T>(this: Array<T>, element: T): void {
    this.unshift(element);
  };

  /**
   * Adds the elements of the specified collection to the end of the List<T>.
   */
  Array.prototype.addRange = function<T>(this: Array<T>, elements: T[]): void {
    this.push(...elements);
  };

  /**
   * Applies an accumulator function over a sequence.
   */
  Array.prototype.aggregate = function<T, U>(this: Array<T>,
    accumulator: (accum: U, value?: T, index?: number, list?: T[]) => any,
    initialValue?: U
  ): any {
    return this.reduce(accumulator, initialValue);
  };

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   */
  Array.prototype.all = function<T>(this: Array<T>, predicate: PredicateType<T>): boolean {
    return this.every(predicate);
  };

  /**
   * Determines whether a sequence contains any elements.
   */
  Array.prototype.any = function<T>(this: Array<T>, predicate?: PredicateType<T>): boolean {
    return predicate
      ? this.some(predicate)
      : this.length > 0;
  };

  /**
   * Computes the average of a sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  Array.prototype.average = function<T>(this: Array<T>,
    transform?: (value?: T, index?: number, list?: T[]) => any
  ): number {
    return this.sum(transform) / this.count(transform);
  };

  /**
   * Casts the elements of a sequence to the specified type.
   */
  Array.prototype.cast = function<T, U>(this: Array<T>): Array<U> {
    let newArray = new Array<U>();
    newArray.addRange(this as any);
    return newArray;
  };

  /**
   * Removes all elements from the List<T>.
   */
  Array.prototype.clear = function<T>(this: Array<T>): void {
    this.length = 0;
  };

  /**
   * Concatenates two sequences.
   */
  Array.prototype.concat = function<T>(this: Array<T>, array: Array<T>): Array<T> {
    return new Array<T>(...this, ...array);
  };

  /**
   * Determines whether an element is in the List<T>.
   */
  Array.prototype.contains = function<T>(this: Array<T>, element: T): boolean {
    return this.any(x => x === element);
  };

  /**
   * Returns the number of elements in a sequence.
   */
  Array.prototype.count = function<T>(this: Array<T>, predicate?: PredicateType<T>): number {
    return predicate ? this.where(predicate).count() : this.length;
  };

  /**
   * Returns the elements of the specified sequence or the type parameter's default value
   * in a singleton collection if the sequence is empty.
   */
  Array.prototype.defaultIfEmpty = function<T>(this: Array<T>, defaultValue?: T): Array<T> {
    return this.count() ? this : [defaultValue];
  };

  /**
   * Returns distinct elements from a sequence by using the default equality comparer to compare values.
   */
  Array.prototype.distinct = function<T>(this: Array<T>): Array<T> {
    return this.where(
      (value, index, iter) =>
        (isObj(value)
          ? iter.findIndex(obj => equal(obj, value))
          : iter.indexOf(value)) === index
    );
  };

  /**
   * Returns distinct elements from a sequence according to specified key selector.
   */
  Array.prototype.distinctBy = function<T>(this: Array<T>, keySelector: (key: T) => string | number): Array<T> {
    const groups = this.groupBy(keySelector);
    return Object.keys(groups).reduce((res, key) => {
      res.add(groups[key][0])
      return res
    }, []);
  };

  /**
   * Returns the element at a specified index in a sequence.
   */
  Array.prototype.elementAt = function<T>(this: Array<T>, index: number): T {
    if (index < this.count() && index >= 0) {
      return this[index];
    } else {
      throw new Error(
        'ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source.'
      );
    }
  };

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   */
  Array.prototype.elementAtOrDefault = function<T>(this: Array<T>, index: number): T | null {
    return index < this.count() && index >= 0
      ? this[index]
      : null;
  };

  /**
   * Produces the set difference of two sequences by using the default equality comparer to compare values.
   */
  Array.prototype.except = function<T>(this: Array<T>, source: Array<T>): Array<T> {
    return this.where(x => !source.contains(x));
  };

  /**
   * Returns the first element of a sequence.
   */
  Array.prototype.first = function<T>(this: Array<T>, predicate?: PredicateType<T>): T {
    if (this.count()) {
      return predicate ? this.where(predicate).first() : this[0];
    } else {
      throw new Error(
        'InvalidOperationException: The source sequence is empty.'
      );
    }
  };

  /**
   * Returns the first element of a sequence, or a default value if the sequence contains no elements.
   */
  Array.prototype.firstOrDefault = function<T>(this: Array<T>, predicate?: PredicateType<T>): T {
    return this.count(predicate) ? this.first(predicate) : null;
  };

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   */
  Array.prototype.groupBy = function<T, TResult = T>(this: Array<T>,
    grouper: (key: T) => string | number,
    mapper: (element: T) => TResult = val => (val as unknown) as TResult
  ): { [key: string]: TResult[] } {
    const initialValue: { [key: string]: TResult[] } = {};
    return this.aggregate((ac, v) => {
      const key = grouper(v);
      const existingGroup = ac[key];
      const mappedValue = mapper(v);
      existingGroup
        ? existingGroup.push(mappedValue)
        : (ac[key] = [mappedValue]);
      return ac;
    }, initialValue);
  };

  /**
   * Correlates the elements of two sequences based on equality of keys and groups the results.
   * The default equality comparer is used to compare keys.
   */
  Array.prototype.groupJoin = function<T, U, R>(this: Array<T>,
    list: Array<U>,
    key1: (k: T) => any,
    key2: (k: U) => any,
    result: (first: T, second: Array<U>) => R
  ): Array<R> {
    return this.select(x =>
      result(
        x,
        list.where(z => key1(x) === key2(z))
      )
    );
  };

  /**
   * Inserts an element into the List<T> at the specified index.
   */
  Array.prototype.insert = function<T>(this: Array<T>, index: number, element: T): void | Error {
    if (index < 0 || index > this.length) {
      throw new Error('Index is out of range.');
    }

    this.splice(index, 0, element);
  };

  /**
   * Produces the set intersection of two sequences by using the default equality comparer to compare values.
   */
  Array.prototype.intersect = function<T>(this: Array<T>, source: Array<T>): Array<T> {
    return this.where(x => source.contains(x));
  };

  /**
   * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
   */
  // Removed due to clashing name

  // Array.prototype.join = function<T, U, R>(this: Array<T>,
  //   list: Array<U>,
  //   key1: (key: T) => any,
  //   key2: (key: U) => any,
  //   result: (first: T, second: U) => R
  // ): Array<R> {
  //   return this.selectMany(x =>
  //     list.where(y => key2(y) === key1(x)).Select(z => result(x, z));
  //   )
  // }

  /**
   * Returns the last element of a sequence.
   */
  Array.prototype.last = function<T>(this: Array<T>, predicate?: PredicateType<T>): T {
    if (this.count()) {
      return predicate
        ? this.where(predicate).last()
        : this[this.count() - 1];
    } else {
      throw Error('InvalidOperationException: The source sequence is empty.');
    }
  };

  /**
   * Returns the last element of a sequence, or a default value if the sequence contains no elements.
   */
  Array.prototype.lastOrDefault = function<T>(this: Array<T>, predicate?: PredicateType<T>): T {
    return this.count(predicate) ? this.last(predicate) : null;
  };

  /**
   * Returns the maximum value in a generic sequence.
   */
  Array.prototype.max = function<T>(this: Array<T>,
    selector?: (value: T, index: number, array: T[]) => number
  ): number {
    const id = x => x;
    return Math.max(...this.map(selector || id));
  };

  /**
   * Returns the minimum value in a generic sequence.
   */
  Array.prototype.min = function<T>(this: Array<T>,
    selector?: (value: T, index: number, array: T[]) => number
  ): number {
    const id = x => x;
    return Math.min(...this.map(selector || id));
  };

  /**
   * Filters the elements of a sequence based on a specified type.
   */
  Array.prototype.ofType = function<T, U>(this: Array<T>, type: any): Array<U> {
    let typeName;
    switch (type) {
      case Number:
        typeName = typeof 0;
        break;
      case String:
        typeName = typeof '';
        break;
      case Boolean:
        typeName = typeof true;
        break;
      case Function:
        typeName = typeof function() {};
        break;
      default:
        typeName = null;
        break;
    }
    return typeName === null
      ? this.where(x => x instanceof type).cast<U>()
      : this.where(x => typeof x === typeName).cast<U>();
  };

  /**
   * Sorts the elements of a sequence in ascending order according to a key.
   */
 Array.prototype.orderBy = function<T>(this: Array<T>,
    keySelector: (key: T) => any,
    comparer = keyComparer(keySelector, false)
  ): Array<T> {
    return this.sort(comparer);
  };

  /**
   * Sorts the elements of a sequence in descending order according to a key.
   */
  Array.prototype.orderByDescending = function<T>(this: Array<T>,
    keySelector: (key: T) => any,
    comparer = keyComparer(keySelector, true)
  ): Array<T> {
    // tslint:disable-next-line: no-use-before-declare
    return this.sort(comparer);
  };

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
   */
  Array.prototype.thenBy = function<T>(this: Array<T>, keySelector: (key: T) => any): Array<T> {
    return this.orderBy(keySelector);
  };

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   */
  Array.prototype.thenByDescending = function<T>(this: Array<T>, keySelector: (key: T) => any): Array<T> {
    return this.orderByDescending(keySelector);
  };

  /**
   * Removes the first occurrence of a specific object from the List<T>.
   */
  Array.prototype.remove = function<T>(this: Array<T>, element: T): boolean {
    return this.indexOf(element) !== -1
      ? (this.removeAt(this.indexOf(element)), true)
      : false;
  };

  /**
   * Removes all the elements that match the conditions defined by the specified predicate.
   */
  Array.prototype.removeAll = function<T>(this: Array<T>, predicate: PredicateType<T>): Array<T> {
    return this.where(negate(predicate));
  };

  /**
   * Removes the element at the specified index of the List<T>.
   */
  Array.prototype.removeAt = function<T>(this: Array<T>, index: number): void {
    this.splice(index, 1);
  };

  /**
   * Projects each element of a sequence into a new form.
   */
  Array.prototype.select = function<T, TOut>(this: Array<T>,
    selector: (element: T, index: number) => TOut
  ): Array<TOut> {
    return this.map(selector);
  };

  /**
   * Projects each element of a sequence to a List<any> and flattens the resulting sequences into one sequence.
   */
  Array.prototype.selectMany = function<T, TOut extends Array<any>>(this: Array<T>,
    selector: (element: T, index: number) => TOut
  ): TOut {
    return this.aggregate(
      (ac, _, i) => (
        ac.addRange(
          this.select(selector)
            .elementAt(i)
        ),
        ac
      ),
      new Array<TOut>()
    );
  };

  /**
   * Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
   */
  Array.prototype.sequenceEqual = function<T>(this: Array<T>, list: Array<T>): boolean {
    if (this.length !== list.length) return false;
    for (let i = 0; i < this.length; i++) {
      if (this[i] !== list[i]) {
        return false;
      }
    }
    return true;
  };

  /**
   * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
   */
  Array.prototype.single = function<T>(this: Array<T>, predicate?: PredicateType<T>): T {
    if (this.count(predicate) !== 1) {
      throw new Error('The collection does not contain exactly one element.');
    } else {
      return this.first(predicate);
    }
  };

  /**
   * Returns the only element of a sequence, or a default value if the sequence is empty;
   * this method throws an exception if there is more than one element in the sequence.
   */
  Array.prototype.singleOrDefault = function<T>(this: Array<T>, predicate?: PredicateType<T>): T {
    return this.count(predicate) ? this.single(predicate) : null;
  };

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   */
  Array.prototype.skip = function<T>(this: Array<T>, amount: number): Array<T> {
    return this.slice(Math.max(0, amount));
  };

  /**
   * Omit the last specified number of elements in a sequence and then returns the remaining elements.
   */
  Array.prototype.skipLast = function<T>(this: Array<T>, amount: number): Array<T> {
    return this.slice(0, -Math.max(0, amount));
  };

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   */
  Array.prototype.skipWhile = function<T>(this: Array<T>, predicate: PredicateType<T>): Array<T> {
    return this.skip(
      this.aggregate(ac => (predicate(this.elementAt(ac)) ? ++ac : ac), 0)
    );
  };

  /**
   * Computes the sum of the sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  Array.prototype.sum = function<T>(this: Array<T>,
    transform?: (value?: T, index?: number, list?: T[]) => number
  ): number {
    return transform
      ? this.select(transform).sum()
      : this.aggregate((ac, v) => (ac += +v), 0);
  };

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   */
  Array.prototype.take = function<T>(this: Array<T>, amount: number): Array<T> {
    return this.slice(0, Math.max(0, amount));
  };

  /**
   * Returns a specified number of contiguous elements from the end of a sequence.
   */
  Array.prototype.takeLast = function<T>(this: Array<T>, amount: number): Array<T> {
    return this.slice(-Math.max(0, amount));
  };

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   */
  Array.prototype.takeWhile = function<T>(this: Array<T>, predicate: PredicateType<T>): Array<T> {
    return this.take(
      this.aggregate(ac => (predicate(this.elementAt(ac)) ? ++ac : ac), 0)
    );
  };

 //TODO: Implement a ToDirectionary equivalent but for a native object type

  /**
   * Produces the set union of two sequences by using the default equality comparer.
   */
  Array.prototype.union = function<T>(this: Array<T>, list: Array<T>): Array<T> {
    return this.concat(list).distinct();
  };

  /**
   * Filters a sequence of values based on a predicate.
   */
  Array.prototype.where = function<T>(this: Array<T>, predicate: PredicateType<T>): Array<T> {
    return this.filter(predicate);
  };

  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   */
  Array.prototype.zip = function<T, U, TOut>(this: Array<T>,
    list: Array<U>,
    result: (first: T, second: U) => TOut
  ): Array<TOut> {
    return list.count() < this.count()
      ? list.select((x, y) => result(this.elementAt(y), x))
      : this.select((x, y) => result(x, list.elementAt(y)));
  };

export {};

