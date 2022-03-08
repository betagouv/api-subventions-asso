
export function Get(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target["__methods__"]) target["__methods__"] = []
        target["__methods__"].push({
            method: "GET",
            route: route,
            function: target[propertyKey] as any
        })
    };
}

export function Post(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target["__methods__"]) target["__methods__"] = []
        target["__methods__"].push({
            method: "POST",
            route: route,
            function: target[propertyKey] as any
        })
    };
}

export function Put(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target["__methods__"]) target["__methods__"] = []
        target["__methods__"].push({
            method: "PUT",
            route: route,
            function: target[propertyKey] as any
        })
    };
}

export function Delete(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target["__methods__"]) target["__methods__"] = []
        target["__methods__"].push({
            method: "DELETE",
            route: route,
            function: target[propertyKey] as any
        })
    };
}
