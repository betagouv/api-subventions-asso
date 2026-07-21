<script lang="ts">
    import DuplicateAlertController from "./DuplicateAlert.controller";
    import Alert from "$lib/dsfr/Alert.svelte";

    interface Props {
        duplicates: string[];
    }

    let { duplicates }: Props = $props();

    const ctrl = new DuplicateAlertController(duplicates);
    const title = `Attention, plusieurs ${ctrl.duplicateType} seraient liés au ${ctrl.otherType}`;
</script>

<Alert type="warning" {title}>
    <ul>
        {#each duplicates as duplicate, index (index)}
            <li>
                {ctrl.duplicateType}
                <span class="fr-text--bold">
                    {duplicate}
                </span>
            </li>
        {/each}
    </ul>
</Alert>
