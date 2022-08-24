export default class PhoneHelper {
    static formatWithSpace(phone: string) {
        if (!phone) return phone;

        const phoneNormalized = phone.replace(/\D/g, "");

        return phoneNormalized.match(/.{1,2}/g)?.join(" ");
    }
}
