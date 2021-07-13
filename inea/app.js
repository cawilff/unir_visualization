const graf = d3.select('#graf')
const anchoTotal = graf.style('width').slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const svg = graf
  .append('svg')
  .attr('width', anchoTotal)
  .attr('height', altoTotal)
  .attr('class', 'graf')

const margin = {
  top: 50,
  bottom: 250,
  left: 150,
  right: 50,
}

const ancho = anchoTotal - margin.left - margin.right
const alto = altoTotal - margin.top - margin.bottom

const g = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

let allData = []

d3.csv('DATOS_INEA_2019.csv').then(data => {
  data.forEach(d => {
   d.MetaAnual = parseInt(d.MetaAnual.split(",").join("").trim());
   d.LogrosObtenidos = parseInt(d.LogrosObtenidos.split(",").join("").trim());
   console.log("typeof LogrosObtenidos "+typeof LogrosObtenidos);
  })


  console.log("data en for each: " + data)

  allData = data.slice(0, 32)
  console.log("todos los datos despues de aplicar slice " + allData)

  render(allData)
})

function render(data) {
  // [binding] ENTER - update - exit
  let barras = g.selectAll('rect').data(data)


  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.MetaAnual)])
    .range([alto, 0])

  let x = d3.scaleBand()
    .domain(data.map(d => d.Entidad))
    .range([0, ancho])
    .paddingInner(0.2)
    .paddingOuter(0.5)

  let color = d3.scaleOrdinal()
    .domain(d3.map(allData, d => d.region))
    // .range(d3.schemeCategory10)
    .range(['#7CB9E8'])


  const xAxisGroup = g.append('g')
    .attr('transform', `translate(0, ${alto})`)
    .attr('class', 'ejes')
    .call(
      d3.axisBottom(x)
        .tickSize(-alto)
    )
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .attr('y', -15)
    .attr('x', -10)

  const yAxisGroup = g.append('g')
      .attr('class', 'ejes')
      .call(
        d3.axisLeft(y)
          .ticks(4)
          .tickSize(-ancho)
          .tickFormat(d => `${d} m.`)
      )

  barras
      .enter()
      .append('rect')
        .attr('x', d => x(d.Entidad))
        .attr('y', y(0))
        .attr('width', x.bandwidth())
        .attr('height', alto - y(0))
        .attr('fill', 'black')
      .transition()
      .duration(2000)
      .ease(d3.easeBounce)
        .attr('y', d => y(d.MetaAnual))
        .attr('fill', d => color(d.region))
        .attr('height', d => alto - y(d.MetaAnual))

  titleGroup = g.append('g')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', ancho/2)
        .attr('y', -10)
        .attr('class', 'titulo')
        .text('Meta anual de alfabetización INEA 2019')
}