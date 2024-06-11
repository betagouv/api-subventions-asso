<script>
    import { data } from "$lib/store/modal.store";
    import { capitalizeFirstLetter } from "$lib/helpers/stringHelper";
</script>

{#if $data.subvention}
    <!-- TODO info établissement: from a store ?
  <section>
      <h4 class="fr-icon-arrow-right-line">Établissement concerné</h4>
      <div class="bigger-link">
          <a href="/etablissement/{establishment.siret}" target="_blank" rel="noopener external" title="{association.denomination_rna || association.denomination_siren} - nouvelle fenêtre">
              {association.denomination_rna || association.denomination_siren}
          </a>
          <EstablishmentPreview {establishment} small={true} />
      </div>
  </section>
  -->
    <section>
        <h4 class="fr-icon-arrow-right-line">Informations collectées</h4>
        <!-- prettier-ignore-start -->
        <p class="fr-text--lead">
            {#if $data.subvention.montants.accorde}
                <span class="fr-text--bold">{$data.montantAccorde}</span>
                ont été accordés{#if $data.subvention.montants.demande}
                    {" "}sur
                    <span class="fr-text--bold">{$data.montantDemande}</span>
                    demandés{/if}.
            {:else if $data.subvention.montants.demande}
                <span class="fr-text--bold">{$data.montantDemande}</span>
                ont été demandés.
            {/if}
        </p>
        <!-- prettier-ignore-end -->
        <!-- TODO provider and update value
    <p class="fr-text--lg fr-text--bold">D'après les données récupérées via {provider} et
        mises à jour le {updateDate}.</p>
    -->
        {#if $data.subvention.date_depot}
            <p class="fr-text--lg">
                <span class="fr-text--bold">Date de dépôt de la demande :</span>
                {$data.subvention.date_depot}
            </p>{/if}
        {#if $data.subvention.date_decision}
            <p class="fr-text--lg">
                <span class="fr-text--bold">Date de décision du service instructeur :</span>
                {$data.subvention.date_decision}
            </p>{/if}
    </section>
    {#each $data.subvention?.actions_proposee || [] as action}
        <section>
            <h4 class="fr-icon-arrow-right-line">{capitalizeFirstLetter(action.intitule)}</h4>
            {#each action.objectifs?.split("\n") || [] as line}
                {#if line.length}
                    <p>{line}</p>
                {/if}
            {/each}
        </section>
    {/each}
{/if}

<style>
    section h4 {
        color: var(--text-active-blue-france);
        margin-bottom: 1.33em;
    }

    section {
        margin-bottom: 3rem;
    }

    section:last-child {
        margin-bottom: 0;
    }

    section h4:is([class*=" fr-fi-"], h4[class*=" fr-icon-"], h4[class^="fr-fi-"], h4[class^="fr-icon-"])::before {
        margin-right: 0.5rem;
    }

    /* uncomment when showing establishment
    .bigger-link {
        position: relative;
    }

    .bigger-link > a::before {
        position: absolute;
        width: 100%;
        height: 100%;
        content: "";
    }*/
</style>
