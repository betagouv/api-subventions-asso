export default class BodaccController {
    constructor(bodacc) {
        this.bodacc = bodacc;
    }

    get announcements() {
        return this.bodacc?.map(announcement => announcement.fields);
    }
}
