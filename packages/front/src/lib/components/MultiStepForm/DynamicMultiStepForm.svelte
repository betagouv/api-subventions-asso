<script>
    import MultiStepForm from "./MultiStepForm.svelte";
    import Step1 from "./Steps/Step1.svelte";
    import Step2 from "./Steps/Step2.svelte";
    import Step3 from "./Steps/Step3.svelte";

    // Array of { name: string, component: Component}
    const steps = [
        { name: "Step1", component: Step1 },
        { name: "Step2", component: Step2 },
        { name: "Step3", component: Step3 },
    ];

    function onSubmit(values) {
        console.log("multi step submit", values);
    }
</script>

<h1>Dynamic Multi Step Form</h1>

<MultiStepForm {steps} {onSubmit} />
