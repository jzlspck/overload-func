import type {
 	FunctionType,
 	Equal,
	LooseEqual,
 	FuncTupleToIntersection
} from "./interface";

type TypeMap = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	undefined: undefined;
	symbol: symbol;
	bigint: bigint;
	function: Function;
	object: object;
}

type TypeName = keyof TypeMap;

// 将类型名称数组转换为对应的类型数组
type TypeNameToType<T extends TypeName[]> = {
	[K in keyof T]: T[K] extends TypeName ? TypeMap[T[K]] : never;
}
// 从函数类型数组中挑选出参数类型与给定类型名称数组匹配的函数类型
type PickMatchingFunctions<TN extends TypeName[], TF extends FunctionType[]> =
	TF extends [infer F, ...infer R]
  	? F extends FunctionType
		  ? LooseEqual<Parameters<F>, TypeNameToType<TN>> extends true
			  ? F
				: PickMatchingFunctions<TN, R extends FunctionType[] ? R : []>
			: never
		: never;

type AddImpleParams<TN extends TypeName[], T extends FunctionType[]> = [...args: TN, callback: PickMatchingFunctions<TN, T>];

interface IAddImple<T extends FunctionType[]> {
	addImple<TN extends TypeName[]>(...args: AddImpleParams<TN, T>): void;
}

export function createOverloadedFunction<T extends FunctionType[] = []>() {
	const ImpleMap: Map<string, T[number]> = new Map();

  const result = function(...args: any[]) {    
		const argsKey = args.map(arg => {
			const type = typeof arg;
			if (type === 'object' && arg === null) {
				return 'null';
			}
			return type;
		}).join('-');
		const imple = ImpleMap.get(argsKey);
		if (!imple) {
			throw new Error(`No implementation found for argument types: (${argsKey.split('-').join(', ')})`);
		}
		return imple(...args);
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

const r1 = func(10);
const r2 = func('hello', 'world');
const r3 = func({ name: 'Alice', age: 20 });

console.log(r1, r2, r3); // 20 'helloworld' true
