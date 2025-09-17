import type {
 	FT,
	TypeName,
	IOverloadFunction,
	InstanceTypes
} from "./interface";
import { getTypeNames, createExtendType } from "./utils";
import { extendTypeSymbol } from "./utils";

interface IParams<T> {
	// 允许多个实现
	allowMultiple?: boolean;
	// 允许拓展类型
	extendType?: T;
}

export function createOverloadedFunction<T extends FT[], E extends ReturnType<typeof createExtendType>>(options: IParams<E> = {}) {
	const { allowMultiple = false, extendType } = options;

	// 拓展类型，但是没有使用 createExtendType 创建
	if (extendType && !extendType[extendTypeSymbol]) {
		console.warn('Warning: The extendType should be created using createExtendType for proper functionality.');
	}

	const ImpleMap: Map<string, T[number]> = new Map();

	const result = function(...args: any[]) {  
		const argsKey = getTypeNames(args, extendType).join('-');
		const imple = ImpleMap.get(argsKey);
		if (!imple) {
			throw new Error(`No implementation found for argument types: (${argsKey.split('-').join(', ')})`);
		}
		return imple.apply(this, args);
	} as IOverloadFunction<T, InstanceTypes<E>>;

	result.addImple = function(...args) {
		const callback = args.pop() as T[number];
		if (typeof callback !== 'function') {
			throw new Error('The last argument must be a function.');
		}
		const typeNames = args as TypeName<InstanceTypes<E>>[];
		const key = typeNames.join('-');
		// 检查是否已经存在相同类型签名的实现
		if (ImpleMap.has(key)) {
			if (allowMultiple) {
		    // 允许多个实现
				const existingCallback = ImpleMap.get(key) as FT;
				const newCallback = function(...cbArgs: any[]) {
					existingCallback.apply(this, cbArgs);
					return callback.apply(this, cbArgs);
				};
				ImpleMap.set(key, newCallback as T[number]);
				return result;
			} else {
				throw new Error(`Implementation for types (${typeNames.join(', ')}) already exists.`);
			}
		}
		ImpleMap.set(key, callback);
		return result;
	}

  return result;
}