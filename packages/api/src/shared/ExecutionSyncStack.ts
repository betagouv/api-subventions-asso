import { waitPromise } from "./helpers/WaitHelper";

interface OperationStackLine<EntityType, OperationResultType> {
    entity: EntityType;

    resolver: (result: OperationResultType) => void;

    rejecter: (e: unknown) => void;
}

export interface OperationExecutor<EntityType, OperationResultType> {
    (entity: EntityType): Promise<OperationResultType>;
}

export default class ExecutionSyncStack<EntityType, OperationResultType> {
    private inProgress = false;
    private stackLines: OperationStackLine<EntityType, OperationResultType>[] = [];

    constructor(
        private operationExecutor: OperationExecutor<EntityType, OperationResultType>,

        private waitIntervalMs: number = 0,
    ) {}

    addOperation(entity: EntityType): Promise<OperationResultType> {
        return new Promise((resolver, rejecter) => {
            this.stackLines.push({
                entity,
                rejecter,
                resolver,
            });

            this.executeOperations();
        });
    }

    private async executeOperations() {
        if (this.inProgress) return;
        this.inProgress = true;

        let operationLine: OperationStackLine<EntityType, OperationResultType> | undefined;
        while ((operationLine = this.stackLines.shift())) {
            if (!operationLine) continue; // It's just for TS, because while stops if operationLine is undefined
            try {
                const result = await this.operationExecutor(operationLine.entity);
                operationLine.resolver(result);
            } catch (e) {
                operationLine.rejecter(e);
            }
            if (this.waitIntervalMs) await waitPromise(this.waitIntervalMs);
        }
        this.inProgress = false;
    }
}
