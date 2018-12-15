import {MatchOption, Lazy, ComparePredicate} from './shared.types';


export const pipe = (...fns) => arg => fns.reduce((composed, f) => f(composed), arg);
export const ifElse = <T, F>(expr, t, f) => (expr ? t() : f());
export const ifElseDefault = <T, F, D>(expr1: boolean, expr2: boolean, t: Lazy<T>, f: Lazy<F>, d: Lazy<D>) =>
    expr1 ? t() : expr2 ? f() : d();

export const head = <T>(array: T[]) => array[0];

export const tail = <T>(array: T[]) => array.slice(1);

export const matchOption = <T>(condt: boolean, out: Lazy<T>): MatchOption<T> => [condt, out];
export const condition = (option: MatchOption<any>) => option[0];
export const evaluation = <T>(option: MatchOption<T>) => option[1]();

export const cond = <T>(options: MatchOption<T>[]): T | undefined => {
  return ifElse(!options.length, () => undefined,
    () => ifElse(condition(head(options)), () => evaluation(head(options)),
    () => cond(tail(options))));
};

export const filterArrayObjects = (
    objects: object[],
    filters: string[],
    vilidObjects: (targets: object[], filter: string) => object[]
) => filters.reduce((result, filter) => vilidObjects(result, filter), objects);

export const filterObjects = (compare: ComparePredicate<object, string>) => (targets: object[], filter: string) =>
    targets.filter(t => compare(t, filter));

export const objectSome = (compare: ComparePredicate<string, string>) => (target: object, filter: string) =>
    Object.keys(target).reduce(
        (result, key) => (result ? result : compare(target[key] ? target[key] : '', filter) ? true : false),
        false
    );
