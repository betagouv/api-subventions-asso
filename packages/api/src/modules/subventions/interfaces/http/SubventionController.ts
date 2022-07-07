import { Controller, Get, Route, Security, Tags, Response } from 'tsoa';
import subventionsService from '../../subventions.service';
import { GetSubventionResponseDto } from '@api-subventions-asso/dto';
import { ErrorResponse } from "@api-subventions-asso/dto/shared/ResponseStatus";

@Route("/subvention")
@Security("jwt")
@Tags("Subvention Controller")
export class SubventionController extends Controller {
    @Get("/{id}")
    @Response<ErrorResponse>("404")
    async getDemandeSubventionById(id: string): Promise<GetSubventionResponseDto> {
        try {
            const subvention = await subventionsService.getDemandeById(id);
            if (subvention) return { success: true, subvention };
            this.setStatus(404);
            return {
                success: false,
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