import { ObjectId } from "mongodb";
import UserDbo from "../../../../src/modules/user/repositories/dbo/UserDbo";

export default [
    {
        _id: new ObjectId("53bbd9a8e7aced4438f308e0"),
        active: true,
        email: "vs@beta.gouv.fr",
        hashPassword: "fakeHash",
        jwt: {
            token: "fakeToken",
            expirateDate: new Date("2022-12-03T09:26:13.286Z"),
        },
        roles: ["user"],
        signupAt: new Date("2021-11-15T09:58:30.525Z"),
    },
    {
        _id: new ObjectId("618cc12530ac8003a603ad47"),
        active: true,
        email: "ab@beta.gouv.fr",
        hashPassword: "fakeHash",
        jwt: {
            token: "fakeToken",
            expirateDate: new Date("2022-12-08T14:32:56.558Z"),
        },
        roles: ["user"],
        signupAt: new Date("2022-04-15T10:03:04.220Z"),
        stats: {
            searchCount: 82,
            lastSearchDate: new Date("2022-12-06T14:32:09.993Z"),
        },
    },
    {
        _id: new ObjectId("01f3ea10970ea88ca06fe8b6"),
        active: true,
        email: "lp@beta.gouv.fr",
        hashPassword: "fakeHash",
        jwt: {
            token: "fakeToken",
            expirateDate: new Date("2022-12-08T14:56:24.442Z"),
        },
        roles: ["user", "admin"],
        signupAt: new Date("2022-11-15T10:03:14.766Z"),
        stats: {
            searchCount: 258,
            lastSearchDate: new Date("2022-12-06T14:56:24.440Z"),
        },
    },
    {
        _id: new ObjectId("a67eeadb7b8700c18d6dfe3a"),
        active: true,
        email: "msm@beta.gouv.fr",
        hashPassword: "fakeHash",
        jwt: {
            token: "fakeToken",
            expirateDate: new Date("2022-12-14T14:19:31.440Z"),
        },
        roles: ["user"],
        signupAt: new Date("2022-11-15T10:10:12.663Z"),
        stats: {
            searchCount: 29,
            lastSearchDate: new Date("2022-12-12T14:16:59.378Z"),
        },
    },
    {
        _id: new ObjectId("f0f3c8730ff45c85251d20eb"),
        active: true,
        email: "mg@beta.gouv.fr",
        hashPassword: "fakeHash",
        jwt: {
            token: "fakeToken",
            expirateDate: new Date("2022-12-08T14:50:36.448Z"),
        },
        roles: ["user", "admin"],
        signupAt: new Date("2022-11-15T10:14:11.922Z"),
        stats: {
            searchCount: 74,
            lastSearchDate: new Date("2022-12-06T14:50:33.779Z"),
        },
    },
    {
        _id: new ObjectId("7c8a840bf876d114d64cd419"),
        active: true,
        email: "am@beta.gouv.fr",
        hashPassword: "fakeHash",
        jwt: {
            token: "fakeToken",
            expirateDate: new Date("2022-12-11T13:20:22.157Z"),
        },
        roles: ["user", "admin"],
        signupAt: new Date("2022-12-06T14:18:22.029Z"),
        stats: {
            searchCount: 74,
            lastSearchDate: new Date("2022-12-09T13:20:22.125Z"),
        },
    },
    {
        _id: new ObjectId("f7901ca30e03a02b680b87ce"),
        active: true,
        email: "aa@beta.gouv.fr",
        hashPassword: "fakeHash",
        jwt: {
            token: "fakeToken",
            expirateDate: new Date("2022-12-24T07:45:04.374Z"),
        },
        roles: ["user", "admin"],
        signupAt: new Date("2022-12-14T11:17:45.953Z"),
        stats: {
            searchCount: 16,
            lastSearchDate: new Date("2022-12-16T16:05:54.145Z"),
        },
    },
] as UserDbo[];
