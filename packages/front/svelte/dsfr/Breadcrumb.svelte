<script>
  export let segments;
</script>

<nav class="fr-breadcrumb" aria-label="vous êtes ici :">
  <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">Voir le fil d’Ariane</button>
  <div class="fr-collapse" id="breadcrumb-1">
    <ol class="fr-breadcrumb__list">
      {#each segments as segment, index}
        {#if index == 0}
          <li>
            <a class="fr-breadcrumb__link" href="/">Accueil</a>
          </li>
        {:else if index < segments.length - 1}
          <li>
            <a class="fr-breadcrumb__link" href={segment.url}>{segment.label}</a>
          </li>
        {:else}
          <li>
            <span class="fr-breadcrumb__link" aria-current="page">{segment.label}</span>
          </li>
        {/if}
      {/each}
    </ol>
  </div>
</nav>
