<script lang="ts">
    interface Props {
        links: { label: string; anchor: string }[];
    }

    let { links }: Props = $props();
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
