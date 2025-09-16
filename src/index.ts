import type {
 	FT,
	TypeName,
	IOverloadFunction,
	InstanceTypes
} from "./interface";
import { getTypeNames, createExtendType } from "./utils";
import type { ConstructableRecord } from "./utils";
import { extendTypeSymbol } from "./utils";

interface IParams<T> {
	// 允许多个实现
	allowMultiple?: boolean;
	// 允许拓展类型
	extendType?: T;
}

export function createOverloadedFunction<T extends FT[], E extends ReturnType<typeof createExtendType>>(options: IParams<E> = {}) {
	const { allowMultiple = false, extendType } = options;

	// 拓展类型，但是没有使用 createExtendType 创建
	if (extendType && !extendType[extendTypeSymbol]) {
		console.warn('Warning: The extendType should be created using createExtendType for proper functionality.');
	}

	const ImpleMap: Map<string, T[number]> = new Map();

	const result = function(...args: any[]) {  
		const argsKey = getTypeNames(args, extendType).join('-');
		const imple = ImpleMap.get(argsKey);
		if (!imple) {
			throw new Error(`No implementation found for argument types: (${argsKey.split('-').join(', ')})`);
		}
		return imple.apply(this, args);
	} as IOverloadFunction<T, InstanceTypes<E>>;

	result.addImple = function(...args) {
		const callback = args.pop() as T[number];
		if (typeof callback !== 'function') {
			throw new Error('The last argument must be a function.');
		}
		const typeNames = args as TypeName[];
		const key = typeNames.join('-');
		// 检查是否已经存在相同类型签名的实现
		if (ImpleMap.has(key)) {
			if (allowMultiple) {
		    // 允许多个实现
				const existingCallback = ImpleMap.get(key) as Function;
				const newCallback = function(...cbArgs: any[]) {
					existingCallback.apply(this, cbArgs);
					return callback.apply(this, cbArgs);
				};
				ImpleMap.set(key, newCallback as T[number]);
				return result;
			} else {
				throw new Error(`Implementation for types (${typeNames.join(', ')}) already exists.`);
			}
		}
		ImpleMap.set(key, callback);
		return result;
	}

  return result;
}

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
