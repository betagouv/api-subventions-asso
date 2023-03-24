<script>
    import { data } from "../../../store/modal.store";
    import { capitalizeFirstLetter } from "@helpers/textHelper";
</script>

{#if $data.subvention}
    {#each $data.subvention.actions_proposee as action}
        <section>
            <h4 class="fr-icon-arrow-right-line">{capitalizeFirstLetter(action.intitule)}</h4>
            {#each action.objectifs.split("\n") as line}
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

    section h4[class*=" fr-fi-"]::before,
    section h4[class*=" fr-icon-"]::before,
    section h4[class^="fr-fi-"]::before,
    section h4[class^="fr-icon-"]::before {
        margin-right: 0.5rem;
    }
</style>
