<script lang="ts">
    import AuthController from "./Auth.controller";
    interface Props {
        children?: import("svelte").Snippet;
    }

    let { children }: Props = $props();
    const controller = new AuthController();
    const { show } = controller;
    controller.init();
</script>

<div>
    {#if $show}
        {@render children?.()}
    {/if}
</div>
