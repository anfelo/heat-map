var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var colors = [
	{text:0, color:'rgb(94, 79, 162)'},
	{text:2.7, color:'rgb(50, 136, 189)'},
	{text:3.9, color:'rgb(102, 194, 165)'},
	{text:5, color:'rgb(171, 221, 164)'},
	{text:6.1, color:'rgb(230, 245, 152)'},
	{text:7.2, color:'rgb(255, 255, 191)'},
	{text:8.3, color:'rgb(254, 224, 139)'},
	{text:9.4, color:'rgb(253, 174, 97)'},
	{text:10.5, color:'rgb(244, 109, 67)'},
	{text:11.6, color:'rgb(213, 62, 79)'},
	{text:12.7, color:'rgb(158, 1, 66)'}
];

var margin = {top: 100, right: 80, bottom: 90, left: 80},
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scale.linear()
	.range([0, width]);

var y = d3.scale.ordinal()
    .rangeBands([0, height]);

var xAxis = d3.svg.axis()
    .scale(x)
		.orient("bottom")
		.ticks(26);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
  	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.append("text")
			.attr("x", (width / 2))             
			.attr("y", - margin.top/2)
			.attr("class","chart-title")
			.attr("text-anchor", "middle")  
			.text("Monthly Global Land-Surface Temperature")

chart.append("text")
			.attr("x", (width / 2))             
			.attr("y", - margin.top/2 + 30)
			.attr("class","chart-title-subheading")
			.attr("text-anchor", "middle")
			.text("(1753 - 2015)")

chart.append("text")
			.attr("x", 0)             
			.attr("y", height + 80)
			.attr("class","caption")
			.attr("text-anchor", "start")
			.text("*Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average. Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07")

legends = chart.append("g")
								.attr("class", "legends")
								.attr("transform", "translate("+(width+20)+", 20)");

legends.selectAll("g")
			.data(colors)
			.enter()
			.append("g")
			.attr("class", "legend")
			.attr("transform", function(d,i){
				return "translate(0,"+ i*20 + ")"
			})
			.append("rect")
			.attr("transform", "translate(0,-20)")
			.attr("fill", function(d, i) { return d.color })
			.attr("height", 20)
			.attr("width", "40");

legends.selectAll("g.legend")
			.append("text")
			.attr("text-anchor", "middle")
			.attr("y", -5)
			.attr("x", 20)
			.style("fill", "black")
			.style("font-size", "12px")
			.text(function(d,i){ return d.text });

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
		
var parseTime = d3.time.format("%Y");

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(error, data) {
	xDomain = d3.extent(data.monthlyVariance, function(element) {
		return element.year;
	});

	y.domain(data.monthlyVariance.map(function(d) { return monthNames[d.month-1]; }));
	x.domain(xDomain);

	chart.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.append("text")
				.attr("class", "axis-label")
				.attr("y", 40)
				.attr("x", width/2)
				.style("text-anchor", "middle")
				.style("font-size", "14px")
				.style("font-weight", "bold")
				.text("Years");

	chart.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("class", "axis-label")
				.attr("transform", "rotate(-90)")
				.attr("y", -60)
				.attr("x", -height/2)
				.attr("dy", ".71em")
				.style("text-anchor", "middle")
				.style("font-size", "14px")
				.style("font-weight", "bold")
				.text("Months");

	bars = chart.selectAll("g.bars")
								.data(data.monthlyVariance)
								.enter()
								.append("g")
								.attr("class", "bars")
								.attr("transform", function(d){
									return "translate(" + x(d.year) + "," + y(monthNames[d.month-1]) + ")"; 
								});		
	
	bars.append("rect")
			.attr("class", "bar")
			.attr("width", 4)
			.attr("height", y.rangeBand())
			.attr("fill", function(d){
				temp = data.baseTemperature + d.variance;
				return getColor(temp);
			});

	bars.on("mouseenter", function(d, i) {
			div.transition()		
					.duration(200)		
					.style("opacity", .9);		
			div.html("<h3>" + monthNames[d.month-1] + " - " + d.year + "</h3><p>Temp: "  + (data.baseTemperature + d.variance).toFixed(2) + "</p><p>Variance: " + d.variance + "</p>")	
					.style("left", (d3.event.pageX + 10) + "px")		
					.style("top", (d3.event.pageY - 28) + "px");	
	});

	bars.on("mouseleave", function(d, i) {
			div.transition()		
					.duration(500)		
					.style("opacity", 0);
	});
});

function getColor(temp) {
	if(temp < 2.7){
		return colors[0].color;
	} else if(temp < 3.9){
		return colors[1].color;
	} else if(temp < 5){
		return colors[2].color;
	} else if(temp < 6.1){
		return colors[3].color;
	} else if(temp < 7.2){
		return colors[4].color;
	} else if(temp < 8.3){
		return colors[5].color;
	} else if(temp < 9.4){
		return colors[6].color;
	} else if(temp < 10.5){
		return colors[7].color;
	} else if(temp < 11.6){
		return colors[8].color;
	} else if(temp < 12.7){
		return colors[9].color;
	} else {
		return colors[10].color;
	}
}