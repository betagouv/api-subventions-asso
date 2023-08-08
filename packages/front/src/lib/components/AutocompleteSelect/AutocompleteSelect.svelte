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

<div class="combobox combobox-list">
    <div class="group fr-input-group">
        <label for={id} class="fr-label">
            {label}
        </label>
        <div class="fr-input-wrap">
            <input
                {id}
                class="fr-input"
                {name}
                type="text"
                role="combobox"
                aria-autocomplete="both"
                aria-expanded="false"
                aria-controls={listId}
                bind:this={inputElement} />
            <button
                type="button"
                aria-label="States"
                aria-expanded="false"
                aria-controls={listId}
                tabindex="-1"
                bind:this={buttonElement}>
                <span class="fr-icon-arrow-down-s-line icon fr-icon--sm" aria-hidden="true" />
            </button>
        </div>

        <ul id={listId} role="listbox" aria-label="States" bind:this={listElement}>
            {#each options as option, i}
                <li role="option" aria-selected="false" id="{id}-option-{i}">
                    {option.text}
                </li>
            {/each}
        </ul>
    </div>
</div>
