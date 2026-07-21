<script lang="ts">
    import { type FileFormat, formatMap } from "$lib/helpers/fileHelper";

    interface Props {
        label: string;
        hint: string;
        disabled?: boolean;
        multiple?: boolean;
        error?: boolean;
        errorMessage?: string;
        id?: string;
        name?: string;
        acceptedFormats?: FileFormat[];
        onfileChange?: (detail: { files: FileList | null }) => void;
    }

    let {
        label,
        hint,
        disabled = false,
        multiple = false,
        error = false,
        errorMessage = "",
        id = "upload",
        name = "upload",
        acceptedFormats = [],
        onfileChange = () => {},
    }: Props = $props();

    let acceptValue = $derived(
        acceptedFormats.length > 0 ? acceptedFormats.flatMap(format => formatMap[format] || []).join(",") : null,
    );

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        onfileChange({ files });
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
        onchange={handleFileChange} />
    <div class="fr-messages-group" id="{id}-messages" aria-live="polite">
        {#if error}
            <p class="fr-message fr-message--error" id="{id}-message-error">{errorMessage}</p>
        {/if}
    </div>
</div>
