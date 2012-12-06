function DrawGrid(){
	for(var i = 30; i < 531; i += 50){
			var myLine = d3.select("g").append("svg:line")
		    .attr("x1", i)
		    .attr("y1", 30)
		    .attr("x2", i)
		    .attr("y2", 530)
		    .style("stroke", "rgb(120,120,120)");
	}
	for(var j = 30; j < 531; j += 50){
			var myLine = d3.select("g").append("svg:line")
		    .attr("x1", 30)
		    .attr("y1", j)
		    .attr("x2", 530)
		    .attr("y2", j)
		    .style("stroke", "rgb(120,120,120)");
	}
}



