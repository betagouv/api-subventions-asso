<script>
  import "./global.css";
  import Auth from "./shared/Auth.svelte";
  import Header from "./shared/Header.svelte";
  import Footer from "./shared/Footer.svelte";
  import Theme from "./shared/Theme.svelte";
  import { setContext } from "svelte";

  setContext("app", {
    getName: () => "Data.subvention",
    getDescription: () => "Les dernières informations sur les associations et leurs subventions",
    getContact: () => "contact@datasubvention.beta.gouv.fr",
    getRepo: () => "https://github.com/betagouv/api-subventions-asso"
  });
</script>

<Auth>
  <div class="app-container">
    <Header />
    <main>Hello World</main>
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

  .app-container > main {
    display: flex;
    margin: auto;
  }
</style>
