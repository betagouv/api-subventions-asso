import { Request } from "express";
import UserDto from "@api-subventions-asso/dto/user/UserDto";

export function isRequestFromAdmin(req: Request) {
    if (!req.user) return false;
    const user = req.user as UserDto;
    return user?.roles?.includes("admin") || false;
}

export function getJtwTokenFromRequest(req: Request): string | null {
    return (req?.headers["x-access-token"] as string) || (req?.query.token as string) || null;
}
