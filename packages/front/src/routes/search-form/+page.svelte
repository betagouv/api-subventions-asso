<script lang="ts">
    import { goto } from "$app/navigation";
    import AssociationSearchForm from "$lib/components/AssociationSearchForm/AssociationSearchForm.svelte";
    import { encodeQuerySearch } from "$lib/helpers/urlHelper";
    import { SvelteURLSearchParams } from "svelte/reactivity";

    let searchValue = $state("");

    function onSubmit(value: string, location?: string, nameOnly = false) {
        const params = new SvelteURLSearchParams();
        if (location) params.set("location", location);
        if (nameOnly) params.set("nameOnly", "true");
        const query = params.toString();

        goto(`/search/${encodeQuerySearch(value)}${query ? `?${query}` : ""}`);
    }
</script>

<div class="fr-my-6v">
    <AssociationSearchForm bind:value={searchValue} {onSubmit} />

    <div class="fr-mt-6w">
        <p class="fr-text--bold">Pour faciliter l’affichage des résultats :</p>
        <ul>
            <li>Utiliser un terme d’au moins 3 lettres</li>
            <li>Complétez avec un code postal ou département</li>
            <li>La recherche tolère les fautes de frappe, les accents et les termes proches</li>
        </ul>
    </div>
</div>
