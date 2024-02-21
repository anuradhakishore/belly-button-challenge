//Defining a constant variable for URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
const datapromise=d3.json(url);
console.log(datapromise)


//Defining four function in this code

//creating function to draw bargraph
//creating function to draw bubblegraph
//creating function to show metadata and key value pair
//primary function is for extracting sampleID 





  //Function for drawing bar graphs

function bar(sampleId) {
    console.log(`Bargraph(${sampleId})`);

    d3.json(url).then(data => {
        console.log(data);

        let samples = data.samples;
        let final = samples.filter(s => s.id == sampleId);
        let result = final[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let y_axis= otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

        // Create a trace object
        let trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: y_axis,
            type: 'bar',
            text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
        };

        // Put the trace object into an array
        let graph = [trace1];

        // Create a layout object
        let layout = {
            title: "top 10 OTUs found in that individual",
            margin: {t: 40, l: 200}
        };

        //plotting by  Plotly function
        Plotly.newPlot('bar', graph, layout);
    })
}

function bubble(sampleId) {
    console.log(`Bubblegraph(${sampleId})`);

    d3.json(url).then(data => {
        let samples = data.samples;
        let final = samples.filter(s => s.id == sampleId);
        let result = final[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // Create a trace
        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        }

        // Put the trace into an array
        let graph = [trace2];

        // Create a layout object
        let layout = {
            title: 'Displays each sample',
            margin: {t: 30},
            xaxis: {title: "OTU ID"},
        };

        // plotting by  Plotly function
        Plotly.newPlot('bubble', graph, layout);
    })
}


function metadata(sampleId) {
    console.log(`Metadata(${sampleId})`);

    d3.json(url).then((data) => {
        let metadata = data.metadata;
        console.log(metadata);

        // Filtering data
        let result = metadata.filter(meta => meta.id == sampleId)[0];
        let demographicInfo = d3.select('#sample-metadata');

        // Clear existing data in demographicInfo
        demographicInfo.html('');

        // Adding the key value pair
        Object.entries(result).forEach(([key, value]) => {
            demographicInfo.append('h6').text(`${key}: ${value}`);
        });
    });
}


//this function is taken from index.html to change the dropdown

function optionChanged(sampleId) {
    console.log(`optionChanged, new value: ${sampleId}`);

    bar(sampleId);
    bubble(sampleId);
    metadata(sampleId);
};

//Initial function for extracting sampleId

function primary() {
  
    // selecting dropdown
    let selection = d3.select('#selDataset');
  
    d3.json(url).then(data => {
        let sample_Names = data.names;
        console.log('sample_names:', sample_Names);
  
        // Populating the dropdown
        for (let i = 0; i < sample_Names.length; i++) {
            let sampleId = sample_Names[i];
            selection.append('option').text(sampleId).property('value', sampleId);
        };
  
        // Read the current value from the dropdown
        let initialId = selection.property('value');
        console.log(`initialId = ${initialId}`);
  
        // Drawing the graphs for selected sample id's
        bar(initialId);
        bubble(initialId);
  
        //Displaying metadata
        metadata(initialId);
  
    })};
  

primary();