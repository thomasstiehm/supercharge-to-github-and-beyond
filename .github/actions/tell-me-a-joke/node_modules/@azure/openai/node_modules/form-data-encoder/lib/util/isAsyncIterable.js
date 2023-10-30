import { isFunction } from "./isFunction.js";
export const isAsyncIterable = (value) => (isFunction(value[Symbol.asyncIterator]));
