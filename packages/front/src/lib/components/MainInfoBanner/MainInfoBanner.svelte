<script lang="ts">
    import { MainInfoBannerController } from "./MainInfoBanner.controller";
    import InformationBanner from "$lib/dsfr/InformationBanner.svelte";

    let ctrl = new MainInfoBannerController();
</script>

<InformationBanner bind:this={ctrl.component} on:click={() => ctrl.close()} closeBtn={true}>
    <!-- ok because not from user input and only defined once in controller -->
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html ctrl.title}
</InformationBanner>
