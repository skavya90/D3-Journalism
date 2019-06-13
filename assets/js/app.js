//set svg and chart dimensions
//set svg dimensions
var svgWidth = 960;
var svgHeight = 620;

//set borders in svg
var margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100
};

var dataLabels = {
    'poverty': 'Poverty',
    'age': 'Age',
    'income': 'Income',
    'healthcare': 'HealthCare',
    'obesity': 'Obesity',
    'smokes': 'Smokes'
}

//calculate chart height and width
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//append a div classed chart to the scatter element
var chart = d3.select("#scatter")
    .append("div")
    .classed("chart", true);

//append an svg element to the chart with appropriate height and width
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// function used for updating circles group with new tooltip
function toolUpdata(chosenXAxis, chosenYAxis, circlesGroup) {

    //select x label
    //poverty percentage
    if (chosenXAxis === 'poverty') {
        var xLabel = "Poverty:";
    }
    //household income in dollars
    else if (chosenXAxis === 'income') {
        var xLabel = "Median Income:";
    }
    //age (number)
    else {
        var xLabel = "Age:";
    }

    //select y label
    //percentage lacking healthcare
    if (chosenYAxis === 'healthcare') {
        var yLabel = "No Healthcare:"
    }
    //percentage obese
    else if (chosenYAxis === 'obesity') {
        var yLabel = "Obesity:"
    }
    //smoking percentage
    else {
        var yLabel = "Smokers:"
    }

    //create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) { 
            return `<strong>${d.state}</strong>`
            +'<br>'
            +`${dataLabels[chosenXAxis]}: ${d[chosenXAxis]}`
            +'<br>'
            +`${dataLabels[chosenYAxis]}: ${d[chosenYAxis]}`
          });

    circlesGroup.call(toolTip);

    //add events
    circlesGroup.on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);

    return circlesGroup;
}
//retrieve csv data and execute everything below
d3.csv("./assets/data/data.csv").then(function(statesData) {

    console.log(statesData);

    //parse data
    statesData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //create first linear scales
    var xLinearScale = xScale(statesData, chosenXAxis);
    var yLinearScale = yScale(statesData, chosenYAxis);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(statesData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("opacity", ".5");

    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(statesData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 2)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr})
        .attr("text-anchor", "middle");

    //create group for 3 x-axis labels
    var xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var xLabel1 = xLabels.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)");

    var xLabel2 = xLabels.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Age (Median)")

    var xLabel3 = xLabels.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Household Income (Median)")

    //create group for 3 y-axis labels
    var yLabels = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

    var yLabel1 = yLabels.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var yLabel2 = yLabels.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 40)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokes (%)");

    var yLabel3 = yLabels.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obese (%)");

    //function for updating Tooltip with data
    var circlesGroup = toolUpdata(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis labels event listener
    xLabels.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != chosenXAxis) {

                //replace chosenXAxis with value
                chosenXAxis = value;

                //update x scale for new data
                xLinearScale = xScale(statesData, chosenXAxis);

                //update x axis with transition
                xAxis = renderX(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update text with new x values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update tooltips with new info
                circlesGroup = toolUpdata(chosenXAxis, chosenYAxis, circlesGroup);

                //change classes to change bold text
                if (chosenXAxis === "poverty") {
                    xLabel1.classed("active", true).classed("inactive", false);
                    xLabel2.classed("active", false).classed("inactive", true);
                    xLabel3.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    xLabel1.classed("active", false).classed("inactive", true);
                    xLabel2.classed("active", true).classed("inactive", false);
                    xLabel3.classed("active", false).classed("inactive", true);
                }
                else {
                    xLabel1.classed("active", false).classed("inactive", true);
                    xLabel2.classed("active", false).classed("inactive", true);
                    xLabel3.classed("active", true).classed("inactive", false);
                }
            }
        });

    //y axis labels event listener
    yLabels.selectAll("text")
    .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");

        //check if value is same as current axis
        if (value != chosenYAxis) {

            //replace chosenYAxis with value
            chosenYAxis = value;

            //update y scale for new data
            yLinearScale = yScale(statesData, chosenYAxis);

            //update x axis with transition
            yAxis = renderY(yLinearScale, yAxis);

            //update circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update text with new y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

            //update tooltips with new info
            circlesGroup = toolUpdata(chosenXAxis, chosenYAxis, circlesGroup);

            //change classes to change bold text
            if (chosenYAxis === "obesity") {
                yLabel3.classed("active", true).classed("inactive", false);
                yLabel2.classed("active", false).classed("inactive", true);
                yLabel1.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                yLabel3.classed("active", false).classed("inactive", true);
                yLabel2.classed("active", true).classed("inactive", false);
                yLabel1.classed("active", false).classed("inactive", true);
            }
            else {
                yLabel3.classed("active", false).classed("inactive", true);
                yLabel2.classed("active", false).classed("inactive", true);
                yLabel1.classed("active", true).classed("inactive", false);
            }
        }
    });    
});


//function used for updating x-scale var upon clicking on axis label
function xScale(statesData, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(statesData, d => d[chosenXAxis]) * 0.8,
            d3.max(statesData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

//function used for updating y-scale var upon clicking on axis label
function yScale(statesData, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(statesData, d => d[chosenYAxis]) * 0.8,
            d3.max(statesData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}

//function used for updating xAxis var upon click on axis label
function renderX(scaleX, xAxis) {
    var bottomAxis = d3.axisBottom(scaleX);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

//function used for updating yAxis var upon click on axis label
function renderY(scaleY, yAxis) {
    var leftAxis = d3.axisLeft(scaleY);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

//function used for updating circles group with a transition to new circles
//for change in x axis or y axis
function renderCircles(circlesGroup, scaleX, chosenXAxis, scaleY, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => scaleX(data[chosenXAxis]))
        .attr("cy", data => scaleY(data[chosenYAxis]));

    return circlesGroup;
}

//function used for updating state labels with a transition to new 
function renderText(textGroup, scaleX, chosenXAxis, scaleY, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => scaleX(d[chosenXAxis]))
        .attr("y", d => scaleY(d[chosenYAxis]));

    return textGroup;
}
//function to stylize x-axis values for tooltips



