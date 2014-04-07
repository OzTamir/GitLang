var repoChart = function repoChart(user, repo){

var url = "https://api.github.com/repos/"
url += user + '/' + repo + '/languages';

//"danasilver/danasilver.org/languages";
d3.json(url, makeChart);

function makeChart(languageJSON) {

  // Format the data to work with D3
  var dataArray = [],
      dataKeyVal = [];

  for (lang in languageJSON) {
    dataArray.push(languageJSON[lang]);
  }

  for (lang in languageJSON) {
    dataKeyVal.push({"lang": lang, "bytes": languageJSON[lang]});
  }

	 var margin = {top: 10, right: 20, bottom: 20, left: 60},
	    width = 500 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .domain(dataKeyVal.map(function(d) { return d.lang; } ))
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .domain([0, d3.max(dataKeyVal, function(d) { return d.bytes })])
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var chart = d3.select(".vertical-bar-chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	chart.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	chart.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)

	d3.select(".vertical-bar-chart").append("text")
	    .style("text-anchor", "end")
	    .attr("transform", "translate(15," + height / 2 + "), rotate(-90)")
	    .text("Bytes");

	var bar = chart.selectAll(".bar")
	    .data(dataKeyVal)
	  .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x(d.lang) + ",0)"; })

	bar.append("rect")
	    .attr("class", "bar")
	    .attr("y", function(d) { return y(d.bytes); })
	    .attr("height", function(d) { return height - y(d.bytes); })
	    .attr("width", x.rangeBand())

	bar.append("text")
	    .attr("x", x.rangeBand() / 2)
	    .attr("y", function(d) { return y(d.bytes) + 3; })
	    .attr("dy", ".75em")
	    .text(function(d) { return d.bytes; });

}
};

var createList = function(user, data){
	var list = '';
	for(var i = 0; i < data.length; i++) {
		var href = "<a href='#" + data[i] + "' id='repoNum" + i + "' class='text-center'>" + data[i] + "</a>";
		console.log(href);
		if(i != data.length - 1){
			href += ' | '
		};
		list += href
	}
	$('#menu').html(list);
	repoChart(user, data[0]);
	$('#chartTitle').html(data[0]);
	return list;
};

var getRepos = function(username){
	var repos = new Array();
	$.getJSON('https://api.github.com/users/' + username + '/repos', function(data) {
	    for (var i = 0; i < data.length; i++) { 
		    repos.push(data[i].name);
		    console.log(data[i].name);
		};
		// I know the placing is poor, but otherwise it runs before repo is finished initializing
		var repoList = createList(username, repos);
	});
	return repos;
};

