function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var samplemetaData = d3.select('#sample-metadata');
  d3.json("/metadata/" + sample).then( data =>{
  // Use `.html("") to clear any existing metadata
  samplemetaData.html("");
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  console.log(Object.entries(data));
  console.log(samplemetaData)
  Object.entries(data).forEach(([key,value]) =>{
    samplemetaData
    .append('p')
    .text(`${key} : ${value}`)
    });
// BONUS: Build the Gauge Chart
buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // Building the bubble plot
  d3.json("/samples/" + sample).then(function (data) {
    // BUBBLE CHART
    console.log("this worked")
    var bubble = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: `markers`,
      text: data.otu_labels,
      marker: {
        color:data.otu_ids,
        size: data.sample_values}};
    var data = [bubble];
    var layout = {
      showlegend: false,
      height: 600,
      width: "100%",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample"},
      title: "Belly Button Biodiversity"
    };
    Plotly.newPlot("bubble", data, layout);
  });

   // Building the pie chart 
   d3.json("/samples/" + sample).then(function(data) {
     var otu_ids = data["otu_ids"];
     var otu_labels = data["otu_labels"];

     otu_ids = otu_ids.slice(0, 10);
     otu_labels = otu_labels.slice(0, 10);

    var piechart = [{
      values: otu_ids,
      labels: otu_ids,
      hovertext: otu_labels, 
      type:"pie"}];

    var layout = {
      height: 550,
      width: 550,
      showlegend:true,
      legend: {
        "orientation":"v",
        "x":1.02,
        "xanchor":"right",
        "y":1.0,
        "yanchor": "bottom"
      }
    };
    Plotly.newPlot('pie', piechart, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  console.log("it worked");
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();