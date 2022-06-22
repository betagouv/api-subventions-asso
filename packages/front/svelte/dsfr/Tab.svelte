<script>
  export let title;
  export let index;
  export let selected = false;
</script>

<li role="presentation">
  <button id={`tabpanel-${index}`} class="fr-tabs__tab" tabindex={selected ? "0" : "-1"} role="tab" aria-selected={selected ? true : false} aria-controls={`tabpanel-${index}-panel`}>{title}</button>
</li>
