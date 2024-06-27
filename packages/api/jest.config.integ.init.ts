import miscScdlProducersRepository from "./src/modules/providers/scdl/repositories/miscScdlProducer.repository";

import { LOCAL_AUTHORITIES } from "./tests/dataProviders/db/__fixtures__/scdl.fixtures";

export async function initTests() {
    await miscScdlProducersRepository.create(LOCAL_AUTHORITIES[0]);
}
