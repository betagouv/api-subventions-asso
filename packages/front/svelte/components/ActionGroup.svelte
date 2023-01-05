<div class="fr-grid-row">
    <div class="fr-col-8">
        <slot name="content" />
    </div>
    <div class="fr-col-4 align-right">
        <span>
            <slot name="action" />
        </span>
    </div>
</div>

<style>
    .align-right {
        display: flex;
        justify-content: flex-end;
    }

    .align-right > span {
        align-self: flex-end;
    }
</style>
