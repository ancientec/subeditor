const debounce = <F extends (...args: any) => any>(func: F, wait: number = 100) => {
    let timeout: ReturnType<typeof setTimeout>;
  
    const debounced = (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }
  
    return debounced as (...args: Parameters<F>) => ReturnType<F>;
}
export default debounce;