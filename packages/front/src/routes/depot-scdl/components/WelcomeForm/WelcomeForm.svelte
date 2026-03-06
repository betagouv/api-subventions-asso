<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";

    const dispatch = createEventDispatcher<{ start: void }>();
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
        <p class="fr-mb-7v">
            👉 Avant de commencer, vous pouvez vous reporter à la documentation officielle pour plus d'informations :
            <TargetBlankLink href="https://schema.data.gouv.fr/scdl/subventions/">
                voir la documentation
            </TargetBlankLink>
            .
            <br />
            👉 Vous pouvez également vous inscrire à un webinaire d'accompagnement au format SCDL :
            <TargetBlankLink
                href="https://datasubvention.beta.gouv.fr/permanence-scdl-creer-structurer-et-deposer-vos-donnees/">
                s'inscrire
            </TargetBlankLink>
        </p>
    </div>
    <div class="text-center">
        <button on:click={() => dispatch("start")} class="fr-btn" type="button">Débuter</button>
    </div>
</div>
