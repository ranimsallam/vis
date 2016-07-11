var margin = {top: 30, right: 20, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return "Number:"+d.NUMBER + "<br>"+"Artist:<br>"+FixString(d.ARTIST); });
function FixString(string)
{
  res = string.split(',');
  console.log(res);
  var newString = "";
  for (i =0; i< res.length; i++)
  {
    newString += res[i]+"<br>";
  }
  console.log(newString)
  return newString;
}

d3.tsv("dataset/ArtistChart.tsv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.NUMBER; }));
  y.domain([0, d3.max(data, function(d) { return d.SONGS; })]);

  svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("SONGS");

  svg.call(tip);
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.NUMBER); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.SONGS); })
      .attr("height", function(d) { return height - y(d.SONGS); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
});

function type(d) {
  d.SONGS = +d.SONGS;
  return d;
}
