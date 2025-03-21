import * as d3 from "d3";
import { montantFormatter } from "../../dataViz.helper";
import type { PartialAmountsVsProgramRegionDto } from "../../@types/AmountsVsYear.types";

export function updateChart(
    svg: SVGSVGElement,
    data_all: PartialAmountsVsProgramRegionDto[],
    data_selected: PartialAmountsVsProgramRegionDto[],
    width: number,
    height: number,
    margin: { top: number; right: number; bottom: number; left: number },
) {
    if (!svg || !data_all) return;
    d3.select(svg).selectAll("*").remove();

    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

    const years = [...new Set(data_all.map(d => d.exerciceBudgetaire))];

    // Create X scale (years)
    const x = d3.scaleBand().domain(years).range([0, svgWidth]);

    // Create Y left scale (values)
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data_all, d => d.montant)])
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
        .data([data_all])
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
        .data(data_all)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
        .attr("cy", d => y(d.montant))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .on("mouseover", function (event, d) {
            tooltip
                .style("visibility", "visible") // Affiche le tooltip
                .text(`Exercice: ${d.exerciceBudgetaire}, Montant: ${montantFormatter.format(d.montant)}`);
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
                .text(`Exercice: ${d.exerciceBudgetaire}, Montant: ${montantFormatter.format(d.montant)}`);
        })
        .on("mousemove", function (event) {
            tooltip.style("top", event.pageY + 10 + "px").style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

    // Create legend

    const legendItems = [
        { color: "steelblue", text: "Montant total" },
        { color: "red", text: "Montant pour le programme et region selectionné" },
    ];

    const legend = svgElement.append("g").attr("transform", `translate(0, -55)`);

    const legendGroups = legend
        .selectAll("g")
        .data(legendItems)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendGroups
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => d.color);

    legendGroups
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .text(d => d.text)
        .style("font-size", "12px")
        .style("font-family", "Marianne");
}
