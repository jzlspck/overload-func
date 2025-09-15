import type {
 	FT,
	TypeName,
	IOverloadFunction
} from "./interface";
import { getTypeNames } from "./utils";

interface IParams {
	// 允许多个实现
	allowMultiple?: boolean;
	// 允许拓展类型
	extendType?: Record<string, new (...args: any[]) => any>;
}

export function createOverloadedFunction<T extends FT[] = []>(options: IParams = {}) {
	const { allowMultiple = false, extendType = {} } = options;

	const ImpleMap: Map<string, T[number]> = new Map();

	const result = function(...args: any[]) {  
		const argsKey = getTypeNames(args).join('-');
		const imple = ImpleMap.get(argsKey);
		if (!imple) {
			throw new Error(`No implementation found for argument types: (${argsKey.split('-').join(', ')})`);
		}
		return imple.apply(this, args);
	} as IOverloadFunction<T>;

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

const func = createOverloadedFunction<[
	(x: number) => number,
	(x: string, y: string) => string,
	(x: {
		name: string;
		age: number;
	}) => boolean,
	(x: number, y: (n: number) => number) => number,
	(d: Date) => string
]>({
	// allowMultiple: true
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

func.addImple('date', (d) => {
	return d.toISOString();
});

const r1 = func(10);
const r2 = func('hello', 'world');
const r3 = func({ name: 'Alice', age: 20 });
const r4 = func(10, (x) => x * 2);


console.log(r1, r2, r3, r4); // 20 'helloworld' true
