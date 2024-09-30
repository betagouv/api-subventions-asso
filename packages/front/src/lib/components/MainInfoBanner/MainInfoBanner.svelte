<script lang="ts">
    import { MainInfoBannerController } from "./MainInfoBanner.controller";
    import InformationBanner from "$lib/dsfr/InformationBanner.svelte";

    let ctrl = new MainInfoBannerController();
</script>

<!-- TODO clean in #2544 -->
<div class="custom-notice-container">
    <InformationBanner
        bind:this={ctrl.component}
        on:close={() => ctrl.close()}
        closeBtn={true}
        title={ctrl.title}
        desc={ctrl.description}
        url={ctrl.url}
        urlLabel={ctrl.urlLabel} />
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
