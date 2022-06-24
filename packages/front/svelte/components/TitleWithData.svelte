<script>
  import { valueOrHyphen } from "../helpers/dataHelper";
  export let label;
  export let data;
</script>

<div>
  <h5 class="label">{label}</h5>
  <p>{valueOrHyphen(data)}</p>
</div>

<style>
  h5 {
    margin-bottom: 10px;
  }
</style>
