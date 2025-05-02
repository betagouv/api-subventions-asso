<script>
    export let crumbs;
</script>

<nav class="fr-breadcrumb" aria-label="vous êtes ici :">
    <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">
        Voir le fil d’Ariane
    </button>
    <div class="fr-collapse" id="breadcrumb-1">
        <ol class="fr-breadcrumb__list">
            {#if crumbs.length}
                <li>
                    <a class="fr-breadcrumb__link" href="/">Accueil</a>
                </li>
                {#each crumbs as crumb, index (index)}
                    {#if index < crumbs.length - 1}
                        <li>
                            <a class="fr-breadcrumb__link" href={crumb.url}>{crumb.label}</a>
                        </li>
                    {:else}
                        <li>
                            <span class="fr-breadcrumb__link" aria-current="page">{crumb.label}</span>
                        </li>
                    {/if}
                {/each}
            {/if}
        </ol>
    </div>
</nav>
