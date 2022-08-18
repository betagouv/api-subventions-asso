import { Response } from "express";
export default interface SSEResponse extends Response {
    sendSSEData: (data:unknown) => void
}