import type { TypeName } from "./interface";

export function getTypeName(arg: any): TypeName {
	const type = typeof arg;
	if (type === 'object' && arg === null) {
		return 'null';
	}
	return type;
}

export function getTypeNames(args: any[]): TypeName[] {
	return args.map(arg => getTypeName(arg));
}