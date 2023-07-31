<script>
    import MessagesController from "./Messages.controller";
    import Callout from "$lib/dsfr/Callout.svelte";

    const controller = new MessagesController();

    const { messages } = controller;
</script>

{#if $messages.length}
    {#each $messages as message}
        <Callout title={message.title} href={message.href} labelAction="En savoir plus">
            {message.description}
        </Callout>
    {/each}
{/if}
