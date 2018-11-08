/**
 * Created by tony on 07/10/2018.
 */
import { ComparePredicate, Lazy, MatchOption } from './shared.types';

export const ifElse = <T, F>(expr: boolean, t: Lazy<T>, f: Lazy<F>) => (expr ? t() : f());
export const ifElseDefault = <T, F, D>(expr1: boolean, expr2: boolean, t: Lazy<T>, f: Lazy<F>, d: Lazy<D>) =>
  expr1 ? t() : expr2 ? f() : d();

export const head = <T>(array: T[]) => array[0];

export const tail = <T>(array: T[]) => array.slice(1);

export const matchOption = <T>(condt: boolean, out: Lazy<T>): MatchOption<T> => [condt, out];
export const condition = (option: MatchOption<any>) => option[0];
export const evaluation = <T>(option: MatchOption<T>) => option[1]();

export const cond = <T>(options: MatchOption<T>[]): T | undefined =>
  ifElse(
    !options.length,
    () => undefined,
    () => ifElse(condition(head(options)), () => evaluation(head(options)), () => cond(tail(options)))
  );
