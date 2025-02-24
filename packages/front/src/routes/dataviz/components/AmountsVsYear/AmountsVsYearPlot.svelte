<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import CategoryLegend from "../CategoryLegend.svelte";

    export let data_year;
    export let data_selected;

    let svg;
    let width = 800;
    let height = 400;

    const margin = { top: 80, right: 320, bottom: 40, left: 90 };
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

    const formatter = new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        maximumFractionDigits: 0,
    });

    function updateChart() {
        if (!svg || !data_year) return;
        d3.select(svg).selectAll("*").remove();

        const years = [...new Set(data_year.map(d => d.exerciceBudgetaire))];
        // Create X scale (years)
        const x = d3.scaleBand().domain(years).range([0, svgWidth]);

        // Create Y left scale (values)

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data_year, d => d.montant)])
            .nice()
            .range([svgHeight, 0]);

        // Create Y rigth scales (values)

        const ySelected = d3
            .scaleLinear()
            .domain([0, d3.max(data_selected, d => d.montant)])
            .nice()
            .range([svgHeight, 0]);

        // Create lines
        const line = d3
            .line()
            .x(d => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
            .y(d => y(d.montant));

        const lineSelected = d3
            .line()
            .x(d => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
            .y(d => ySelected(d.montant));

        // Select SVG element
        const svgElement = d3
            .select(svg)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add lines to the graph
        svgElement
            .append("path")
            .data([data_year])
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

        svgElement
            .append("path")
            .data([data_selected])
            .attr("class", "line")
            .attr("d", lineSelected)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2);

        // Add X axis
        svgElement.append("g").attr("transform", `translate(0,${svgHeight})`).call(d3.axisBottom(x));

        // Add Y axis
        svgElement.append("g").call(d3.axisLeft(y)).attr("color", "steelblue");

        svgElement
            .append("g")
            .call(d3.axisRight(ySelected))
            .attr("transform", `translate(${svgWidth},0)`)
            .attr("color", "red");

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "rgba(0, 0, 0, 0.7)")
            .style("color", "white")
            .style("padding", "5px")
            .style("border-radius", "4px");

        // Add points to each data point to interact with the tooltip
        svgElement
            .selectAll(".dot")
            .data(data_year)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
            .attr("cy", d => y(d.montant))
            .attr("r", 5)
            .attr("fill", "steelblue")
            .on("mouseover", function (event, d) {
                tooltip
                    .style("visibility", "visible") // Affiche le tooltip
                    .text(`Exercice: ${d.exerciceBudgetaire}, Montant: ${formatter.format(d.montant)}`);
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("top", event.pageY + 10 + "px") // Déplace le tooltip avec la souris
                    .style("left", event.pageX + 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden"); // Cache le tooltip quand la souris quitte le point
            });

        svgElement
            .selectAll(".dot")
            .data(data_selected)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
            .attr("cy", d => ySelected(d.montant))
            .attr("r", 5)
            .attr("fill", "red")
            .on("mouseover", function (event, d) {
                tooltip
                    .style("visibility", "visible")
                    .text(`Exercice: ${d.exerciceBudgetaire}, Montant: ${formatter.format(d.montant)}`);
            })
            .on("mousemove", function (event) {
                tooltip.style("top", event.pageY + 10 + "px").style("left", event.pageX + 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
            });

        // Create legend
        const legend = svgElement.append("g").attr("transform", `translate(0, -55)`);

        legend.append("rect").attr("width", 12).attr("height", 12).attr("fill", "steelblue");

        legend
            .append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text("Montant total")
            .style("font-size", "12px")
            .style("font-family", "Marianne");

        legend.append("rect").attr("y", 20).attr("width", 12).attr("height", 12).attr("fill", "red");

        legend
            .append("text")
            .attr("x", 20)
            .attr("y", 30)
            .text("Montant pour le programme et region selectionné")
            .style("font-size", "12px")
            .style("font-family", "Marianne");
    }

    onMount(updateChart);

    $: if (data_selected) {
        updateChart();
    }
</script>

<svg bind:this={svg} />
