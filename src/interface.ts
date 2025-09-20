import { complexTypes } from "./utils";

export type FT = (...args: any[]) => any;

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
// 宽松相等，继承也可以，但是其他复杂类型不能和 object 匹配
export type LooseEqual<X, Y> = Equal<Y, object> extends true
  ? 0
  : X extends Y ? true : false;

// 匹配两个元组类型，X 为函数签名参数类型，Y 为字符串映射的参数类型
export type TupleEqual<X extends any[], Y extends any[]> =
  X extends [infer FX, ...infer RX]
    ? Y extends [infer FY, ...infer RY]
      ? LooseEqual<FX, FY> extends true
        ? TupleEqual<RX, RY>
        : false
      : false
    : Y extends [] ? true : false;
  
export type TupleToIntersection<T extends readonly any[]> = T extends [infer F, ...infer R] ? TupleToIntersection<R> & F : unknown;

export type FuncTupleToIntersection<T extends FT[]> = T extends [infer F, ...infer R] ? F extends FT ? R extends FT[] ? FuncTupleToIntersection<R> & F : F : never : unknown;

// 获取类实例类型映射
export type InstanceTypes<T extends Record<string, new (...args: any) => any>> = {
  [K in keyof T]: InstanceType<T[K]>;
}
// 基本数据类型，以及一些其他内置复杂类型映射
type TypeMap<ET extends Record<string, any>> = ET & InstanceTypes<typeof complexTypes> & {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	undefined: undefined;
	symbol: symbol;
	bigint: bigint;
	function: Function;
	array: any[];
	object: object;
};

export type TypeName<ET extends Record<string, any> = {}> = keyof TypeMap<ET>;

// 将类型名称数组转换为对应的类型数组
type TypeNameToType<ET extends Record<string, any>, T extends TypeName<ET>[]> = {
	[K in keyof T]: T[K] extends TypeName<ET> ? TypeMap<ET>[T[K]] : never;
}
// 从函数类型数组中挑选出参数类型与给定类型名称数组匹配的函数类型
type PickMatchingFunctions<ET extends Record<string, any>, TN extends TypeName<ET>[], TF extends FT[]> =
	TF extends [infer F, ...infer R]
  	? F extends FT
		  ? TupleEqual<Parameters<F>, TypeNameToType<ET, TN>> extends true
			  ? F
				: PickMatchingFunctions<ET, TN, R extends FT[] ? R : []>
			: never
		: never;

type AddImpleParams<ET extends Record<string, any>, TN extends TypeName<ET>[], T extends FT[]> = [...args: TN, callback: PickMatchingFunctions<ET, TN, T>];

export interface IAddImple<T extends FT[], ET extends Record<string, any>> {
	addImple<TN extends TypeName<ET>[]>(...args: AddImpleParams<ET, TN, T>): IOverloadFunction<T, ET>;
}

export type IOverloadFunction<T extends FT[], ET extends Record<string, any>> = FuncTupleToIntersection<T> & IAddImple<T, ET>;
