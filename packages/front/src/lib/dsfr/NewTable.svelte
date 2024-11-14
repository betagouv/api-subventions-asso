<script lang="ts">
    export let title = "Titre du tableau (caption)";
    export let size: "sm" | "md" | "lg" = "lg";
    export let headers: string[];
    export let rows: string[][];

    const id = crypto.randomUUID();
</script>

<div class="fr-table--${size} fr-table fr-table" id="table-component-${id}">
    <div class="fr-table__wrapper">
        <div class="fr-table__container">
            <div class="fr-table__content">
                <table id="table-${id}">
                    <caption>{title}</caption>
                    <thead>
                        <tr>
                            {#each headers as header}
                                <th scope="col">{header}</th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each rows as [row, index]}
                            <tr id="table-${size}-row-key-${index}" data-row-key={index}>
                                {#each row as cell}
                                    <td>{cell}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
