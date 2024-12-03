<script>
    import { createEventDispatcher } from "svelte";
    import ApplicationRow from "$lib/components/GrantDashboard/ApplicationRow/ApplicationRow.svelte";
    import PaymentRow from "$lib/components/GrantDashboard/PaymentRow/PaymentRow.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";
    import { GrantRowController } from "$lib/components/GrantDashboard/GrantRow/GrantRow.controller";

    export let index;
    export let tableId;
    export let grant;

    const ctrl = new GrantRowController(grant);
    const dispatch = createEventDispatcher();
</script>

<TableRow id={tableId} {index} openModal={true}>
    <ApplicationRow on:click={() => dispatch("applicationClick")} cells={ctrl.row.applicationCells} />
    <PaymentRow on:click={() => dispatch("paymentClick")} cells={ctrl.row.paymentsCells} granted={ctrl.row.granted} />
</TableRow>
