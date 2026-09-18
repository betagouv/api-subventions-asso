<script lang="ts">
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

    let { onstart = () => {} } = $props();
</script>

<div class="fr-col-12 fr-col-lg-9">
    <h1 class="text-center fr-mb-10v">Bienvenue sur le parcours de dépôt de données de Data.Subvention</h1>

    <div class="fr-text--bold fr-text--lead fr-mb-7v">Déposez vos données de subventions en toute simplicité</div>
    <div class="fr-text">
        <p class="fr-mb-7v">
            Contribuez à l'amélioration de la transparence et de la qualité des données publiques en partageant vos
            données de subventions au format SCDL. Notre parcours de dépôt vous accompagne pas à pas pour :
        </p>
        <ul class="fr-mb-7v">
            <li>Vérifier la conformité de vos fichiers avec le format SCDL</li>
            <li>Importer facilement vos données</li>
        </ul>
    </div>

    <Alert type="info">
        Vous souhaitez en savoir plus sur le SCDL ou sur le dépôt de vos données ? Rejoignez notre webinaire
        d'information et d'accompagnement pour découvrir le SCDL, comprendre les étapes de création et de dépôt de vos
        données, et poser vos questions à notre équipe. <TargetBlankLink
            href="https://datasubvention.beta.gouv.fr/permanence-scdl-creer-structurer-et-deposer-vos-donnees/">
            S'inscrire.
        </TargetBlankLink>
        <br />
        <br />
        Vous pouvez également vous reporter à la <TargetBlankLink href="https://schema.data.gouv.fr/scdl/subventions/">
            documentation officielle
        </TargetBlankLink> pour plus d'informations.
    </Alert>

    <div class="text-center">
        <button onclick={onstart} class="fr-btn" type="button">Débuter</button>
    </div>
</div>
