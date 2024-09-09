<script lang="ts">
    import AgentConnectButton from "$lib/dsfr/AgentConnectButton.svelte";
    import { PUBLIC_AGENT_CONNECT_ENABLED, PUBLIC_DATASUB_URL } from "$env/static/public";
</script>

{#if PUBLIC_AGENT_CONNECT_ENABLED === "true"}
    <div class="fr-grid-row">
        <div class="fr-mx-auto">
            <AgentConnectButton link={PUBLIC_DATASUB_URL + `/auth/ac/login`} />
        </div>
    </div>
    <div class="fr-grid-row or fr-my-4w fr-px-11v">
        <div class="text-separator" />
        <div class="fr-mx-3w">OU</div>
        <div class="text-separator" />
    </div>
{/if}

<style>
    .or {
        flex-shrink: 1;
        flex-wrap: nowrap;
    }

    .text-separator {
        width: 100%;
        flex-shrink: 1;
        border-top: 2px solid var(--border-default-grey);
        margin-top: auto;
        margin-bottom: auto;
        height: 0;
    }
</style>
