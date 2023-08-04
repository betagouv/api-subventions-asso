export function isAdmin(user) {
    return user?.roles?.includes("admin");
}
