import { Controller, Get, Route, Security, Tags } from 'tsoa';
import subventionsService from '../../subventions.service';
import { GetDemandeSubventionResponseDto } from '@api-subventions-asso/dto';

@Route("/subvention")
@Security("jwt")
@Tags("Subvention Controller")
export class SubventionController extends Controller {
    @Get("/{id}")
    async getDemandeSubventionById(id: string): Promise<GetDemandeSubventionResponseDto>  {
        try {
            const subvention = await subventionsService.getDemandeById(id);
            if (subvention) return { success: true, subvention};
            this.setStatus(404);
            return {
                success: true,
                message: "Subvention not found"
            }
        } catch (e) {
            this.setStatus(404);
            return {
                success: false,
                message: (e as Error).message
            }
        }
       
    }
}