export default function debounceFactory(time) {
    let timer;
    return (cb) => {
        clearTimeout(timer);
        timer = setTimeout(cb, time);
    }
}
