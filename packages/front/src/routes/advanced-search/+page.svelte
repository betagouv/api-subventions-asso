<script lang="ts">
    import { goto } from "$app/navigation";
    import AdvancedSearchBar from "$lib/components/AdvancedSearchBar/AdvancedSearchBar.svelte";
    import { encodeQuerySearch } from "$lib/helpers/urlHelper";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    let searchValue = $state("");

    function onSubmit(value: string | undefined, postalCode?: string) {
        if (!value) return;

        const params = new SvelteURLSearchParams();
        if (postalCode) params.set("postalCode", postalCode);
        const query = params.toString();

        goto(`/search/${encodeQuerySearch(value)}${query ? `?${query}` : ""}`);
    }
</script>

<div class="fr-container fr-my-6w">
    <AdvancedSearchBar bind:value={searchValue} {onSubmit} />

    <div class="advanced-search-help fr-mt-6w">
        <p class="fr-text--bold">Pour faciliter l’affichage des résultats :</p>
        <ul>
            <li>Utiliser un terme d’au moins 3 lettres</li>
            <li>Complétez avec un code postal ou département</li>
            <li>La recherche tolère les fautes de frappe, les accents et les termes proches</li>
        </ul>
    </div>
</div>

<style>
    .advanced-search-help {
        max-width: 48rem;
    }
</style>
