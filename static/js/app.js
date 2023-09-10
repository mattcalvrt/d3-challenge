// Define the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and populate the initial demographic info and charts
d3.json(url).then(function (jsonData) {
    console.log(jsonData);
  // Populate the select options with test subject IDs
  const selectElement = d3.select("#selDataset");
  jsonData.names.forEach(name => {
    selectElement.append("option").attr("value", name).text(name);
  });

  // Get the first test subject ID and populate demographic info and charts
  let initialMetadata = jsonData.metadata[0];
  let initialSampleId = jsonData.names[0];
  updateDemographicInfo(initialMetadata, jsonData);
  createBarChart(jsonData.samples.find(sample => sample.id === initialSampleId));
  createBubbleChart(jsonData.samples.find(sample => sample.id === initialSampleId));
});

  // Function to update the demographic info panel
function updateDemographicInfo(initialMetadata){
    // Find the selected test subject metadata
  
    // Select the panel div and clear its content
    const panelDiv = d3.select("#sample-metadata");
    panelDiv.html("");
  
    // Loop through the metadata and append each key-value pair as a paragraph
    for (const [key, value] of Object.entries(initialMetadata)) {
      panelDiv.append("p").text(`${key}: ${value}`);
    }
  }
  
// Function to create the initial bar chart
function createBarChart(initialSampleId) {
    const sample_values = initialSampleId.sample_values.slice(0, 10);
    const otu_ids = initialSampleId.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const otu_labels = initialSampleId.otu_labels;
  
    const chartData = [{
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      type: "bar",
      orientation: "h",
    }];
  
    const layout = {
      title: "Top 10 OTU IDs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" },
      height: 600,
      width: 600,
    };
  
    // Create the bar chart using Plotly
    Plotly.newPlot("bar", chartData, layout);
  }
  
// Function to create the initial bubble chart
function createBubbleChart(initialSampleId) {
    const bubbleData = [{
      x: initialSampleId.otu_ids,
      y: initialSampleId.sample_values,
      text: initialSampleId.otu_labels,
      mode: 'markers',
      marker: {
        size: initialSampleId.sample_values,
        color: initialSampleId.otu_ids,
        colorscale: 'Viridis'
      }
    }];
  
    const bubbleLayout = {
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      showlegend: false,
      height: 500,
      width: 1200,
    };
  
    // Create the bubble chart using Plotly
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  }
  
// Function to handle the select element change event
function optionChanged(sampleId) {
    // Fetch the JSON data
    d3.json(url).then(function (jsonData) {
      // Call the function to update demographic info
      let updatedMetadata = jsonData.metadata.find(metadata => metadata.id === +sampleId);
      updateDemographicInfo(updatedMetadata);
  
      // Call the functions to create the charts
      let selectedSample = jsonData.samples.find(sample => sample.id === sampleId);
      createBarChart(selectedSample);
      createBubbleChart(selectedSample);
    });
  };

  



  
