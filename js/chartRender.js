var chart;
function generateChart(series) {
    chart = new CanvasJS.Chart("chartContainer", {
        theme : 'light2',
        animationEnabled: true,
        title: {
            text: "Interferências"
        },
        axisX: {
             valueFormatString: "DD/MM/YY",
             crosshair: {
                 enabled: true,
                 snapToDataPoint: true
             }
        },
        axisY: {
            title: "Tempo de Parada",             
            tickLength: 15,            
            gridThickness: 2,        
            includeZero: true,
            stripLines:[
                {                
                    value:3200000,
                    thickness:2
                }],
            labelFormatter: function(e) {
                return msToTime(e.value)            
            },
            crosshair: {                 
                 snapToDataPoint: true
             }
        },
        legend: {
            cursor: "pointer",
            fontSize: 16,
            itemclick: toggleDataSeries,
            reversed: true,
			verticalAlign: "center",
			horizontalAlign: "right"
        },
        toolTip: {
            animationEnabled: true,
            shared: false,
            contentFormatter: function(e) {     
             //    return msToTime(e.entries[0].dataPoint.y);               
                let time = msToTime(e.entries[0].dataPoint.y)
                return (e.entries[0].dataSeries.name) + ': ' + time;       
            }
        },
        data: series
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


