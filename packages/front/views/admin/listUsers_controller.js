import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
    static targets = [ "source" , "list", "view", "canvas", "stats" ];

    connect() {
        const [ registered, actived, admin ] = [...this.statsTarget.children].map(element => element.dataset.value);

        const notActived = registered - actived;

        const stats = [notActived, actived, admin]

        var myChart = new Chart(this.canvasTarget, {
            type: 'doughnut',
            option: {
                responsive: true,
            },
            data: {
                labels: ["Non Actif", "Actif", "Admin"],
                datasets: [{
                    label: 'Utilisateurs',
                    data: stats,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                    ]
                }]
            }
        });
    }

    valueChange() {
        const value = this.sourceTarget.value.toLowerCase();

        const orderedChilder = [...this.listTarget.children].sort((elementA, elementB) => {

            if (value.length <= 0) {
                return 1
            }

            return stringSimilarity.compareTwoStrings(value, elementB.children[0].textContent.toLowerCase()) 
                - stringSimilarity.compareTwoStrings(value, elementA.children[0].textContent.toLowerCase())
        })

        orderedChilder.forEach(node=>this.listTarget.appendChild(node));

        this.viewTarget.scrollTo(0,0);
    }
}