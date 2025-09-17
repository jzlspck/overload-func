import type { InstanceTypes, TypeName } from "./interface";
export declare const complexTypes: {
    readonly date: DateConstructor;
    readonly map: MapConstructor;
    readonly set: SetConstructor;
    readonly weakmap: WeakMapConstructor;
    readonly weakset: WeakSetConstructor;
    readonly regexp: RegExpConstructor;
    readonly promise: PromiseConstructor;
    readonly error: ErrorConstructor;
};
export declare function getTypeName<T extends ConstructableRecord>(arg: any, extendType?: T): TypeName<InstanceTypes<T>>;
export declare function getTypeNames<T extends ConstructableRecord>(args: any[], extendType?: T): TypeName<InstanceTypes<T>>[];
type DisabledKeys<T, K extends string> = {
    [P in keyof T]: P extends K ? never : T[P];
};
type Constructable = new (...args: any[]) => any;
export type ConstructableRecord = Record<string, Constructable>;
export declare const extendTypeSymbol: unique symbol;
export declare function createExtendType<T extends ConstructableRecord>(options: DisabledKeys<T, TypeName>): T & {
    [extendTypeSymbol]: true;
};
export {};
