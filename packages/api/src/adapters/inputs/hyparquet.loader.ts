/**
 * Mainly used to be able to mock dynamic import inside unit test
 * It is hard to mock dynamic - inline - import of ESM-only dependancy
 *
 * Loads every hyparquet and hyparquet-compressors methods needed
 * Update this as you expand the use of hyparquet through the project
 */
export async function loadHyparquet() {
    const { asyncBufferFromFile, parquetMetadataAsync, parquetReadObjects } = await import("hyparquet");
    const { compressors } = await import("hyparquet-compressors");
    return { asyncBufferFromFile, parquetMetadataAsync, parquetReadObjects, compressors };
}
