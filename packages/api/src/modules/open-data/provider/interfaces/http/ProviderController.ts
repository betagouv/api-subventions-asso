import { Controller, Get, Route } from 'tsoa';
import ProvidersInfos from '../../entities/ProvidersInfos';
import providerService from '../../provider.service';

@Route("open-data/providers")
export class ProviderController extends Controller {
    @Get("/")
    async getProvidersInfos(): Promise<ProvidersInfos> {
        return await providerService.getProvidersInfos();
    }
}