<script>
  import "./global.css";
  import { DATASUB_URL } from "../src/shared/config";
  import Auth from "./shared/Auth.svelte";
  import Router from "./shared/Router.svelte";
  import Header from "./shared/Header.svelte";
  import Footer from "./shared/Footer.svelte";
  import Theme from "./shared/Theme.svelte";
  import { setContext } from "svelte";

  // Done here because each window.location modification loads a new page
  const location = window.location;
  var baseUrl = `${location.protocol}//${location.host}/`;
  const route = location.href.replace(baseUrl, "");

  setContext("app", {
    getApiUrl: () => DATASUB_URL,
    getName: () => "Data.subvention",
    getDescription: () => "Les dernières informations sur les associations et leurs subventions",
    getContact: () => "contact@datasubvention.beta.gouv.fr",
    getRepo: () => "https://github.com/betagouv/api-subventions-asso"
  });
</script>

<Auth>
  <div class="app-container">
    <Header />
    <div class="fr-container fr-mb-8w">
      <Router {route} />
    </div>
    <Footer />
    <Theme />
  </div>
</Auth>

<style>
  .app-container {
    height: 100vh;

    /* grid container settings */
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }
</style>
