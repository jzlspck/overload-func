import { createOverloadedFunction } from './index';
import { createExtendType } from './utils';


const fn = createOverloadedFunction<[
  () => boolean,
  (a: number) => boolean,
  (a: string, b: string) => string,
  (x: number, y: (n: number) => number) => number,
  (d: Promise<number>) => Promise<string>,
  (u: { name: string, age: number }) => unknown
]>();
fn.addImple(() => true);
fn.addImple('number', (a) => a > 0);
fn.addImple('string', 'string', (a, b) => a + b);
fn.addImple('number', 'function', (x, y) => y(x));
fn.addImple('promise', (u) => Promise.resolve(u).then(n => n.toString()));
fn.addImple('object', (u) => u.name);

type A = Promise<number> extends object ? true : false;
type B = null extends object ? true : false;

console.log(fn());
console.log(fn(10));
console.log(fn('hello', ' world'));
console.log(fn(5, n => n * 2));
console.log(fn(Promise.resolve(42)));
console.log(fn({ name: 'Alice', age: 30 }));

// class User {
// 	constructor(public name: string, public age: number, public gender: string) {}
// }

// const extendType = createExtendType({
// 	user: User,
// });

// const func = createOverloadedFunction<[
// 	() => void,
// 	(x: number) => number,
// 	(x: string, y: string) => string,
// 	(x: {
// 		name: string;
// 		age: number;
// 		address: string;
// 	}) => boolean,
// 	(x: number, y: (n: number) => number) => number,
// 	(d: Promise<number>) => string,
// 	(u: User) => string,
// 	(this: User, n: number, s: string) => boolean
// ], typeof extendType>({
// 	// allowMultiple: true,
// 	extendType
// });	

// func.addImple(() => {
// 	console.log('First implementation for void');
// });
// func();

// func.addImple('number', (x) => {
// 	console.log('First implementation for number');
// 	return x * 2;
// });
// // func.addImple('number', (x) => {
// // 	console.log('Second implementation for number');
// // 	return x * 3;
// // });
// // func.addImple('number', (x) => {
// // 	console.log('Third implementation for number');
// // 	return x * 4;
// // });

// func.addImple('string', 'string', (x, y) => {
// 	return x + y;
// });

// func.addImple('object', (x) => {
// 	return x.age > 18;
// });

// func.addImple('number', 'function', (x, y) => {
// 	return y(x) + 2;
// });

// func.addImple('promise', (d) => {
// 	return 'Handled a promise';
// });

// func.addImple('user', (u) => {
// 	return `User: ${u.name}, Age: ${u.age}`;
// });

// func.addImple('number', 'string', function(a) {
// 	this.name
// 	return true;
// });

// const r1 = func(10);
// const r2 = func('hello', 'world');
// const r3 = func({ name: 'Alice', age: 20, address: '123 Main St' });
// const r4 = func(10, (x) => x * 2);
// const r6 = func(new User('pink', 23, 'male'))


// console.log(r1, r2, r3, r4, r6); // 20 'helloworld' true

// type A = (this: User, a: number) => number;

// type B = Parameters<A>;
// type C = ThisType<A>;

// let c: C = 8;

// const test = createOverloadedFunction<[
// 	(this: Test, n: number) => boolean,
// 	(this: Test, n: string, s: string) => string,
// ]>();

// test.addImple('number', function(n) {
// 	return true;
// });
// test.addImple('string', 'string', function(n) {
// 	return n;
// });
// class Test {
// 	test = test
// }
// const t = new Test();

// t.test(8)
// t.test('pknk', 'lll')

// class Teacher {
// 	salary: number;
// 	constructor(public name: string) {}
// }
// class Student {
// 	score: number;
// 	constructor(public name: string) {}
// }
// const extendType2 = createExtendType({
// 	teacher: Teacher,
// 	student: Student,
// });
// const test2 = createOverloadedFunction<[
// 	(t: Teacher) => string,
// 	(s: Student) => number,
// ], typeof extendType2>({
// 	extendType: extendType2,
// });
// test2.addImple('teacher', (t) => t.name);
// test2.addImple('student', (s) => s.name.length);
// const res1 = test2(new Teacher('John'));
// const res2 = test2(new Student('Alice'));
// console.log(res1, res2); // John 5

// const test3 = createOverloadedFunction<[
// 	(a: number, b: string) => boolean,
// 	(a: string, b?: number) => string,
// ]>();

// test3.addImple('number','string', (a, b) => true);
// test3.addImple('string', 'number', (a, b) => b?.toFixed() || a);

// const res3 = test3(10, 'hello');
// const res4 = test3('hello');
// console.log(res3, res4); // true hello

// class Person {
// 	address: string;
// 	constructor(public name: string, public age: number) {}
// }
// const extendType3 = createExtendType({
// 	person: Person,
// });
// const fn = createOverloadedFunction<[
// 	(a: { name: string, age: number, gender: string }) => number,
// 	(a: Person) => boolean
// ], typeof extendType3>({
// 	extendType: extendType3,
// });
// fn.addImple('object', (a) => a.age);
// fn.addImple('person', (a) => a.age > 18);

