<script lang="ts">
    interface Props {
        href: string;
        title?: string | undefined;
        ariaDescribedBy?: string | undefined;
        linkClass?: string;
        onclick?: (event: MouseEvent) => void;
        children?: import("svelte").Snippet;
    }

    let {
        href,
        title = undefined,
        ariaDescribedBy = undefined,
        linkClass = "fr-link",
        onclick = () => {},
        children,
    }: Props = $props();
</script>

<a
    class={linkClass}
    {href}
    {title}
    {...ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}}
    target="_blank"
    rel="noopener noreferrer"
    {onclick}>
    {@render children?.()}
</a>
