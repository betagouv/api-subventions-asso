const MAX_ANNOUCEMENT_NUMBER_SIZE = 5;

export default class AnnouncementController {
    constructor(announcement) {
        this.announcement = announcement;

        this.judgmentObj = JSON.parse(this.announcement.jugement);
    }

    get judgment() {
        return this.judgmentObj?.complementJugement || "-";
    }

    get url() {
        return `https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:${this.announcement.id}`;
    }

    get publicationFile() {
        const { bodaccType, bodaccId, announcementId } = this._splitId();
        const year = bodaccId.substring(0, 4);
        return `https://www.bodacc.fr/telechargements/COMMERCIALES/PDF/${bodaccType}/${year}/${bodaccId}/1/BODACC_A_PDF_Unitaire_${bodaccId}_${announcementId.padStart(
            MAX_ANNOUCEMENT_NUMBER_SIZE,
            "0",
        )}.pdf`;
    }

    _splitId() {
        return {
            // bodacc type (A or B)
            bodaccType: this.announcement.id.substring(0, 1),
            // bodacc id (8 characters, seems to be year + 4 digits)
            bodaccId: this.announcement.id.substring(1, 9),
            // announcement id (up to 5 digits)
            announcementId: this.announcement.id.slice(9),
        };
    }
}
