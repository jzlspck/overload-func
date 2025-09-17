import { createOverloadedFunction } from '../lib';

const func = createOverloadedFunction<[
  (a: string) => string,
]>();
