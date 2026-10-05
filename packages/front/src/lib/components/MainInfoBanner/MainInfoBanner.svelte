<script lang="ts">
    import { MainInfoBannerController } from "./MainInfoBanner.controller";
    import InformationBanner from "$lib/dsfr/InformationBanner.svelte";
    import type { Component } from "svelte";

    const ctrl = $state(new MainInfoBannerController());
    const { mainInfoBanner } = ctrl;
    const promise = ctrl.init();
    let component: Component | undefined = $state();

    $effect(() => {
        ctrl.component = component;
    });
</script>

<div class="custom-notice-container">
    {#await promise then}
        {#if $mainInfoBanner.title || $mainInfoBanner.desc}
            <InformationBanner
                bind:this={component}
                onclose={() => ctrl.close()}
                closeBtn={true}
                title={$mainInfoBanner.title}
                desc={$mainInfoBanner.desc} />
        {/if}
    {/await}
</div>

<style>
    .custom-notice-container :global(.fr-notice) {
        background-color: var(--background-alt-green-archipel);

        --idle: transparent;
        --hover: var(--background-alt-green-archipel-hover);
        --active: var(--background-contrast-info-active);
        color: var(--background-flat-green-archipel);
    }
</style>
