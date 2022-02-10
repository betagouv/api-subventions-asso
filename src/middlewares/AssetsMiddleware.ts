import express from "express";
import path from "path";

export const AssetsMiddleware = express.static(path.resolve(__dirname, '../assets'));