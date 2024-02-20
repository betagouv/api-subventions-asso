<script lang="ts">
    import { MainInfoBannerController } from "./MainInfoBanner.controller";
    import InformationBanner from "$lib/dsfr/InformationBanner.svelte";

    let component;
    let ctrl = new MainInfoBannerController(component);
</script>

<InformationBanner
    bind:this={component}
    on:click={() => component.$destroy()}
    startTitle={ctrl.startTitle}
    endTitle={ctrl.endTitle}
    linkLabel={ctrl.linkLabel}
    linkUrl={ctrl.linkUrl}
    closeBtn={true} />
