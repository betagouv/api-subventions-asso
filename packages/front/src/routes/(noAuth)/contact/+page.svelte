<script>
    import { getContext } from "svelte";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";

    const { getContact } = getContext("app");
</script>

<h1>Contactez-nous</h1>

<p>
    Pour nous contacter, vous pouvez envoyer un message à l'adresse
    <TargetBlankLink href="mailto:{getContact()}" title="Contactez-nous - nouvelle fenêtre">
        {getContact()}
    </TargetBlankLink>
    .
</p>
