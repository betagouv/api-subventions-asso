
export default class CurrencyHelper {
    public static numberWithSpaces(currency: number) {
        return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}