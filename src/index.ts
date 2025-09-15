import type {
 	FunctionType,
 	FuncTupleToIntersection,
	TypeName,
	IAddImple,
} from "./interface";
import { getTypeNames } from "./utils";

export function createOverloadedFunction<T extends FunctionType[] = []>() {
	const ImpleMap: Map<string, T[number]> = new Map();

  	const result = function(...args: any[]) {    
		const argsKey = getTypeNames(args).join('-');
		const imple = ImpleMap.get(argsKey);
		if (!imple) {
			throw new Error(`No implementation found for argument types: (${argsKey.split('-').join(', ')})`);
		}
		return imple.apply(this, args);
  	} as FuncTupleToIntersection<T> & IAddImple<T>;

	result.addImple = function(...args) {
		const callback = args.pop() as T[number];
		if (typeof callback !== 'function') {
			throw new Error('The last argument must be a function.');
		}
		const typeNames = args as TypeName[];
		const key = typeNames.join('-');
		if (ImpleMap.has(key)) {
			throw new Error(`Implementation for types (${typeNames.join(', ')}) already exists.`);
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
]>();	

func.addImple('string', 'string', (x, y) => {
	return x + y;
});

func.addImple('number', (x) => {
	return x * 2;
});

func.addImple('object', (x) => {
	return x.age > 18;
});

func.addImple('number', 'function', (x, y) => {
	return y(x) + 2;
});

const r1 = func(10);
const r2 = func('hello', 'world');
const r3 = func({ name: 'Alice', age: 20 });
const r4 = func(10, (x) => x * 2);


console.log(r1, r2, r3, r4); // 20 'helloworld' true
