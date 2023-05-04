const MAX_ANNOUCEMENT_NUMBER_SIZE = 5;

export default class AnnouncementController {
    constructor(announcement) {
        this.announcement = announcement;
        this.bodaccType = this.announcement.id.substring(0, 1);
        this.bodaccNumber = this.announcement.id.substring(1, 9);
        this.announcementNumber = this.announcement.id.slice(9);
        this.judgmentObj = JSON.parse(this.announcement.jugement);
    }

    get judgment() {
        return this.judgmentObj.complementJugement;
    }

    get url() {
        return `https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:${this.announcement.id}`;
    }

    get publicationFile() {
        const year = this.bodaccNumber.substring(0, 4);
        return `https://www.bodacc.fr/telechargements/COMMERCIALES/PDF/${this.bodaccType}/${year}/${
            this.bodaccNumber
        }/1/BODACC_A_PDF_Unitaire_${this.bodaccNumber}_${this.announcementNumber.padStart(
            MAX_ANNOUCEMENT_NUMBER_SIZE,
            "0",
        )}.pdf`;
    }
}
