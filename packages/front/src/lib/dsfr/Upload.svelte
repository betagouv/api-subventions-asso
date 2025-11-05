<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { type FileFormat, formatMap } from "$lib/helpers/fileHelper";

    const dispatch = createEventDispatcher<{ fileChange: { files: FileList | null } }>();

    export let label: string;
    export let hint: string;
    export let disabled: boolean = false;
    export let multiple: boolean = false;
    export let error: boolean = false;
    export let errorMessage: string = "";
    export let id: string = "upload";
    export let name: string = "upload";
    export let acceptedFormats: FileFormat[] = [];

    $: acceptValue =
        acceptedFormats.length > 0 ? acceptedFormats.flatMap(format => formatMap[format] || []).join(",") : null;

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        dispatch("fileChange", { files });
    }
</script>

<div class="fr-upload-group {error ? 'fr-upload-group--error' : ''} {disabled ? 'fr-upload-group--disabled' : ''}">
    <label class="fr-label" for={id}>
        {label}
        <span class="fr-hint-text">{@html hint}</span>
    </label>
    <input
        class="fr-upload"
        {disabled}
        aria-describedby="{id}-messages"
        {multiple}
        type="file"
        {id}
        {name}
        {...acceptValue ? { accept: acceptValue } : {}}
        on:change={handleFileChange} />
    <div class="fr-messages-group" id="{id}-messages" aria-live="polite">
        {#if error}
            <p class="fr-message fr-message--error" id="{id}-message-error">{errorMessage}</p>
        {/if}
    </div>
</div>
