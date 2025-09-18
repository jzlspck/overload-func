import { createOverloadedFunction, createExtendType } from '../lib';

const func = createOverloadedFunction<[
  (a: string) => string,
]>();
func.addImple('string', (a) => {
  return a;
});

