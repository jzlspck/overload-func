import type { TypeName } from "./interface";

export const complexTypes = {
  date: Date,
  map: Map,
  set: Set,
  weakmap: WeakMap,
  weakset: WeakSet,
  regexp: RegExp,
  error: Error
}

export function getTypeName(arg: any): TypeName {
  // 数组
  if (Array.isArray(arg)) {
    return 'array';
  }
  // 一些内置复杂类型
  for (const k in complexTypes) {
    if (arg instanceof complexTypes[k]) {
      return k as keyof typeof complexTypes;
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

export function getTypeNames(args: any[]): TypeName[] {
	return args.map(arg => getTypeName(arg));
}
