<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
</script>

<Alert title="Format du mot de passe" type="info">
    <ul>
        <li>Doit contenir au moins un chiffre [0-9]</li>
        <li>Doit contenir au moins un caractère minuscule [a-z]</li>
        <li>Doit contenir au moins un caractère majuscule [A-Z]</li>
        <li>Doit contenir au moins un caractère spécial {`[ *.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]`}</li>
        <li>Doit contenir au moins 8 caractères, mais pas plus de 32</li>
    </ul>
</Alert>
