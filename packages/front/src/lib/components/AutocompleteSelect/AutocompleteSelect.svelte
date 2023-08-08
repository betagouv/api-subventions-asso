<script lang="ts">
  /*
 *   [combobox-autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#sc1_label)

    Copyright © 2023 World Wide Web Consortium. All Rights Reserved. This work is distributed under the W3C® Software and Document License [1] in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

    [1] https://www.w3.org/Consortium/Legal/copyright-software

    This software or document includes material copied from or derived from [combobox-autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#sc1_label). Copyright © 2023 World Wide Web Consortium. https://www.w3.org/copyright/software-license-2023/

 */
</script>

<label for="cb1-input">
  State
</label>
<div class="combobox combobox-list">
  <div class="group">
    <input id="cb1-input"
           class="cb_edit"
           type="text"
           role="combobox"
           aria-autocomplete="both"
           aria-expanded="false"
           aria-controls="cb1-listbox">
    <button type="button"
            id="cb1-button"
            aria-label="States"
            aria-expanded="false"
            aria-controls="cb1-listbox"
            tabindex="-1">
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
  <ul id="cb1-listbox"
      role="listbox"
      aria-label="States">
    <li id="lb1-al" role="option">
      Alabama
    </li>
    <li id="lb1-ak" role="option">
      Alaska
    </li>
    <li id="lb1-as" role="option">
      American Samoa
    </li>
  </ul>
</div>
