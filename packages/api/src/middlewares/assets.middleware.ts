import path from "path";
import express from "express";

export const assetsMiddleware = express.static(path.resolve(__dirname, "../assets"));
