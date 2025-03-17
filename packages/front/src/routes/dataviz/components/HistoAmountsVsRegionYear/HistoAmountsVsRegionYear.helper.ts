import * as d3 from "d3";
import { montantFormatter } from "../../dataViz.helper";
import type { PartialAmountsVsProgramRegionDto } from "../../@types/AmountsVsYear.types";

export function createHistoAmountsVsRegionYear(
    svg: SVGSVGElement,
    dataHisto: PartialAmountsVsProgramRegionDto[],
    width: number,
    height: number,
    margin: { top: number; right: number; bottom: number; left: number },
) {
    if (!svg || !dataHisto) return;
    d3.select(svg).selectAll("*").remove();

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

    // Groupes uniques pour les régions et les années
    const regions = [...new Set(dataHisto.map(d => d.regionAttachementComptable))];
    const years = [...new Set(dataHisto.map(d => d.exerciceBudgetaire))].sort((a, b) => a - b);

    // Échelle X pour les régions
    const x0 = d3.scaleBand().domain(regions).range([0, svgWidth]).padding(0.3);

    // Échelle X secondaire pour les années (dans chaque région)
    const x1 = d3.scaleBand().domain(years).range([0, x0.bandwidth()]).padding(0.05);

    // Échelle Y pour les valeurs

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(dataHisto, (d: PartialAmountsVsProgramRegionDto) => d.montant)])
        .nice()
        .range([svgHeight, 0]);

    // Sélection de l'élément SVG
    const svgElement = d3
        .select(svg)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svgElement
        .append("g")
        .attr("transform", `translate(0,${svgHeight})`)
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-family", "Marianne")
        .attr("dy", "0.5em");

    // Ajout de l'axe Y
    svgElement.append("g").call(d3.axisLeft(y));

    // Création des barres
    svgElement
        .selectAll("g.region")
        .data(regions)
        .enter()
        .append("g")
        .attr("transform", (d: PartialAmountsVsProgramRegionDto) => `translate(${x0(d)},0)`)
        .selectAll("rect")
        .data(
            region => dataHisto.filter(d => d.regionAttachementComptable === region), // Filtrer les données par région
        )
        .enter()
        .append("rect")
        .attr("x", (d: PartialAmountsVsProgramRegionDto) => x1(d.exerciceBudgetaire))
        .attr("y", (d: PartialAmountsVsProgramRegionDto) => y(d.montant))
        .attr("width", x1.bandwidth())
        .attr("height", (d: PartialAmountsVsProgramRegionDto) => svgHeight - y(d.montant))
        .attr("fill", (d: PartialAmountsVsProgramRegionDto) => colors(d.exerciceBudgetaire)) // Couleur selon l'année
        // Ajout des événements mouseover et mouseout
        .on("mouseover", (event, d) => {
            // Afficher un tooltip avec la valeur
            tooltip
                .style("visibility", "visible")
                .html(
                    `Région: ${d.regionAttachementComptable}<br/>Année: ${
                        d.exerciceBudgetaire
                    }<br/>Montant: ${montantFormatter.format(d.montant)}`,
                )
                .style("left", `${event.pageX + 5}px`) // Décalage de la position de la souris
                .style("top", `${event.pageY + 5}px`);
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden"); // Cacher le tooltip
        });

    // Créer un élément tooltip caché au départ
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.75)")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // Ajouter la legende
    const legend = svgElement.append("g").attr("transform", `translate(${svgWidth - 10}, 20)`);
    // Ajouter des rectangles colorés et les textes de légende pour chaque année
    legend
        .selectAll("rect")
        .data(years)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 25) // Espacement vertical
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => colors(d)); // Couleur de chaque année

    legend
        .selectAll("text")
        .data(years)
        .enter()
        .append("text")
        .attr("x", 30) // Décalage horizontal du texte par rapport au rectangle
        .attr("y", (d, i) => i * 25 + 15) // Centrer le texte verticalement par rapport au rectangle
        .text(d => d) // Texte correspondant à chaque année
        .style("font-size", "12px")
        .style("font-family", "Marianne");

    const zoom = d3
        .zoom()
        .scaleExtent([0.5, 5]) // Limite de zoom
        .on("zoom", function (event) {
            svgElement.attr("transform", event.transform); // Appliquer la transformation de zoom
        });

    svgElement.call(zoom);
}
