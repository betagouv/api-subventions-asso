<script>
    export let title = "";
</script>

<div class="widget">
    <h2 class="widget__title">{title}</h2>
    <div>
        <slot />
    </div>
</div>

<style>
    .widget {
        display: flex;
        border: 1px solid #e5e5e5;
        flex-direction: column;
        padding: 20px;
    }

    .widget__title {
        margin-bottom: 24px;
    }
</style>
