<script>
    import { getContext } from "svelte";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";

    const { getName, getContact } = getContext("app");
</script>

<h1>Mentions légales</h1>

<h2>Éditeur de la Plateforme</h2>

<p>
    La Plateforme {getName()} est éditée par la Direction de la Jeunesse, de l’Éducation Populaire et de la Vie Associative
    (DJEPVA), rattachée au ministère chargé de la Jeunesse.
</p>

<p>
    Coordonnées (DJEPVA) :
    <br />
    Adresse : 95 avenue de France, 75650 Paris Cedex 13
    <br />
    Tel. accueil : 01.40.45.90.00
    <br />
    SIREN : 120 041 017
    <br />
    SIRET : 120 041 017 00035
</p>

<h2>Directrice.eur de la publication</h2>
<p>Thibaut de Saint Pol, directeur de la Jeunesse, de l’Éducation populaire et de la Vie associative.</p>

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
    <TargetBlankLink href="mailto:{getContact()}" title="Contactez-nous - nouvelle fenêtre">
        {getContact()}
    </TargetBlankLink>
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
