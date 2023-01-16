<script>
    import Spinner from "@components/Spinner.svelte";
    import Widget from "@components/Widget.svelte";

    import TopAssociationsController from "./TopAssociationsController";

    const controller = new TopAssociationsController();

    const promise = controller.init();

    const { topAssociations, startDateYear, startDateMonth } = controller;
</script>

{#await promise}
    <Spinner />
{:then _}
    <Widget>
        <h4 class="fr-mb-3w fr-mx-2w">
            Pages les plus consultées - <br />
            Total depuis {startDateMonth}
            {startDateYear}
        </h4>
        {#each $topAssociations as association}
            <div class="flex justify-space-between fr-mb-2w fr-mx-2w">
                <p class="fr-text fr-m-0">{association.name}</p>
                <p class="fr-text fr-m-0">{association.visits}</p>
            </div>
        {/each}
    </Widget>
{/await}

<style>
    .justify-space-between {
        justify-content: space-between;
    }
</style>
