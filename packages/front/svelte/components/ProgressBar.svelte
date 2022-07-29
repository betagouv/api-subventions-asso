<script>
    export let percent = 0;
</script>

<div class="progress-bar">
    <span class="bar">
        <span class="progress" style="width: {percent}%" />
    </span>
</div>

<style>
    .progress-bar {
        border-radius: 60px;
        overflow: hidden;
        width: 100%;
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
