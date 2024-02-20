<script lang="ts">
    import { MainInfoBannerController } from "./MainInfoBanner.controller";
    import InformationBanner from "$lib/dsfr/InformationBanner.svelte";

    let ctrl = new MainInfoBannerController();
</script>

<InformationBanner
    startTitle={ctrl.startTitle}
    endTitle={ctrl.endTitle}
    linkLabel={ctrl.linkLabel}
    linkUrl={ctrl.linkUrl}
    closeBtn={true}
    closeLabel={ctrl.closeMsg} />
