import { createOverloadedFunction, createExtendType } from '../lib';

/**
 * @type {
 * 	() => boolean;
 * 	(a: number) => boolean;
 * 	(a: string, b: string) => string;
 * 	(x: number, y: (n: number) => number) => number;
 * 	(d: Promise<number>) => Promise<string>;
 * 	(u: { name: string, age: number }) => unknown;
 * }
 */

// type IParams = []
//   | [a: number]
//   | [a: string, b: string]
//   | [x: number, y: (n: number) => number]
//   | [d: Promise<number>]
//   | [u: { name: string, age: number }];
// function fn(): boolean;
// function fn(a: number): boolean;
// function fn(a: string, b: string): string;
// function fn(x: number, y: (n: number) => number): number;
// function fn(d: Promise<number>): Promise<string>;
// function fn(u: { name: string, age: number }): unknown;


// function fn(...args: IParams): any {
//   if (args.length === 0) { /* ... */ }
//   if (args.length === 1 && typeof args[0] === 'number') { /* ... */ }
//   if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'string') { /* ... */ }
//   if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'function') { /* ... */ }
//   if (args.length === 1 && args[0] instanceof Promise) { /* ... */ }
//   if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) { /* ... */ }
//   throw new Error('No implementation found for argument types.');
// }


// function fn(...args: IParams): any {
//   const config = normalizeArgs(args);
//   // ...
// }

// function normalizeArgs(args: IParams): IParams {
//   return args;
// }

const fn = createOverloadedFunction<[
  () => boolean,
  (a: number) => boolean,
  (a: string, b: string) => string,
  (x: number, y: (n: number) => number) => number,
  (d: Promise<number>) => Promise<string>,
  (u: { name: string, age: number }) => unknown
]>();
fn.addImple(() => (0 as any));
fn.addImple('number', (a) => (0 as any));
fn.addImple('string', 'string', (a, b) => (0 as any));
fn.addImple('number', 'function', (x, y) => (0 as any));
fn.addImple('promise', (u) => (0 as any));
fn.addImple('object', (u) => (0 as any));

