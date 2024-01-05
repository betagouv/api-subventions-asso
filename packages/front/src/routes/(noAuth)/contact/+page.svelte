<script>
    import { getContext } from "svelte";

    const { getContact } = getContext("app");
</script>

<h1>Contactez-nous</h1>

<p>
    Pour nous contacter, vous pouvez envoyer un message à l'adresse
    <a title="Contactez-nous - nouvelle fenêtre" href="mailto:{getContact()}" target="_blank" rel="noopener noreferrer">
        {getContact()}
    </a>
    .
</p>
