import { ImportReport } from "../../../../@types/ImportReport";

export abstract class ImportPipeline {
    protected report: ImportReport = {
        parsedCount: 0,
        importedCount: 0,
        errorCount: 0, // no validation or format error here
    };

    constructor() {
        // This proxy makes run execution on the child class reset its report
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (prop !== "run") return Reflect.get(target, prop, receiver);

                return (...args: unknown[]) => {
                    target.report = {
                        parsedCount: 0,
                        importedCount: 0,
                        errorCount: 0, // no validation or format error here
                    };
                    return Reflect.apply(target.run, receiver, args);
                };
            },
        });
    }

    protected abstract run(filePath: string): Promise<ImportReport>;
}
