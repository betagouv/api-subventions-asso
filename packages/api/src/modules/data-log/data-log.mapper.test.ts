import { DataLogMapper } from "./data-log.mapper";
import { ProducerLogEntity } from "./entities/producerLogEntity";

describe("DataLog Mapper", () => {
    describe("overviewToDto", () => {
        it("should return dto", () => {
            const entity: ProducerLogEntity = {
                providerId: "providerId",
                lastIntegrationDate: new Date("2024-09-11"),
                firstIntegrationDate: new Date("2018-04-23"),
                lastCoverDate: new Date("2024-09-07"),
            };

            const actual = DataLogMapper.overviewToDto(entity);
            expect(actual).toMatchSnapshot();
        });
    });
});
