<script>
    import MultiStepForm from "./MultiStepForm.svelte";
    import Step1 from "./Step1/Step1.svelte";

    const steps = [Step1];
</script>

<MultiStepForm {steps} />

<style>
    /* your styles go here */
</style>
