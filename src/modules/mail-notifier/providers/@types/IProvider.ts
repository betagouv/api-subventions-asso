export default interface IProvider {
    sendMail(email: string, subject: string, html: string, text: string): Promise<boolean>
}