import type { UserDto } from "dto";
import adminService from "../../admin.service";
import RemoveUserModal from "./RemoveUserModal.svelte";
import authService from "$lib/resources/auth/auth.service";
import { action, data, modal } from "$lib/store/modal.store";
import type Store from "$lib/core/Store";
import { capitalizeFirstLetter } from "$lib/helpers/stringHelper";

export default class TableUsersController {
    private selectedUserId: undefined | string;
    public currentUser: UserDto | null;
    public users;

    constructor(usersStore: Store<UserDto[]>) {
        this.currentUser = authService.getCurrentUser();
        this.selectedUserId = undefined;
        this.users = usersStore;
    }

    displayModal(user: UserDto) {
        // @ts-expect-error UserDto's id should be string but api is not ready for this
        this.selectedUserId = user._id;
        data.set(user.email);
        modal.set(RemoveUserModal);
        action.set(() => this.deleteUser());
    }

    deleteUser = async () => {
        try {
            await adminService.deleteUser(this.selectedUserId);
            const index = this.users.value.findIndex(user => user._id === this.selectedUserId);
            this.users.value.splice(index, 1);
            // force child update by affecting a new array
            this.users.set([...this.users.value]);
        } catch {
            console.log("Something went wrong! Could not delete user...");
        }
        this.selectedUserId = undefined;
    };

    isUserDisabled(user: UserDto) {
        return user.email === this.currentUser?.email;
    }

    prettyUserRoles(user: UserDto) {
        return user.roles.map(r => capitalizeFirstLetter(r)).join(", ");
    }
}
