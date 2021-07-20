const graf = d3.select('#graf')
const anchoTotal = graf.style('width').slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16
/*
var indice = document.name_select.selectedIndex 
var valor = document.name_select.options[indice].value 
*/
var ob = document.getElementById("id_sel");
var indiceee= ob.selectedIndex;
var valor = ob.options[indiceee].value;
var tmp_barras = null;

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
let allData2 = []
let fiveStates = []
let five_temp ;
function init(){
d3.csv('DATOS_INEA_2019.csv').then(data => {
  data.forEach(d => {
   d.MetaAnual = parseInt(d.MetaAnual.split(",").join("").trim());
   d.LogrosObtenidos = parseInt(d.LogrosObtenidos.split(",").join("").trim());
   console.log("typeof LogrosObtenidos "+typeof LogrosObtenidos);
  })


  console.log("data en for each: " + data)
  const CFX = crossfilter(data);
  const dimension = CFX.dimension(function (d){ return d.MetaAnual; });
  
  console.dir(dimension.top(Infinity).length);
  fiveStates = dimension.filterRange([15000, 30000]);
  console.log("fiveStates: " + fiveStates);
  console.dir("dimension.top" + dimension.top(Infinity));
   five_temp=  dimension.top(Infinity);
  console.log(five_temp);
  console.dir("dimension.top(Infinity).length "+ dimension.top(Infinity).length);
  allData = data.slice(0, 32)
  allData2 = five_temp.slice(0, 5)
  console.log("allData: " + allData);
  //fiveStates = data.slice(0, 5);
  console.log("todos los datos despues de aplicar slice " + allData)

  

  if(valor === "todos"){
    console.log("el valor elegido es: " + valor);
    render(allData)
  }else if(valor == "altas15"){

    if(xAxisGroup != null){
      xAxisGroup.empty;
    }
    render(five_temp);
    console.log("el valor elegido es (most5: " + valor);
  }
})
}

function render(data) {
  // [binding] ENTER - update - exit
  let barras = g.selectAll('rect')
  .remove()
  .exit()
  .data(data)


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
    .range(['#7CB9E8'])


   xAxisGroup = g.append('g')
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
console.log(xAxisGroup);
  const yAxisGroup = g.append('g')
      .attr('class', 'ejes')
      .call(
        d3.axisLeft(y)
          .ticks(4)
          .tickSize(-ancho)
          .tickFormat(d => `${d}`)
          //.tickFormat(d3.format("s"))
          
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

init();


function changeFunc(){
ob = document.getElementById("id_sel");
indiceee= ob.selectedIndex;
valor = ob.options[indiceee].value;
svg.selectAll("g.ejes").remove();
init();
}
