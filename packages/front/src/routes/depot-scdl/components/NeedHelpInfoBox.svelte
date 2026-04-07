<script lang="ts">
    import InfoBox from "$lib/components/InfoBox.svelte";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";
</script>

<InfoBox title="Besoin d’aide ?">
    <ul>
        <li class="fr-mb-2v">
            Consulter la documentation officielle pour plus d’informations :
            <br />
            <TargetBlankLink href="https://schema.data.gouv.fr/scdl/subventions/">
                Voir la documentation
            </TargetBlankLink>
        </li>
        <li class="fr-mb-2v">
            Préparer votre fichier en vous appuyant sur
            <TargetBlankLink
                href="https://datasubvention.beta.gouv.fr/wp-content/uploads/2024/12/Gabarit-SCDL-202410.xlsx">
                notre modèle SCDL
            </TargetBlankLink>
        </li>
        <li class="fr-mb-2v">Nous contacter via la bulle de chat</li>
        <li>Participer à notre webinaire pour plus d’accompagnement dans la mise à jour de votre fichier :</li>
        <TargetBlankLink
            href="https://datasubvention.beta.gouv.fr/permanence-scdl-creer-structurer-et-deposer-vos-donnees/">
            S'inscrire
        </TargetBlankLink>
    </ul>
</InfoBox>
