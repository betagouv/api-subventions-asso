<script>
    import AuthController from "./Auth.controller";
    const controller = new AuthController();
    controller.init();
</script>

<div>
    <slot />
</div>
