import path from "path";
import express from "express";

export const AssetsMiddleware = express.static(path.resolve(__dirname, "../assets"));
