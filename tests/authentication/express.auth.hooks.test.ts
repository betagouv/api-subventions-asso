/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport"
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import userService from "../../src/modules/user/user.service";
import { authMocks } from '../../src/authentication/express.auth.hooks';
import { ObjectId } from "mongodb";

describe("express.auth.hooks", () => {
    let passportMock: jest.SpyInstance;
    beforeEach(() => {
        passportMock = jest.spyOn(passport, "use");
        jest.resetModules();

        Object.keys(require.cache).forEach(function(key) {
            delete require.cache[key];
        }); 
    });

    afterEach(() => {
        passportMock.mockReset();
    })

    describe("local", () => {
        it("Should be logged user", (done) => {
            const obj:  {[key: string]: unknown} = {}
            function strat(data:unknown, call: unknown){
                obj.data = data;
                obj.callback = call;
            } 

            jest.spyOn(passportLocal, "Strategy").mockImplementation(strat as any);
            jest.spyOn(userService, 'login').mockImplementation((email) => Promise.resolve({success: true, user: { email, roles: [], active: true, jwt: { token: "", expirateDate: new Date()}}}) )
            
            passportMock.mockImplementation((name) => {
                if (name != "login") return;

                (obj.callback as (...args: unknown[]) => void)("test@beta.gouv.fr", "AAA", (...args: unknown[]) => {
                    expect(args[1]).toMatchObject({ email: "test@beta.gouv.fr"});
                    done();
                })
            });

            authMocks();
        });

        it("Should be not logged user", (done) => {
            const obj:  {[key: string]: unknown} = {}
            function strat(data:unknown, call: unknown){
                obj.data = data;
                obj.callback = call;
            } 

            jest.spyOn(passportLocal, "Strategy").mockImplementation(strat as any);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            jest.spyOn(userService, 'login').mockImplementation((email) => Promise.resolve({success: false, message: "ERROR", code: 1}) )
            
            passportMock.mockImplementation((name) => {
                if (name !== "login") return;
                (obj.callback as (...args: unknown[]) => void)("test@beta.gouv.fr", "AAA", (...args: unknown[]) => {
                    expect(args[2]).toMatchObject({ message: 'ERROR'});
                    done();
                })
            });
            authMocks();
        });
    })

    describe("jwt", () => {
        it("Should be logged user", (done) => {
            const obj:  {[key: string]: unknown} = {}
            function strat(data:unknown, call: unknown){
                obj.data = data;
                obj.callback = call;
            } 

            jest.spyOn(passportJwt, "Strategy").mockImplementation(strat as any);
            jest.spyOn(userService, 'findByEmail').mockImplementationOnce((email) => Promise.resolve({ email, roles: [], active: true, jwt: { token: "", expirateDate: new Date()}, _id: new ObjectId()}) )
            
            passportMock.mockImplementation((name) => {
                if (name === "login") return;

                (obj.callback as (...args: unknown[]) => void)({email: "test@beta.gouv.fr"}, (...args: unknown[]) => {
                    expect(args[1]).toMatchObject({ email: "test@beta.gouv.fr"});
                    done();
                })
            });

            authMocks();
        });

        it("Should be not logged user", (done) => {
            const obj:  {[key: string]: unknown} = {}
            function strat(data:unknown, call: unknown){
                obj.data = data;
                obj.callback = call;
            } 

            jest.spyOn(passportJwt, "Strategy").mockImplementation(strat as any);
            
            passportMock.mockImplementation((name) => {
                if (name === "login") return;
                (obj.callback as (...args: unknown[]) => void)({email: "test@beta.gouv.fr"}, (...args: unknown[]) => {
                    expect(args[2]).toMatchObject({ message: 'User not found'});
                    done();
                })
            });
            authMocks();
        });
    })
})