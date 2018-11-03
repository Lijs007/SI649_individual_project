var data = [];
var rawData = [];
var age = "1";
var year = "2018";
var koi = "all";
var weekList = [];


loadData();

$(document).ready(function () {
    loadData();
    visualizeMap(data);
    visualizeBarChart(rawData);
    visualizeBarChart1(weekList);
    visualizeBarChart2();
    visualizeBarChart3()
    wireButtonClickEvents();
});

// Loads the CSV file 
function loadData() {
    // load the demographics.csv file    
    // assign it to the data variable, and call the visualize function by first filtering the data
    // call the visualization function by first findingDataItem
    d3.csv("data/count_" + year + ".csv", function (d) {
        data = d;
        data.forEach(function (item) {
        item.num = parseInt(item.num);
        });
        });
    d3.csv("data/" + year + ".csv", function (d) {
        rawData = d;
        rawData.forEach(function (item) {
        item.Week = parseInt(item.Week);
        });
        });
}

// Finds the dataitem that corresponds to USER_SEX + USER_RACESIMP + USER_AGEGRP variable values
function findDataItem() {
    return data;
}

function getBool(item, value){
    if (value == "1" && item == "0") return false;
    else return true;
}

//Pass a single dataitem to this function by first calling findDataItem. visualizes square chart
function visualizeMap(data) {
    var width = $("#map").width(),
    height = 600;

    $("#map").empty();

    var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

    var path = d3.geoPath();
    d3.json("https://d3js.org/us-10m.v1.json", function (error, us) {
    if (error) throw error;
    var tooltip = d3.select("body").append("div").attr("class", "toolTip"); 
    svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path)
    .style('fill','red')
    .style('opacity', function(d) {
        name = getName(d.id);
        max = 0;
        for (i = 0; i < data.length; i++) {
            if (parseInt(data[i][koi]) > max) max = parseInt(data[i][koi]);
        }
        for (i = 0; i < data.length; i++) {
            if (data[i].name == name) {
                portion = parseInt(data[i][koi])/max;
                return 0.5 + 0.5*(2 - portion)*portion;
            }
        }
        return 0.5;
    })
    .on("mousemove", function (d) {
    tooltip
    .style("left", d3.event.pageX - 50 + "px")
    .style("top", d3.event.pageY - 70 + "px")
    .style("display", "inline-block")
    .html(getName(d.id) + " " + koi + ": " +  getNum(d))
    })
    .on("mouseout", function (d) {
    tooltip.style("display", "none");
    });;
        
        svg.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; })));

    });
}

function visualizeBarChart(dataitems) {
    max = 1;
    dataitems.forEach(function (item) {
        if (item['Week'] > max) max = item['Week'];
        });
    weekList = new Array(max);
    weekList.fill(0);
    dataitems.forEach(function (item) {
        weekList[item['Week'] - 1] += 1;
    });
    
    var margin = { top: 20, right: 20, bottom: 30, left: 60 },
	width = 940 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
	.domain(weekList.map(function (d,i) { return i; }))
	.range([0, width])
	.padding(0.1);

    var y = d3.scaleLinear()
	.domain([0, d3.max(weekList, function (d) { return d; })])
    .range([height, 0]);

    $("#bar1").empty();

    var svg = d3.select("#bar1").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
	"translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("#bar1").append("div").attr("class", "toolTip");
 
    svg.selectAll(".bar")
	.data(weekList)
	.enter().append("rect")
    .attr("class", "bar")
    svg.selectAll(".bar")
	.attr("fill", "#E0D22E")
	.attr("x", function (d, i) { return x(i); })
    .attr("width", x.bandwidth())
    .transition()
    .attr("height", function (d) { return height - y(d); })
    .duration(1000)
    .attr("y", function (d) { return y(d); });

     // add the x Axis
     svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
    .call(d3.axisLeft(y));  
    
}

function visualizeBarChart1(dataitems) {

    var weekCount = new Array(20);
    weekCount.fill(0);
    dataitems.forEach(function (item) {
        weekCount[item] += 1;
    });

    
    var margin = { top: 20, right: 20, bottom: 30, left: 60 },
	width = 940 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
	.domain(weekCount.map(function (d,i) { return i; }))
	.range([0, width])
	.padding(0.1);

    var y = d3.scaleLinear()
	.domain([0, d3.max(weekCount, function (d) { return d; })])
    .range([height, 0]);

    $("#bar2").empty();

    var svg = d3.select("#bar2").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
	"translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("#bar2").append("div").attr("class", "toolTip");
 
    svg.selectAll(".bar")
	.data(weekCount)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("fill", "#E0D22E")
    .attr("x", function (d, i) { return x(i); })
    .attr("width", x.bandwidth())
    .transition()
    .attr("height", function (d) { return height - y(d); })
    .duration(1000)
    .attr("y", function (d) { return y(d); });

    // add the x Axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    // add the y Axis
    svg.append("g")
    .call(d3.axisLeft(y));  
    
}


function visualizeBarChart2() {
    weekCount = [2,10,11,30,38,29,37,32,23,14,10,7,8,1,5,1,0,1,1]
    
    var margin = { top: 20, right: 20, bottom: 30, left: 60 },
	width = 940 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
	.domain(weekCount.map(function (d,i) { return i; }))
	.range([0, width])
	.padding(0.1);

    var y = d3.scaleLinear()
	.domain([0, d3.max(weekCount, function (d) { return d; })])
    .range([height, 0]);

    $("#bar3").empty();

    var svg = d3.select("#bar3").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
	"translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("#bar3").append("div").attr("class", "toolTip");
 
    svg.selectAll(".bar")
	.data(weekCount)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("fill", "#E0D22E")
    .attr("x", function (d, i) { return x(i); })
    .attr("width", x.bandwidth())
    .transition()
    .attr("height", function (d) { return height - y(d); })
    .duration(1000)
    .attr("y", function (d) { return y(d); });

    // add the x Axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    // add the y Axis
    svg.append("g")
    .call(d3.axisLeft(y));  
    
}

function visualizeBarChart3() {
    weekCount = [0.6,3.6,11,22.3,33.9,41.2,41.7,36.3,27.6,18.6,11.3,6.3,3.2,1.5,0.6,0.2,0.1,0,0]
    
    var margin = { top: 20, right: 20, bottom: 30, left: 60 },
	width = 940 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
	.domain(weekCount.map(function (d,i) { return i; }))
	.range([0, width])
	.padding(0.1);

    var y = d3.scaleLinear()
	.domain([0, d3.max(weekCount, function (d) { return d; })])
    .range([height, 0]);

    $("#bar4").empty();

    var svg = d3.select("#bar4").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
	"translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("#bar4").append("div").attr("class", "toolTip");
 
    svg.selectAll(".bar")
	.data(weekCount)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("fill", "blue")
    .attr("x", function (d, i) { return x(i); })
    .attr("width", x.bandwidth())
    .transition()
    .attr("height", function (d) { return height - y(d); })
    .duration(1000)
    .attr("y", function (d) { return y(d); });

    // add the x Axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    // add the y Axis
    svg.append("g")
    .call(d3.axisLeft(y));  
    
}

function getName(id) {
    for (index in IdToState) {
        if (id == IdToState[index].id) return IdToState[index].name;
    }
}

function getNum(d) {
    name = getName(d.id);
    for (i = 0; i < data.length; i++) {
        if (data[i].name == name) return data[i][koi];
    }
    return '0';
}

function getColor(id) {
    for (index in IdToState) {
        if (id == IdToState[index].id) return IdToState[index].name;
    }
}



function wireButtonClickEvents() {

    d3.selectAll("#koi .button").on("click", function () {
        koi = d3.select(this).attr("data-val");
        d3.select("#koi .current").classed("current", false);
        d3.select(this).classed("current", true);
        loadData();
        visualizeMap(data);
        visualizeBarChart(rawData);
        visualizeBarChart1(weekList);
    });

    d3.selectAll("#yearfilter .button").on("click", function () {
        year = d3.select(this).attr("data-val");
        d3.select("#yearfilter .current").classed("current", false);
        d3.select(this).classed("current", true);
        loadData();
        visualizeMap(data);
        visualizeBarChart(rawData);
        visualizeBarChart1(weekList);
    });
}
