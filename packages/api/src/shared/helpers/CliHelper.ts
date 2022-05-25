export function printProgress(progress: number, total: number) {
    printAtSameLine(`${progress} entities save of ${total}`)
}

export function printAtSameLine(text: string) {
    if (process && process.stdout && process.stdout.clearLine) { // If false we are on github actions
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(text);
    } else {
        // Reactivate this to have more logs in CI
        // console.log(text);
    }
}