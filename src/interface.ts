
export type FunctionType = (...args: any[]) => any;

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
// 宽松相等，继承也可以
export type LooseEqual<X, Y> = X extends Y ? true : Y extends X ? true : false;
  
export type TupleToIntersection<T extends readonly any[]> = T extends [infer F, ...infer R] ? TupleToIntersection<R> & F : unknown;

export type FuncTupleToIntersection<T extends FunctionType[]> = T extends [infer F, ...infer R] ? F extends FunctionType ? R extends FunctionType[] ? FuncTupleToIntersection<R> & F : F : never : unknown;

