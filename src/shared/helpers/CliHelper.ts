export function printProgress(progress: number, total: number) {
    if (process && process.stdout && process.stdout.clearLine) { // If false we are on github actions
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${progress} entities save of ${total}`);
    }
}