<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    export let users;
    let canvas;
    let chart;

    const numberOfUsers = users.filter(u => !u.roles.includes("admin")).length;
    const numberOfActiveUsers = users.filter(u => !u.roles.includes("admin") && u.active).length;
    const numberOfAdmin = users.filter(u => u.roles.includes("admin")).length;

    const notActived = numberOfUsers - numberOfActiveUsers;

    const stats = [notActived, numberOfActiveUsers, numberOfAdmin];

    onMount(() => {
        chart = new Chart(canvas, {
            type: "doughnut",
            option: {
                responsive: true,
            },
            data: {
                labels: ["Non Actif", "Actif", "Admin"],
                datasets: [
                    {
                        label: "Utilisateurs",
                        data: stats,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                        ],
                    },
                ],
            },
        });
    });
</script>

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-col fr-col-lg-12">
    <h2>Statistiques :</h2>
</div>
<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-6">
        <p data-value={numberOfUsers}>
            Il y a <b>
                {numberOfUsers}
            </b>
            utilisateurs inscrits (hors admin).
        </p>
        <p data-value={numberOfActiveUsers}>
            Dont <b>
                {numberOfActiveUsers}
            </b>
            ayant activé leur compte (hors admin).
        </p>
        <p data-value={numberOfAdmin}>
            Nombre d'administrateurs: <b>
                {numberOfAdmin}
            </b>
        </p>
    </div>
    <div class="fr-col fr-col-lg-5">
        <canvas bind:this={canvas} />
    </div>
</div>
