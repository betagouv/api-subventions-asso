import UserDto from "./UserDto";

export interface UserDataResetToken {
    _id: string;
    userId: string;
    token: string;
    createdAt: Date;
}

export interface UserDataConsumerToken {
    _id: string;
    userId: string;
    token: string;
}

export type UserDataToken = UserDataResetToken | UserDataConsumerToken;

export default interface AssociationVisit {
    associationIdentifier: string;
    userId: string;
    date: Date;
}

export interface UserDataDto {
    user: UserDto;
    tokens: UserDataToken[];
    logs: unknown[];
    statistics: {
        associationVisit: AssociationVisit[];
    };
}
