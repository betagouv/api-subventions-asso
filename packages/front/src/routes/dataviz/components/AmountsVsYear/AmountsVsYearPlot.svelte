<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    //import CategoryLegend from "./CategoryLegend.svelte";
    //import Labels from "./Labels.svelte";
    import * as d3 from 'd3';

    export let data_year;
    export let data_selected;

    let svg;
    let width = 1000;
    let height = 400;

    const margin = { top: 20, right: 320, bottom: 40, left: 90 };
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;
    onMount(() => {

        const years = [...new Set(data_year.map((d) => d.exerciceBudgetaire))];
        console.log(years);
        // Créer l'échelle X (temps)
        const x = d3
        .scaleBand()
        .domain(years)
        .range([0, svgWidth]);

        // Créer l'échelle Y (valeurs)
        
        const y = d3
        .scaleLinear()
        .domain([0, d3.max(data_year, (d) => d.montant)])
        .nice()
        .range([svgHeight, 0]);

        // Créer l'échelle Yselected (valeurs)
        
        
        const ySelected = d3
        .scaleLinear()
        .domain([0, d3.max(data_selected, (d) => d.montant)])
        .nice()
        .range([svgHeight, 0]);
        
        // Créer la ligne
        const line = d3
        .line()
        .x((d) => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
        .y((d) => y(d.montant));
        
        const lineSelected = d3
            .line()
            .x((d) => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
            .y((d) => ySelected(d.montant));
        
        // Sélectionner l'élément SVG
        
        const svgElement = d3
        .select(svg)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Ajouter la ligne au graphique
        svgElement
        .append('path')
        .data([data_year])
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2);
        
        
        svgElement
            .append('path')
            .data([data_selected])
            .attr('class', 'line')
            .attr('d', lineSelected)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 2);

            
        // Ajouter l'axe X
        svgElement
        .append('g')
        .attr('transform', `translate(0,${svgHeight})`)
        .call(d3.axisBottom(x))
        ;

        // Ajouter l'axe Y
        svgElement.append('g').call(d3.axisLeft(y));

        svgElement.append('g').call(d3.axisRight(ySelected))
        .attr('transform', `translate(${svgWidth },0)`);
        
    const tooltip = d3
        .select('body') 
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background-color', 'rgba(0, 0, 0, 0.7)')
        .style('color', 'white')
        .style('padding', '5px')
        .style('border-radius', '4px');
        
    // Ajouter des points à chaque donnée pour interagir avec le curseur
    svgElement
        .selectAll('.dot')
        .data(data_year)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
        .attr('cy', (d) => y(d.montant))
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .on('mouseover', function (event, d) {
        tooltip
            .style('visibility', 'visible') // Affiche le tooltip
            .text(`Exercice: ${d.exerciceBudgetaire}, Montant: ${d.montant}`);
        })
        .on('mousemove', function (event) {
        tooltip
            .style('top', event.pageY + 10 + 'px') // Déplace le tooltip avec la souris
            .style('left', event.pageX + 10 + 'px');
        })
        .on('mouseout', function () {
        tooltip.style('visibility', 'hidden'); // Cache le tooltip quand la souris quitte le point
        });

        svgElement
        .selectAll('.dot')
        .data(data_selected)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.exerciceBudgetaire) + x.bandwidth() / 2)
        .attr('cy', (d) => ySelected(d.montant))
        .attr('r', 5)
        .attr('fill', 'red')
        .on('mouseover', function (event, d) {
        tooltip
            .style('visibility', 'visible') // Affiche le tooltip
            .text(`Exercice: ${d.exerciceBudgetaire}, Montant: ${d.montant}`);
        })
        .on('mousemove', function (event) {
        tooltip
            .style('top', event.pageY + 10 + 'px') // Déplace le tooltip avec la souris
            .style('left', event.pageX + 10 + 'px');
        })
        .on('mouseout', function () {
        tooltip.style('visibility', 'hidden'); // Cache le tooltip quand la souris quitte le point
        });

        
    });
</script>

  

<svg bind:this={svg}>
</svg>