<script lang="ts">
    import { onMount, tick } from "svelte";
    import SpellcheckedInputController, { type MisspelledWord } from "./SpellcheckedInput.controller";

    type Props = {
        id: string;
        name?: string;
        placeholder?: string;
        value?: string;
        oninput?: () => void;
    };

    let { id, name = "search-input", placeholder, value = $bindable(), oninput = () => {} }: Props = $props();

    const controller = new SpellcheckedInputController();
    const debounceMs = 250;

    let misspelledWords = $state<MisspelledWord[]>([]);
    let selectedWord = $state<MisspelledWord>();
    let suggestions = $state<string[]>();
    let scrollLeft = $state(0);
    let input: HTMLInputElement;
    let checkRequestId = 0;

    const segments = $derived(controller.splitTextForHighlighting(value ?? "", misspelledWords));

    onMount(() => controller.initialize());

    $effect(() => {
        const text = value ?? "";
        const currentRequestId = ++checkRequestId;

        misspelledWords = [];
        closePopover();
        if (!text.trim()) return;

        const timeout = window.setTimeout(async () => {
            try {
                const words = await controller.checkSpelling(text);
                if (currentRequestId !== checkRequestId) return;

                misspelledWords = words;
            } catch (error) {
                console.error("Impossible de vérifier l'orthographe", error);
                if (currentRequestId === checkRequestId) misspelledWords = [];
            }
        }, debounceMs);

        return () => window.clearTimeout(timeout);
    });

    function handleInput(event: Event) {
        const target = event.currentTarget as HTMLInputElement;
        value = target.value;
        scrollLeft = target.scrollLeft;
        oninput();
    }

    function handleScroll(event: Event) {
        scrollLeft = (event.currentTarget as HTMLInputElement).scrollLeft;
    }

    function closePopover() {
        selectedWord = undefined;
        suggestions = undefined;
    }

    async function selectMisspelledWord() {
        const word = controller.findMisspelledWordAtCaret(misspelledWords, input.selectionStart ?? -1);
        if (!word) return closePopover();

        selectedWord = word;
        suggestions = undefined;

        try {
            const result = await controller.suggest(word.value);
            if (selectedWord === word) suggestions = result;
        } catch (error) {
            console.error("Impossible de proposer des corrections", error);
            if (selectedWord === word) suggestions = [];
        }
    }

    async function applySuggestion(suggestion: string) {
        if (!selectedWord) return;

        const caretPosition = selectedWord.start + suggestion.length;
        value = controller.replaceMisspelledWord(value ?? "", selectedWord, suggestion);
        closePopover();

        await tick();
        input.focus();
        input.setSelectionRange(caretPosition, caretPosition);
    }
</script>

<div class="fr-input-wrap spellcheck">
    <input
        class="fr-input"
        {id}
        {name}
        {placeholder}
        type="search"
        spellcheck="false"
        aria-describedby="spelling-status"
        bind:this={input}
        bind:value
        oninput={handleInput}
        onscroll={handleScroll}
        onclick={selectMisspelledWord}
        onkeydown={event => event.key === "Escape" && closePopover()} />

    <div class="highlights" aria-hidden="true">
        <span style:transform={`translateX(-${scrollLeft}px)`}>
            {#each segments as segment, index (segment.misspelledWord?.start ?? `text-${index}`)}
                {#if segment.misspelledWord}
                    <span class="misspelled">{segment.text}</span>
                {:else}
                    {segment.text}
                {/if}
            {/each}
        </span>
    </div>

    {#if selectedWord}
        <div class="popover fr-p-2w fr-pr-5w" role="dialog" aria-labelledby="popover-title">
            <p id="popover-title" class="fr-text--m fr-text--bold fr-mb-1w">
                {suggestions?.length === 1 ? "Correction proposée" : "Corrections proposées"}
            </p>
            <button
                class="close fr-icon-close-line fr-icon--sm"
                type="button"
                aria-label="Fermer les suggestions"
                title="Fermer"
                onclick={closePopover}>
            </button>
            {#if suggestions === undefined}
                <p class="fr-text--sm fr-mb-0">Recherche de corrections…</p>
            {:else if suggestions.length}
                <ul class="fr-tags-group fr-tags-group--sm">
                    {#each suggestions as suggestion (suggestion)}
                        <li>
                            <button class="fr-tag" type="button" onclick={() => applySuggestion(suggestion)}>
                                {suggestion}
                            </button>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="fr-text--sm fr-mb-0">Aucune correction trouvée</p>
            {/if}
        </div>
    {/if}

    <p id="spelling-status" class="fr-sr-only" aria-live="polite">
        {#if misspelledWords.length === 1}
            1 mot semble mal orthographié
        {:else if misspelledWords.length > 1}
            {misspelledWords.length} mots semblent mal orthographiés
        {/if}
    </p>
</div>

<style>
    .spellcheck {
        width: 100%;
        min-width: 0;

        > input {
            position: relative;
            z-index: 1;
        }

        .highlights {
            position: absolute;
            z-index: 1;
            inset: 0;
            overflow: hidden;
            padding: 0.5rem 1rem;
            pointer-events: none;
            color: transparent;
            white-space: pre;

            > span {
                display: block;
                width: max-content;
            }
        }

        .misspelled {
            text-decoration: underline dotted var(--text-default-error) 2px;
            text-underline-offset: 5px;
        }

        .popover {
            position: absolute;
            z-index: 1;
            width: max-content;
            background-color: var(--background-overlap-grey);
            filter: drop-shadow(var(--overlap-shadow));

            #popover-title {
                margin-right: 0.5rem;
            }

            .close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                display: grid;
                place-items: center;
                width: 2rem;
                height: 2rem;
                color: var(--text-action-high-blue-france);
            }
        }
    }

    @media (min-width: 48em) {
        :global(.fr-search-bar--lg) .spellcheck > input {
            height: 3rem;
        }

        :global(.fr-search-bar--lg) .highlights {
            padding-block: 0.75rem;
        }
    }
</style>
