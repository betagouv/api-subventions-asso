import DecompressHistoryUniteLegalUseCase from "./DecompressHistoryUniteLegalUseCase";
import DownloadHistoryUniteLegalUseCase from "./DownloadHistoryUniteLegalUseCase";
import ParseHistoryUniteLegalUseCase from "./ParseHistoryUniteLegalUseCase";

export default async function UpdateHistoryUniteLegalUseCase() {
    const archivePath = await DownloadHistoryUniteLegalUseCase();
    const filePath = await DecompressHistoryUniteLegalUseCase(archivePath);
    await ParseHistoryUniteLegalUseCase.run(filePath, new Date());
}
