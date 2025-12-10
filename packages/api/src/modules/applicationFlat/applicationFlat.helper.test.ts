import { cursorToStream } from "./applicationFlat.helper";
import { Document, FindCursor } from "mongodb";
import { Readable } from "stream";

jest.mock("stream");

describe("cursorToStream", () => {
    const NODE_STREAM = {} as ReadableStream;
    const CURSOR = { stream: jest.fn(() => NODE_STREAM as ReadableStream) } as unknown as FindCursor;
    const ADAPTER = jest.fn();

    it("calls toWeb with stream from cursor", () => {
        cursorToStream(CURSOR, ADAPTER);
        expect(Readable.toWeb).toHaveBeenCalledWith(NODE_STREAM);
    });

    it("creates stream from cursor with adapter to transform it", () => {
        cursorToStream(CURSOR, ADAPTER);
        const transformMethod = jest.mocked(CURSOR.stream).mock.calls[0][0]!.transform as <T>(doc: T) => Document;
        const entity = { foo: "bar" };
        transformMethod(entity);
        expect(ADAPTER).toHaveBeenCalledWith(entity);
    });
});
