<script>
    import AuthController from "./Auth.controller";
    const controller = new AuthController();
    const { show } = controller;
    controller.init();
</script>

<div>
    {#if $show}
        <slot />
    {/if}
</div>
