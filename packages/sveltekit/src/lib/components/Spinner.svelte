<script>
    export let description = "";
</script>

<div class="spinner-container">
    <p>{description}</p>
    <img src="/static/images/logo-beta.png" class="spinner" alt="Chargement en cours" />
</div>

<style>
    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }
    .spinner {
        width: 70px;
        animation: spinner 1.8s ease infinite;
    }
    .spinner-container {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
    }
</style>
