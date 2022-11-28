<script>
    import { TotoController } from "./Toto.Controller";

    export let tutu;

    const controller = new TotoController(tutu);

    const { blagues } = controller;
</script>

<div>
    {#each $blagues as blague}
        <p>{blague}</p>
    {/each}
</div>

<button on:click={() => controller.click()} />
