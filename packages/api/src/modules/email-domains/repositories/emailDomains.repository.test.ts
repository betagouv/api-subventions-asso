import db from "../../../shared/MongoConnection";
import { EmailDomainsRepository } from "./emailDomains.repository";

// Pour s'assurer de mock tous les accès à la collection;
jest.mock("../../../shared/MongoConnection");

describe("emailDomainsRepository", () => {
    const DOMAIN = "@kalimdor.zog";
    const repository = new EmailDomainsRepository();
    const insertOneSpy = jest.fn();
    const findSpy = jest.fn(() => ({ toArray: jest.fn() }));
    const findOneSpy = jest.fn(() => DOMAIN);

    beforeAll(() => {
        //@ts-expect-error mocking
        repository.collection = {
            insertOne: insertOneSpy,
            find: findSpy,
            findOne: findOneSpy
        };
    });

    describe("add", () => {
        it("should call insertOne() on collection", () => {
            repository.add(DOMAIN);
            expect(insertOneSpy).toHaveBeenCalledWith({ domain: DOMAIN });
        });
    });

    describe("findOne", () => {
        it("should call find with given domain", () => {
            repository.findOne(DOMAIN);
            expect(findOneSpy).toHaveBeenCalledWith({ domain: DOMAIN });
        });
    });

    describe("findAll", () => {
        it("should call find with empty object", () => {
            repository.findAll();
            expect(findSpy).toHaveBeenCalledWith({});
        });
    });
});
