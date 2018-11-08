/**
 * Created by tony on 07/10/2018.
 */
export type Lazy<T> = () => T;
export type Predicate<T> = (t: T) => boolean;
export type ComparePredicate<T, U> = (t: T, u: U) => boolean;
export type MatchOption<T> = [boolean, Lazy<T>];
