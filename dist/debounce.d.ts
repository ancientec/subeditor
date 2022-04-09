declare const debounce: <F extends (...args: any) => any>(func: F, wait?: number) => (...args: Parameters<F>) => ReturnType<F>;
export default debounce;
