import type { FT, IOverloadFunction, InstanceTypes } from "./interface";
import { createExtendType } from "./utils";
import { extendTypeSymbol } from "./utils";
interface IParams<T> {
    allowMultiple?: boolean;
    extendType?: T;
}
export declare function createOverloadedFunction<T extends FT[], E extends ReturnType<typeof createExtendType> = {
    [extendTypeSymbol]: true;
}>(options?: IParams<E>): IOverloadFunction<T, InstanceTypes<E>>;
export {};
