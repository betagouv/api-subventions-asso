export default interface UserDto {
    _id?: string,
    email: string,
    roles: string [],
    active: boolean,
    resetToken?: string,
    resetTokenDate?: Date
}