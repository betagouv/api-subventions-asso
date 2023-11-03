<script>
    import { SearchBarController } from "./SearchBar.controller";

    export let value;

    const ctrl = new SearchBarController();
</script>

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <form on:submit|preventDefault={() => ctrl.dispatchSubmit()}>
            <div class="fr-search-bar fr-search-bar--lg" id="search-input">
                <input
                    class="fr-input"
                    placeholder="Nom, n°SIREN ou RNA d’association, n°SIRET d’établissement"
                    type="search"
                    id="search-input-input"
                    name="search-input"
                    bind:value />
                <button class="fr-btn" title="Rechercher" id="search-input-button" type="submit">Rechercher</button>
            </div>
        </form>
    </div>
</div>
