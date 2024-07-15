<script lang="ts">
    import { MainInfoBannerController } from "./MainInfoBanner.controller";
    import InformationBanner from "$lib/dsfr/InformationBanner.svelte";

    let ctrl = new MainInfoBannerController();
</script>

<!-- TODO clean in #2544 -->
<div class="custom-notice-container">
    <InformationBanner bind:this={ctrl.component} on:close={() => ctrl.close()} closeBtn={true}>
        <!-- ok because not from user input and only defined once in controller -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html ctrl.title}
    </InformationBanner>
</div>

<style>
    .custom-notice-container :global(.fr-notice) {
        background-color: var(--background-alt-green-archipel);

        --idle: transparent;
        --hover: var(--background-alt-green-archipel-hover);
        --active: var(--background-contrast-info-active);
        color: var(--background-flat-green-archipel);
    }

    .custom-notice-container :global(.fr-notice__body::before) {
        background-image: none;
    }
</style>
