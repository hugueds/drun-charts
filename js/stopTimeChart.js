var stopTimeChart;

function generateStopTimeChart() {
    var stopTimeChart = new CanvasJS.Chart("stopTimeChart", {
        animationEnabled: true,
        title: {
            text: "STOP TIME POR FUNÇÃO"
        },
        axisY: {
            title: "TEMPO DE PARADA"
        },
        data: [{
            type: "column",
            dataPoints: [
                {  y: 71, label: "Hugo"  },
                { x: 20, y: 55 },
                { x: 30, y: 50 },
                { x: 40, y: 65 },
                { x: 50, y: 95 },
                { x: 60, y: 68 },
                { x: 70, y: 28 },
                { x: 80, y: 34 },
                { x: 90, y: 14 }
            ]
        }]    
    });
    stopTimeChart.render();
}


generateStopTimeChart();