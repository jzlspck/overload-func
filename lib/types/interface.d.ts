import { complexTypes } from "./utils";
export type FT = (...args: any[]) => any;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
export type LooseEqual<X, Y> = Equal<Y, object> extends true ? X extends BaseType ? false : X extends Y ? true : false : X extends Y ? true : false;
type BaseType = Omit<TypeMap<{}>, 'object'> extends Record<string, infer V> ? V : never;
export type TupleEqual<X extends any[], Y extends any[]> = X extends [infer FX, ...infer RX] ? Y extends [infer FY, ...infer RY] ? LooseEqual<FX, FY> extends true ? TupleEqual<RX, RY> : false : false : Y extends [] ? true : false;
export type TupleToIntersection<T extends readonly any[]> = T extends [infer F, ...infer R] ? TupleToIntersection<R> & F : unknown;
export type FuncTupleToIntersection<T extends FT[]> = T extends [infer F, ...infer R] ? F extends FT ? R extends FT[] ? FuncTupleToIntersection<R> & F : F : never : unknown;
export type InstanceTypes<T extends Record<string, new (...args: any) => any>> = {
    [K in keyof T]: InstanceType<T[K]>;
};
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
type TypeNameToType<ET extends Record<string, any>, T extends TypeName<ET>[]> = {
    [K in keyof T]: T[K] extends TypeName<ET> ? TypeMap<ET>[T[K]] : never;
};
type PickMatchingFunctions<ET extends Record<string, any>, TN extends TypeName<ET>[], TF extends FT[]> = TF extends [infer F, ...infer R] ? F extends FT ? TupleEqual<Parameters<F>, TypeNameToType<ET, TN>> extends true ? F : PickMatchingFunctions<ET, TN, R extends FT[] ? R : []> : never : never;
type AddImpleParams<ET extends Record<string, any>, TN extends TypeName<ET>[], T extends FT[]> = [...args: TN, callback: PickMatchingFunctions<ET, TN, T>];
export interface IAddImple<T extends FT[], ET extends Record<string, any>> {
    addImple<TN extends TypeName<ET>[]>(...args: AddImpleParams<ET, TN, T>): IOverloadFunction<T, ET>;
}
export type IOverloadFunction<T extends FT[], ET extends Record<string, any>> = FuncTupleToIntersection<T> & IAddImple<T, ET>;
export {};
