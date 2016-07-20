import { Promise } from 'es6-promise';
declare function unthenify<U>(fn: () => Promise<U>): (cb: unthenify.Callback<U>) => any;
declare function unthenify<T1, U>(fn: (a: T1) => Promise<U>): (a: T1, cb: unthenify.Callback<U>) => any;
declare function unthenify<T1, T2, U>(fn: (a: T1, b: T2) => Promise<U>): (a: T1, b: T2, cb: unthenify.Callback<U>) => any;
declare function unthenify<T1, T2, T3, U>(fn: (a: T1, b: T2, c: T3) => Promise<U>): (a: T1, b: T2, c: T3, cb: unthenify.Callback<U>) => any;
declare function unthenify<T1, T2, T3, T4, U>(fn: (a: T1, b: T2, c: T3, d: T4) => Promise<U>): (a: T1, b: T2, c: T3, d: T4, cb: unthenify.Callback<U>) => any;
declare function unthenify<T1, T2, T3, T4, T5, U>(fn: (a: T1, b: T2, c: T3, d: T4, e: T5) => Promise<U>): (a: T1, b: T2, c: T3, d: T4, e: T5, cb: unthenify.Callback<U>) => any;
declare function unthenify<T1, T2, T3, T4, T5, T6, U>(fn: (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6) => Promise<U>): (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6, cb: unthenify.Callback<U>) => any;
declare namespace unthenify {
    type Callback<T> = (error: Error, result: T) => any;
}
export = unthenify;
