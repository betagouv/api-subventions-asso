<script lang="ts">
    interface Props {
        content?: import("svelte").Snippet;
        action?: import("svelte").Snippet;
    }

    let { content, action }: Props = $props();
</script>

<div class="fr-grid-row">
    <div class="fr-col-8">
        {@render content?.()}
    </div>
    <div class="fr-col-4 align-right">
        <span>
            {@render action?.()}
        </span>
    </div>
</div>

<style>
    .align-right {
        display: flex;
        justify-content: flex-end;
    }

    .align-right > span {
        align-self: flex-end;
    }
</style>
