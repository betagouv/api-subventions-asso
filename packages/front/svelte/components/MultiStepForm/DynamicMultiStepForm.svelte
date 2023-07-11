<script>
    import MultiStepForm from "./MultiStepForm.svelte";
    import Step1 from "./Steps/Step1.svelte";
    import Step2 from "./Steps/Step2.svelte";
    import Step3 from "./Steps/Step3.svelte";

    function onSubmit(values) {
        console.log("multi step submit", values);
    }
</script>

Dynamic Multi Step Form

<MultiStepForm steps={[Step1, Step2, Step3]} {onSubmit} />

<style>
    /* your styles go here */
</style>
