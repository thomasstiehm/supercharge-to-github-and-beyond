import { isAsyncIterable } from "./isAsyncIterable.js";
import { isFunction } from "./isFunction.js";
import { chunk } from "./chunk.js";
async function* readStream(readable) {
    const reader = readable.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        yield value;
    }
}
async function* chunkStream(stream) {
    for await (const value of stream) {
        yield* chunk(value);
    }
}
export const getStreamIterator = (source) => {
    if (isAsyncIterable(source)) {
        return chunkStream(source);
    }
    if (isFunction(source.getReader)) {
        return chunkStream(readStream(source));
    }
    throw new TypeError("Unsupported data source: Expected either ReadableStream or async iterable.");
};
