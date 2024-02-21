<script lang="ts">
    import { MainInfoBannerController } from "./MainInfoBanner.controller";
    import InformationBanner from "$lib/dsfr/InformationBanner.svelte";

    let ctrl = new MainInfoBannerController();
</script>

<InformationBanner
    bind:this={ctrl.component}
    on:click={() => ctrl.close()}
    startTitle={ctrl.startTitle}
    endTitle={ctrl.endTitle}
    linkLabel={ctrl.linkLabel}
    linkUrl={ctrl.linkUrl}
    closeBtn={true} />
