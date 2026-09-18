<script lang="ts">
    interface Props {
        content?: string;
    }

    let { content = "Nous sommes désolés, nous n'avons trouvé aucune donnée sur cette association" }: Props = $props();
</script>

<div class="error-no-data-found">
    <p>{content}</p>
</div>

<style>
    .error-no-data-found {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .error-no-data-found p {
        margin-top: 1.5rem;
    }
</style>
