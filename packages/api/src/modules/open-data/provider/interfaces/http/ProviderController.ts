import { Controller, Get, Route, Tags } from 'tsoa';
import ProvidersInfos from '../../entities/ProvidersInfos';
import providerService from '../../provider.service';

@Route("open-data/providers")
@Tags("Open Data")
export class ProviderController extends Controller {
    @Get("/")
    async getProvidersInfos(): Promise<ProvidersInfos> {
        return await providerService.getProvidersInfos();
    }
}