
export type FunctionType = (...args: any[]) => any;

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
// 宽松相等，继承也可以
export type LooseEqual<X, Y> = X extends Y ? true : Y extends X ? true : false;
  
export type TupleToIntersection<T extends readonly any[]> = T extends [infer F, ...infer R] ? TupleToIntersection<R> & F : unknown;

export type FuncTupleToIntersection<T extends FunctionType[]> = T extends [infer F, ...infer R] ? F extends FunctionType ? R extends FunctionType[] ? FuncTupleToIntersection<R> & F : F : never : unknown;


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

export type TypeName = keyof TypeMap;

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

export interface IAddImple<T extends FunctionType[]> {
	addImple<TN extends TypeName[]>(...args: AddImpleParams<TN, T>): FuncTupleToIntersection<T> & IAddImple<T>;
}