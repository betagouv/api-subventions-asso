<script lang="ts">
    export let link;
</script>

<div class="fr-connect-group">
    <form action={link} method="get">
        <button class="fr-connect">
            <span class="fr-connect__login">S’identifier avec</span>
            <span class="fr-connect__brand">AgentConnect</span>
        </button>
    </form>
    <p>
        <a
            href="https://agentconnect.gouv.fr/"
            target="_blank"
            rel="noopener"
            title="Qu’est-ce que FranceConnect ? - nouvelle fenêtre">
            Qu’est-ce que AgentConnect ?
        </a>
    </p>
</div>
