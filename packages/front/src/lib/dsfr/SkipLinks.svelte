<script lang="ts">
    export let links: { label: string; anchor: string }[];
</script>

<div class="fr-skiplinks">
    <nav class="fr-container" aria-label="Accès rapide">
        <ul class="fr-skiplinks__list">
            {#each links as link (link.label)}
                <li>
                    <a class="fr-link" href="#{link.anchor}">{link.label}</a>
                </li>
            {/each}
        </ul>
    </nav>
</div>
