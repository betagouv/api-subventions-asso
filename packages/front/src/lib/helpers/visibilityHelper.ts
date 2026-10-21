export function waitElementIsVisible(element, percentage = 50) {
    return new Promise(resolve => {
        const intersectionObserverSupport =
            "IntersectionObserver" in window &&
            "IntersectionObserverEntry" in window &&
            "intersectionRatio" in window.IntersectionObserverEntry.prototype;

        if (!intersectionObserverSupport) return resolve(true);

        function intersect(entries) {
            if (!entries[0].isIntersecting) return;

            observer.unobserve(element.parentElement);
            resolve(true);
        }

        const observer = new IntersectionObserver(intersect, {
            threshold: percentage / 100,
        });
        observer.observe(element.parentElement);
    });
}
