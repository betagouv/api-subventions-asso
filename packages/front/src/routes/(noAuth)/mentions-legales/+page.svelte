<script>
    import { getContext } from "svelte";

    const { getName, getContact } = getContext("app");
</script>

<h1>Mentions légales</h1>

<h2>Éditeur de la Plateforme</h2>

<p>
    La Plateforme {getName()} est éditée par l'Incubateur de services numériques de la Direction interministérielle du numérique
    (DINUM).
</p>

<p>
    Coordonnées :
    <br />
    Adresse : DINUM, 20 avenue de Ségur, 75007 Paris
    <br />
    Tel. accueil : 01.71.21.01.70
    <br />
    SIRET : 12000101100010 (secrétariat général du gouvernement)
    <br />
    SIREN : 120 001 011
</p>

<h2>Directrice.eur de la publication</h2>
<p>Directeur interministériel du numérique.</p>

<h2>Hébergement de la Plateforme</h2>
<p>Ce site est hébergé en propre par Scalingo SAS, 15 avenue du Rhin, 67100 Strasbourg, France.</p>

<h2>Accessibilité</h2>
<p>
    La conformité aux normes d’accessibilité numérique est un objectif ultérieur. En attendant, nous tâchons de rendre
    ce site accessible à toutes et à tous :
</p>
<ul>
    <li>Utilisation de composants accessibles (design system de l'État)</li>
    <li>Respect des bonnes pratiques (Pilida, Opquast...)</li>
    <li>Tests manuels</li>
</ul>

<h3>Signaler un dysfonctionnement</h3>
<p>
    Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une fonctionnalité du site,
    merci de nous en faire part en nous contactant à l'adresse
    <a title="Contactez-nous - nouvelle fenêtre" href="mailto:{getContact()}" target="_blank" rel="noopener noreferrer">
        {getContact()}
    </a>
    .
</p>
<p>
    Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une
    demande de saisine au Défenseur des droits.
</p>

<h3>En savoir plus</h3>
<p>
    Pour en savoir plus sur la politique d’accessibilité numérique de l’État :
    <a href="https://accessibilite.numerique.gouv.fr/">https://accessibilite.numerique.gouv.fr/</a>
</p>

<h2>Sécurité</h2>

<p>
    Le site est protégé par un certificat électronique, matérialisé pour la grande majorité des navigateurs par un
    cadenas. Cette protection participe à la confidentialité des échanges. En aucun cas les services associés à la
    plateforme ne seront à l’origine d’envoi de courriels pour demander la saisie d’informations personnelles.
</p>
