import { createOverloadedFunction, createExtendType } from '../lib';

const func = createOverloadedFunction<[
  () => void,
  (a: string) => string,
  (a: number, b: number) => boolean
]>();
func.addImple('string', (a) => {
  return a;
});
func.addImple('number', 'number', (a, b) => {
  return a > b;
});
func.addImple(() => {
  console.log('no args');
});

func();
