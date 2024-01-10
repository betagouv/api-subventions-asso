<script lang="ts">
    import DuplicateAlertController from "./DuplicateAlert.controller";
    import Alert from "$lib/dsfr/Alert.svelte";

    export let duplicates: string[];

    const ctrl = new DuplicateAlertController(duplicates);
    const title = `Attention, plusieurs ${ctrl.duplicateType} seraient liés au ${ctrl.otherType}`;
</script>

<Alert type="warning" {title}>
    <ul>
        {#each duplicates as duplicate}
            <li>
                {ctrl.duplicateType}
                <u>{duplicate}</u>
            </li>
        {/each}
    </ul>
</Alert>
