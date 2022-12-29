<script>
    import Spinner from "@components/Spinner.svelte";
    import Widget from "@components/Widget.svelte";

    import TopAssociationsController from "./TopAssociationsController";

    const controller = new TopAssociationsController();

    const promise = controller.load();

    const { topAssociations, startDateYear, startDateMonth } = controller;
</script>

{#await promise}
    <Spinner />
{:then _}
    <div class="fr-col-6">
        <Widget title="Pages les plus consultées - Total depuis {startDateMonth} {startDateYear}">
            {#each $topAssociations as association}
                <div class="top-associations_content fr-mb-2w">
                    <p class="fr-text fr-m-0">{association.name}</p>
                    <p class="fr-text fr-m-0">{association.nbRequests}</p>
                </div>
            {/each}
        </Widget>
    </div>
{/await}

<style>
    .top-associations_content {
        display: flex;
        justify-content: space-between;
        font-weight: 500;
    }
</style>
