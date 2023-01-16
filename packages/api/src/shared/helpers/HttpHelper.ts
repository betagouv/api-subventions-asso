import { Request } from "express";
import UserDto from "@api-subventions-asso/dto/user/UserDto";

export function isRequestFromAdmin(req: Request) {
    if (!req.user) return false;
    const user = req.user as UserDto;
    return user?.roles?.includes("admin") || false;
}
