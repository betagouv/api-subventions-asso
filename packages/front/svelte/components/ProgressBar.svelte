<script>
    export let percent = 0;
    export let loadingText = "";
</script>

<div class="text-container">
    <p>{loadingText}</p>
</div>
<div class="progress-container">
    <div class="progress-bar">
        <span class="bar">
            <span class="progress" style="width: {percent}%" />
        </span>
    </div>
    <img src="/static/images/logo-beta.png" class="spinner" alt="Chargement en cours" />
</div>

<style>
    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }
    .spinner {
        width: 2%;
        animation: spinner 1.8s ease infinite;
    }

    .progress-container,
    .text-container {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .progress-bar {
        border-radius: 60px;
        overflow: hidden;
        width: 97%;
    }

    .progress-bar span {
        display: block;
    }

    .bar {
        background: rgba(0, 0, 0, 0.075);
    }

    .progress {
        background: blue;
        color: #fff;
        padding: 5px;
        width: 0;
        transition: 0.4s linear;
    }
</style>
