export class ErrorAlertContent {
    title: string;
    message: string;

    constructor(
        title: string = "Un incident technique est survenu.",
        message: string = "Merci de réessayer ultérieurement. Si le problème persiste, vous pouvez recharger la page ou contacter notre support via la bulle de chat.",
    ) {
        this.title = title;
        this.message = message;
    }
}
