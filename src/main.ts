import { createOverloadedFunction } from './index';
import { createExtendType } from './utils';


class User {
	constructor(public name: string, public age: number, public gender: string) {}
}

const extendType = createExtendType({
	user: User,
});

const func = createOverloadedFunction<[
	(x: number) => number,
	(x: string, y: string) => string,
	(x: {
		name: string;
		age: number;
		address: string;
	}) => boolean,
	(x: number, y: (n: number) => number) => number,
	(d: Promise<number>) => string,
	(u: User) => string
], typeof extendType>({
	// allowMultiple: true,
	extendType
});	

func.addImple('number', (x) => {
	console.log('First implementation for number');
	return x * 2;
});
// func.addImple('number', (x) => {
// 	console.log('Second implementation for number');
// 	return x * 3;
// });
// func.addImple('number', (x) => {
// 	console.log('Third implementation for number');
// 	return x * 4;
// });

func.addImple('string', 'string', (x, y) => {
	return x + y;
});

func.addImple('object', (x) => {
	return x.age > 18;
});

func.addImple('number', 'function', (x, y) => {
	return y(x) + 2;
});

func.addImple('promise', (d) => {
	return 'Handled a promise';
});

func.addImple('user', (u) => {
	return `User: ${u.name}, Age: ${u.age}`;
});

const r1 = func(10);
const r2 = func('hello', 'world');
const r3 = func({ name: 'Alice', age: 20, address: '123 Main St' });
const r4 = func(10, (x) => x * 2);
const r6 = func(new User('pink', 23, 'male'))


console.log(r1, r2, r3, r4, r6); // 20 'helloworld' true
