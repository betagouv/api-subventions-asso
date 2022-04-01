/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId } from 'mongodb';
import IGisproRequestInformations from '../../../../../src/modules/providers/gispro/@types/IGisproRequestInformations';
import GisproRequestAdapter from '../../../../../src/modules/providers/gispro/adapters/GisproRequestAdapter';
import ProviderValue from '@api-subventions-asso/dto/shared/ProviderValue';
import GisproRequestEntity from '../../../../../src/modules/providers/gispro/entities/GisproRequestEntity';
import ILegalInformations from '../../../../../src/modules/search/@types/ILegalInformations';

describe('GisproRequestAdapter', () => {
    describe('toDemandeSubvention()', () => {
        it('should return data with specific properties', () => {
            const expected = {
                siret: {} as ProviderValue,
                service_instructeur: {} as ProviderValue,
                status: {} as ProviderValue,
                dispositif: {} as ProviderValue,
                sous_dispositif: {} as ProviderValue
            };
            const legalInformations = {} as ILegalInformations;
            const providerInformations = {} as IGisproRequestInformations;
            const data = {};
            const id = {} as ObjectId;
            const actual = GisproRequestAdapter.toDemandeSubvention(new GisproRequestEntity(legalInformations, providerInformations , data,  id));
            expect(Object.keys(actual)).toEqual(Object.keys(expected));
        })
    })
});