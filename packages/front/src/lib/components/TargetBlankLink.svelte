<script lang="ts">
    export let href: string;
    export let title: string | undefined = undefined;
    export let ariaDescribedBy: string | undefined = undefined;
    export let linkClass: string = "fr-link";
</script>

<a
    class={linkClass}
    {href}
    {title}
    {...ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}}
    target="_blank"
    rel="noopener noreferrer"
    on:click>
    <slot />
</a>
