generateChart()
function generateChart(series) {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Interferências"
        },
        axisX: {
            valueFormatString: "HH mm:ss"
        },
        axisY: {
            title: "",
            includeZero: false
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
            yValueFormatString: "#0.## °C",
            showInLegend: true,
            dataPoints: [
                { x: new Date(3660000), y: 0 },
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


