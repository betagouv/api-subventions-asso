<script>
// @ts-nocheck

  export let legend_data;
  export let legend_color_function;
  export let maxTextWidth = 100;

    // Fonction pour découper le texte en plusieurs lignes
  function splitText(text) {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";
    
    words.forEach((word) => {
      // Ajouter un mot à la ligne si ça ne dépasse pas la largeur max
      if ((currentLine + " " + word).length * 6 <= maxTextWidth) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);  // Ajouter la dernière ligne

    return lines;
  }
</script>

{#each legend_data as d, i}
  <g transform="translate(0, {i * 30 + 10})">
    <rect
      x="25"
      width="20"
      height="20"
      fill={legend_color_function(d)} />
    
    <!-- Textes avec gestion de coupure -->
    <text x="60" y="20">
      {#each splitText(d) as line, index}
        <tspan x="60" dy={index === 0 ? 0 : 15}>{line}</tspan>
      {/each}
    </text>
  </g>
{/each}

<style>
  text {
    fill: #0a0b0e;
  }
</style>