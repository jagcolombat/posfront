export type Lazy<T> = () => T;
export type Predicate<T> = (t: T) => boolean;
export type ComparePredicate<T, U> = (t: T, u: U) => boolean;
export type MatchOption<T> = [boolean, Lazy<T>];
