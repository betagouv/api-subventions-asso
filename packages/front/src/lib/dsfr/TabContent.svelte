<script lang="ts">
    let { selected, index, children } = $props();
</script>

<div
    id={`tabpanel-${index}-panel`}
    class={`fr-tabs__panel fr-tabs__panel--${selected ? "selected" : ""} background-default`}
    role="tabpanel"
    aria-labelledby={`tabpanel-${index}`}
    tabindex="0">
    {@render children?.()}
</div>
