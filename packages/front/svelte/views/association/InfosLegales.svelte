<script>
  import TitleWithData from "../../shared/TitleWithData.svelte";
  export let association;

  const creationDate = new Date(association.date_creation).toLocaleDateString();
  const updateDate = new Date(association.date_modification).toLocaleDateString();
  const address = `${association.adresse_siege.numero} ${association.adresse_siege.type_voie} ${association.adresse_siege.voie.toUpperCase()} ${association.adresse_siege.code_postal} ${association.adresse_siege.commune.toUpperCase()}`;
  console.log(address);
</script>

<h1>{association.denomination}</h1>
<div class="grid">
  <div>
    <TitleWithData label="RNA" data={association.rna} />
    <TitleWithData label="SIREN" data={association.siren} />
    <TitleWithData label="SIRET du siège" data={association.siren + association.nic_siege} />
  </div>
  <div>
    <TitleWithData label="Object social" data={association.objet_social} />
  </div>
  <div>
    <TitleWithData label="Adresse siège" data={address} />
    <TitleWithData label="Date d'immatriculation" data={creationDate} />
    {#if association.date_modification}
      <TitleWithData label="Dernière modification au greffe" data={updateDate} />
    {/if}
  </div>
</div>

<style>
  h1 {
    margin-bottom: 48px;
  }

  .grid {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 24px;
  }
</style>
