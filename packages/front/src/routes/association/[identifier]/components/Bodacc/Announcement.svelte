<script>
    import AnnouncementController from "./Announcement.controller";
    import Callout from "$lib/dsfr/Callout.svelte";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";

    export let announcement;

    const controller = new AnnouncementController(announcement);
</script>

<div class="announcement">
    <Callout
        title={controller.announcement.familleavis_lib}
        titleSize="5"
        href={controller.url}
        labelAction="Voir l'annonce">
        <div>
            <p class="fr-text--lead fr-mb-2v">
                {controller.announcement.dateparution} - {controller.announcement.typeavis_lib}
            </p>
            <p class="fr-text--lead fr-mb-2v">
                <b>Annonce déposée au :</b>
                {controller.announcement.tribunal}
            </p>
            <p class="fr-text--lead fr-mb-2v">
                <b>Département :</b>
                {controller.announcement.numerodepartement} - {controller.announcement.departement_nom_officiel}
            </p>
            <p class="fr-text--lead fr-mb-2v">
                <b>Région :</b>
                {controller.announcement.region_nom_officiel}
            </p>
            <p class="fr-text--lead fr-mb-2v">
                <b>Jugement :</b>
                {controller.judgment}
            </p>
        </div>
        <TargetBlankLink
            linkClass="fr-text--sm"
            href={controller.publicationFile}
            title="Témoin de publication - nouvelle fenêtre">
            Témoin de publication
        </TargetBlankLink>
    </Callout>
</div>

<style>
    .announcement {
        margin: auto;
        max-width: 800px;
    }
</style>
