/* eslint-disable @typescript-eslint/no-explicit-any */
export function Get(route: string, securityRoles: string[] = []) {
    return function (target: any, propertyKey: string) {
        if (!target["__methods__"]) target["__methods__"] = [];
        target["__methods__"].push({
            method: "GET",
            route: route,
            function: target[propertyKey] as any,
            securityRoles
        });
    };
}

export function Post(route: string, securityRoles: string[] = []) {
    return function (target: any, propertyKey: string) {
        if (!target["__methods__"]) target["__methods__"] = [];
        target["__methods__"].push({
            method: "POST",
            route: route,
            function: target[propertyKey] as any,
            securityRoles
        });
    };
}

export function Put(route: string, securityRoles: string[] = []) {
    return function (target: any, propertyKey: string) {
        if (!target["__methods__"]) target["__methods__"] = [];
        target["__methods__"].push({
            method: "PUT",
            route: route,
            function: target[propertyKey] as any,
            securityRoles
        });
    };
}

export function Delete(route: string, securityRoles: string[] = []) {
    return function (target: any, propertyKey: string) {
        if (!target["__methods__"]) target["__methods__"] = [];
        target["__methods__"].push({
            method: "DELETE",
            route: route,
            function: target[propertyKey] as any,
            securityRoles
        });
    };
}
