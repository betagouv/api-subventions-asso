import scdlService from "../modules/providers/scdl/scdl.service";

export async function initAsync() {
    await scdlService.init();
}
