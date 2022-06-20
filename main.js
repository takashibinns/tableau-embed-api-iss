import {
    TableauViz,
    TableauEventType,
} from 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';

//  Function that runs, when the web page is loaded
let startup = () => {
    //  Get a reference to the <tableau-viz>
    let viz = document.getElementById('tableauViz1');
 
    //  Add an event handler, to trigger the getValue() function after the dashboard has loaded
    viz.addEventListener(TableauEventType.FirstInteractive, async (event) => {
        //  Execute the getValue function right now
        getValue(viz);
        //  Execute the getValue function again, every 8 seconds
        window.setInterval(() => { getValue(viz); },8000);
    });
}

//  Function that runs, when the Tableau viz has finished loading
function getValue(viz) {

    //  Define the function to run, when we get the response from the API
    let callComplete = async(data) => {

        //  Make sure we get back a successful response
        if (data.readyState === 4 && data.status === 200) {

            //  Parse out the lat/lng values from the JSON response
            let lat = data.responseJSON.iss_position.latitude,
                long = data.responseJSON.iss_position.longitude;

            /************************************************/
            /*  Update the parameters of the Tableau viz    */
            /************************************************/

            //  Pause updates on the dashboard
            let pause = await viz.pauseAutomaticUpdatesAsync();

            //  Set both parameters
            let workbook = viz.workbook;
            let latParam =  await workbook.changeParameterValueAsync('Lat',lat);
            let lngParam = await workbook.changeParameterValueAsync('Long',long);

            //  Resume automatic updates on the dashboard
            let resume = await viz.resumeAutomaticUpdatesAsync();
        }
    }

    //  Define the request's options
    const options = {
        type: 'GET',
        dataType: 'jsonp',
        url: 'http://api.open-notify.org/iss-now.json',
        async: false,
        crossDomain: true,
        complete: callComplete
    }

    //  Make the API call to fetch the space station's current lat/lng
    $.ajax(options);
}

//  Execute our code!
startup();