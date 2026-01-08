export class ErrorAlertContent {
    title: string;
    message: string;

    constructor(
        title: string = "Un incident technique est survenu.",
        message: string = "Merci de réessayer ultérieurement. Si le problème continue, vous pouvez recharger la page ou contacter notre support via Crisp.",
    ) {
        this.title = title;
        this.message = message;
    }
}
