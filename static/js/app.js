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
    const sampleData = initialSampleId.sample_values.map((value, index) => ({
        value,
        otu_id: initialSampleId.otu_ids[index],
        label: initialSampleId.otu_labels[index]
    }));

    // Sort the sampleData in descending order by sample_values
    sampleData.sort((a, b) => b.value - a.value);

    // Take the top 10 values for the chart
    const top10SampleData = sampleData.slice(0, 10);

    const sample_values = top10SampleData.map(data => data.value).reverse(); // Reverse order
    const otu_ids = top10SampleData.map(data => `OTU ${data.otu_id}`).reverse(); // Reverse order
    const otu_labels = top10SampleData.map(data => data.label).reverse(); // Reverse order
  
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