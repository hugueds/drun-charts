var api = 'http://10.8.66.4/LTSApi/api/interferences?days=';
var days = 30;
var data = null;
var rawData = null;
var responsibles = null;
var dataSeries = null;

// Verificar se é process Stop Time
// Se for 1 dia agrupar por hora, se for 7 dias agrupar por dias

window.onload = () => {
    getServerData(days, function(dataSeries) {
        generateChart(dataSeries);
    });             
}

function DataSerie(dataSerie) {
    if (dataSerie[0]){
        this.name = dataSerie[0][0].Responsible        
    }
    this.type = "line";
    this.showInLegend = true;    
    this.dataPoints = dataSerie.map( days => {        
        let times = [];    
        days.map( a => times.push(a.TimeAmountMS))        
        return { x: new Date(days[0].TimeStamp), y: times.reduce((a,b)=> a+b)}
    }).sort((a,b) => a.x - b.x);
    
}

function getServerData(days, callback) {
    request(api + days, (err, response) => {
        // request('http://localhost:3000/samples/request.json', (err, response) => {
            if (!errorCheck(err)) {
                rawData = JSON.parse(response);                
                responsibles = orderByResponsible(rawData)
                    .map((r, i) => filterStopTime(r))
                    .map(r => {
                        generateDateTime(r);                   
                        return Object.values(groupBy(r, "Date"));
                    });           
                    
                dataSeries = responsibles.map( resp => new DataSerie(resp));                
                callback(dataSeries);                
            }
        });
}

function orderByResponsible(data) {
     return Object.values(groupBy(data, 'Responsible'))
}

function filterStopTime(data) {
    return data.filter(f => f.isProcessStopTime)
}

function groupByDate(data) {
        
}

function generateDateTime(data) {
    return data.map(d => {
        d["Date"] = d.TimeStamp.slice(0, 10);
        d["TimeAmountMS"] = timeToMs(d.TimeAmount);
    }); 
}

function updateChart() {
    let day = document.getElementById('select-days').value;
    getServerData(day, function(dataSeries) {
        generateChart(dataSeries);        
    });
}

function updateObjective() {
    console.log(document.getElementById('target-minute').value)
    let min = parseInt(document.getElementById('target-minute').value) * 60 * 1000 || 0;
    let sec = parseInt(document.getElementById('target-second').value)  * 1000 || 0;
    let ms = min + sec;
    chart.axisY[0].stripLines[0].set('value',ms);
}

var inputs = document.getElementsByTagName('input');

for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', (e) => {
        let target = e.target.value
        if ( target > 59) {
            e.target.value = 59;
        }
    });
}






