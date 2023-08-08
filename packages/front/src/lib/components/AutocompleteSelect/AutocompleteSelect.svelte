<script lang="ts">
  /*
*   [combobox-autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#sc1_label)

  Copyright © 2023 World Wide Web Consortium. All Rights Reserved. This work is distributed under the W3C® Software and Document License [1] in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

  [1] https://www.w3.org/Consortium/Legal/copyright-software

  This software or document includes material copied from or derived from [combobox-autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#sc1_label). Copyright © 2023 World Wide Web Consortium. https://www.w3.org/copyright/software-license-2023/

*/
  import { nanoid } from "nanoid";

  import "./combobox.css";
  import { onMount } from "svelte";
  import Store from "$lib/core/Store";
  import { ComboboxAutocomplete } from "$lib/components/AutocompleteSelect/combobox.js";

  export let value; // to be bound by parent

  export let id = nanoid(7);
  export let name = id;
  export let options: { value: string; text: string }[];
  export const label = "";

  const listId = `list-${id}`;
  let inputElement: HTMLElement, buttonElement: HTMLElement, listElement: HTMLElement;

  const storeValue = new Store("");
  $: value = storeValue.value; // cannot be in controller so that binding works

  onMount(() => new ComboboxAutocomplete(inputElement, buttonElement, listElement, storeValue));
</script>

<label for={id}>
  State
</label>
<div class="combobox combobox-list">
  <div class="group">
    <input
      id={id}
      class="cb_edit"
      {name}
      type="text"
      role="combobox"
      aria-autocomplete="both"
      aria-expanded="false"
      aria-controls={listId}
      bind:this={inputElement} />
    <button type="button"
            id="cb1-button"
            aria-label="States"
            aria-expanded="false"
            aria-controls={listId}
            tabindex="-1"
            bind:this={buttonElement}>
      <svg width="18"
           height="16"
           aria-hidden="true"
           focusable="false"
           style="forced-color-adjust: auto">
        <polygon class="arrow"
                 stroke-width="0"
                 fill-opacity="0.75"
                 fill="currentcolor"
                 points="3,6 15,6 9,14"></polygon>
      </svg>
    </button>
  </div>
  <ul id={listId} role="listbox" aria-label="{label}" bind:this={listElement}>
    {#each options as option, i}
      <li role="option" aria-selected="false" id="{id}-option-{i}">
        {option.text}
      </li>
    {/each}
  </ul>
</div>
