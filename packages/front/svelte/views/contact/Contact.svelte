<script>
    import ContactController from "./Contact.controller";

    const { contactEmail } = new ContactController();
</script>

<h1>Contactez-nous</h1>

<p>
    Pour nous contacter, vous pouvez
    <a title="Contactez-nous" href="mailto:{contactEmail}" target="_blank" rel="noopener noreferrer">
        envoyer un message à l'adresse {contactEmail}.
    </a>
    .
</p>
