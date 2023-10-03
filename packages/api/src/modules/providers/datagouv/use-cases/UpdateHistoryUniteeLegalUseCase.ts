import DecompressHistoryUniteeLegalUseCase from "./DecompressHistoryUniteeLegalUseCase";
import DownloadHistoryUniteeLegalUseCase from "./DownloadHistoryUniteeLegalUseCase";
import ParseHistoryUniteeLegalUseCase from "./ParseHistoryUniteeLegalUseCase";

export default async function UpdateHistoryUniteeLegalUseCase() {
    const archivePath = await DownloadHistoryUniteeLegalUseCase();
    const filePath = await DecompressHistoryUniteeLegalUseCase(archivePath);
    await ParseHistoryUniteeLegalUseCase(filePath, new Date());
}
