import requestsService from "$lib/services/requests.service";

export class AdminService {
    async getUsers() {
        const path = `/user/admin/list-users`;
        return requestsService.get(path).then(result => {
            return result.data.users;
        });
    }

    async deleteUser(userId) {
        const path = `/user/admin/user/${userId}`;
        return requestsService.delete(path).then(result => {
            return result.status == 204;
        });
    }

    async create(email) {
        const path = `/user/admin/create-user`;
        return requestsService.post(path, { email }).then(result => {
            return result.status == 201;
        });
    }

    async getUserDomaines() {
        const getDomainName = user => user.email.match(/@.+/)?.toString();
        const createDomain = (domainsMap, name) => domainsMap.set(name, { name: name, users: [], totalActive: 0 });
        const sortDomainsByUserNumber = (domainA, domaineB) => domaineB.users.length - domainA.users.length;
        const getDomain = (domainsMap, name) => {
            if (!domainsMap.has(name)) createDomain(domainsMap, name);
            return domainsMap.get(name);
        };

        const insertUserInDomain = (domain, user) => {
            if (user.active) domain.totalActive++;
            domain.users.push(user);
        };

        const aggregateUsersByDomain = (domainsMap, user) => {
            const domainName = getDomainName(user);
            if (!domainName) return domainsMap;

            const domain = getDomain(domainsMap, domainName);
            insertUserInDomain(domain, user);

            return domainsMap;
        };

        const users = await this.getUsers();
        return [...users.reduce(aggregateUsersByDomain, new Map()).values()].sort(sortDomainsByUserNumber);
    }

    async addDomain(domain) {
        const path = `/config/domains`;
        return requestsService.post(path, { domain }).then(result => {
            return result.status == 201;
        });
    }
}

const adminService = new AdminService();

export default adminService;
