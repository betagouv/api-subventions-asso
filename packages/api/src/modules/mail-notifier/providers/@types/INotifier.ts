export default interface INotifier {
    sendMail(email: string, subject: string, html: string, text: string): Promise<boolean>
}