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

type A = TypeNameToType<['string', 'object']>;

type AddImpleParams<TN extends TypeName[], T extends FunctionType[]> = [...args: TN, callback: PickMatchingFunctions<TN, T>];

interface IAddImple<T extends FunctionType[]> {
	addImple<TN extends TypeName[]>(...args: AddImpleParams<TN, T>): void;
}

export function createOverloadedFunction<T extends FunctionType[] = []>() {

  const result = function(...args: any[]) {
    
  } as FuncTupleToIntersection<T> & IAddImple<T>;

	result.addImple = function(...args) {

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
