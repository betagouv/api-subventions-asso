// @TODO: remove this use
export enum RoleEnum {
    admin = "admin",
    user = "user",
    consumer = "consumer",
}

// best practice to not use enum and this is the new way
export const UserRoles = { ADMIN: "admin", CONSUMER: "consumer", USER: "user" } as const;
export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];
