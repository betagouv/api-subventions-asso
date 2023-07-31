import AuthLevels from "$lib/resources/auth/authLevels";

export function load() {
    return { authLevel: AuthLevels.ADMIN };
}
