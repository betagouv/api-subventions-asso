export function waitPromise(timeMS: number) {
    return new Promise((resolve) => setTimeout(resolve, timeMS));
}