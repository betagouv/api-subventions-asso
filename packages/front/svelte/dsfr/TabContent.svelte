<script>
  export let selected;
  export let index;
</script>

<div
  id={`tabpanel-${index}-panel`}
  class={`fr-tabs__panel fr-tabs__panel--${selected ? "selected" : ""}`}
  role="tabpanel"
  aria-labelledby={`tabpanel-${index}`}
  tabindex="0">
  <slot />
</div>
