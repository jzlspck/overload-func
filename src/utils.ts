import type { InstanceTypes, TypeName } from "./interface";

export const complexTypes = {
  date: Date,
  map: Map,
  set: Set,
  weakmap: WeakMap,
  weakset: WeakSet,
  regexp: RegExp,
  promise: Promise,
  error: Error
} as const;

export function getTypeName<T extends ConstructableRecord>(arg: any, extendType?: T): TypeName<InstanceTypes<T>> {
  // 数组
  if (Array.isArray(arg)) {
    return 'array';
  }
  // 一些内置复杂类型
  const mergedTypes = { ...extendType, ...complexTypes };
  for (const k in mergedTypes) {
    if (arg instanceof mergedTypes[k as keyof typeof mergedTypes]) {
      return k as keyof typeof mergedTypes;
    }
  }
	const type = typeof arg;
  // null
	if (type === 'object' && arg === null) {
		return 'null';
	}
  // 其他类型
	return type;
}

export function getTypeNames<T extends ConstructableRecord>(args: any[], extendType?: T): TypeName<InstanceTypes<T>>[] {

	return args.map(arg => getTypeName(arg, extendType));
}

type DisabledKeys<T, K extends string> = {
	[P in keyof T]: P extends K ? never : T[P];
}
type Constructable = new (...args: any[]) => any;
export type ConstructableRecord = Record<string, Constructable>;
// 用于标记拓展类型的符号，强制使用 createExtendType 创建拓展类型
export const extendTypeSymbol = Symbol('extendType');

export function createExtendType<T extends ConstructableRecord>(options: DisabledKeys<T, TypeName>): T & { [extendTypeSymbol]: true } {
	Object.defineProperty(options, extendTypeSymbol, {
		enumerable: false,
		configurable: false,
		writable: false,
		value: true
	});
	return options as T & { [extendTypeSymbol]: true };
}
