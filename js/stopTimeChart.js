var stopTimeChart;

function generateStopTimeChart(series) {
    stopTimeChart = new CanvasJS.Chart("stopTimeChart", {
        animationEnabled: true,
        title: {
            text: "STOP TIME POR FUNÇÃO"
        },
        axisY: {
            title: "TEMPO DE PARADA"
        },
        data: new Array(series)
    });
    stopTimeChart.render();
}
