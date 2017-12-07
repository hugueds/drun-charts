generateChart()
function generateChart(series) {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Interferências"
        },
        axisX: {
            // valueFormatString: "HH mm:ss"
        },
        axisY: {
            title: "PARANAUE",
            includeZero: false,
            labelFormatter: function(e) {
                // console.log(e)
            }
        },
        legend: {
            cursor: "pointer",
            fontSize: 16,
            itemclick: toggleDataSeries
        },
        toolTip: {
            shared: true
        },
        data: [{
            name: "Myrtle Beach",
            type: "spline",
            //yValueFormatString:  function() {  return msToTime("x: ##")},
            showInLegend: true,
            dataPoints: [                
                {x: 1, y: "00:00:01"},
                {x: 2, y: "00:00:01"},
                {x: 3, y: "00:01:01"}
                // { x: new Date(2017, 6, 24), y: 31 },
                // { x: new Date(2017, 6, 24), y: 32 },
                // { x: new Date(2017, 6, 24), y: 12 },                
                // { x: new Date(2017, 6, 25), y: 31 },
                // { x: new Date(2017, 6, 26), y: 29 },
                // { x: new Date(2017, 6, 27), y: 29 },
                // { x: new Date(2017, 6, 28), y: 31 },
                // { x: new Date(2017, 6, 29), y: 30 },
                // { x: new Date(2017, 6, 30), y: 29 }
            ]
        },
        {
            name: "Martha Vineyard",
            type: "spline",
            yValueFormatString: "#0.## °C",
            showInLegend: true,
            dataPoints: [
                // { x: new Date(2017, 6, 24), y: 20 },
                // { x: new Date(2017, 6, 25), y: 20 },
                // { x: new Date(2017, 6, 26), y: 25 },
                // { x: new Date(2017, 6, 27), y: 25 },
                // { x: new Date(2017, 6, 28), y: 25 },
                // { x: new Date(2017, 6, 29), y: 25 },
                // { x: new Date(2017, 6, 30), y: 25 }
            ]
        },
        {
            name: "Nantucket",
            type: "spline",
            yValueFormatString: "#0.## °C",
            showInLegend: true,
            dataPoints: [
                // { x: new Date(2017, 6, 24), y: 22 },
                // { x: new Date(2017, 6, 25), y: 19 },
                // { x: new Date(2017, 6, 26), y: 23 },
                // { x: new Date(2017, 6, 27), y: 24 },
                // { x: new Date(2017, 6, 28), y: 24 },
                // { x: new Date(2017, 6, 29), y: 23 },
                // { x: new Date(2017, 6, 30), y: 23 }
            ]
        }]
    });

    function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
    
        return hours + ":" + minutes + ":" + seconds;
    }

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
    
    chart.render();
}


