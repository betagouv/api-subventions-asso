/* eslint-disable @typescript-eslint/no-explicit-any */

function factoryDecorator(method: "POST" | "GET" | "PUT" | "DELETE", route: string, securityRoles: string[] = []) {
    return function (target: any, propertyKey: string) {
        if (!target["__methods__"]) target["__methods__"] = [];
        target["__methods__"].push({
            method,
            route: route,
            function: target[propertyKey] as unknown,
            securityRoles,
        });
    };
}

export function Get(route: string, securityRoles: string[] = []) {
    return factoryDecorator("GET", route, securityRoles);
}

export function Post(route: string, securityRoles: string[] = []) {
    return factoryDecorator("POST", route, securityRoles);
}

export function Put(route: string, securityRoles: string[] = []) {
    return factoryDecorator("PUT", route, securityRoles);
}

export function Delete(route: string, securityRoles: string[] = []) {
    return factoryDecorator("DELETE", route, securityRoles);
}
