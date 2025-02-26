import requestsService from "$lib/services/requests.service";

export class UserPort {
    BASE_PATH = "/user";

    deleteSelfUser() {
        return requestsService.delete(this.BASE_PATH);
    }

    async getSelfUser() {
        const res = await requestsService.get(`${this.BASE_PATH}/me`);
        return res.data;
    }

    getProfileFromData(data) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            agentType: data.agentType,
            jobType: data.jobType,
            service: data.service,
            phoneNumber: data.phoneNumber,
            structure: data.structure,
            decentralizedLevel: data.decentralizedLevel,
            decentralizedTerritory: data.decentralizedTerritory,
            territorialScope: data.territorialScope,
            registrationSrc: data.registrationSrc,
            registrationSrcEmail: data.registrationSrcEmail,
            registrationSrcDetails: data.registrationSrcDetails,
        };
    }

    updateProfile(data) {
        const updateProfile = this.getProfileFromData(data);
        return requestsService.patch(`${this.BASE_PATH}/`, updateProfile);
    }

    completeProfile(data) {
        const updateProfile = this.getProfileFromData(data);
        const completeProfile = {
            ...updateProfile,
            profileToComplete: false,
        };
        return requestsService.patch(`${this.BASE_PATH}/`, completeProfile);
    }
}

const userPort = new UserPort();
export default userPort;
