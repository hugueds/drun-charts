var api = 'http://10.8.66.4/LTSApi/api/interferences?days=';
var days = 1;
var data = null;
var rawData = null;
var responsibles = null;
var dataSeries = null;


// Verificar se é process Stop Time
// 

// Se for 1 dia agrupar por hora, se for 7 dias agrupar por dias

window.onload = () => {

    // request(api + days, (err, response) => {
    request('http://localhost:3000/samples/request.json', (err, response) => {
        if (!errorCheck(err)) {
            rawData = JSON.parse(response).sort((a,b) => a.TimeStamp - b.TimeStamp);
            console.log(rawData);
            
            responsibles = Object.values(groupBy(rawData, 'Responsible'))
                .map((r, i) => r.filter(f => f.isProcessStopTime))
                .map(r => {
                    r.map(d => {
                        d["Date"] = d.TimeStamp.slice(0, 10);
                        d["TimeAmountMS"] = timeToMs(d.TimeAmount);
                    });                    
                    return Object.values(groupBy(r, "Date"));
                });           
                
            dataSeries = responsibles.map( resp => {
                return new DataSerie(resp);
            });

            generateChart(dataSeries)
            // responsibles = responsibles.map(r => {
            //     r.map(d => d["Date"] = d.TimeStamp.slice(0, 10));
            //     return Object.values(groupBy(r, "Date"));
            // });

            // responsibles.map( r => {
            //     dataSeries.push(new DataSerie(r));
            // });

        }
    });
}

function DataSerie(dataSerie) {
    this.name = dataSerie[0][0].Responsible;
    this.type = "spline";
    this.showInLegend = true;
    this.dataPoints = dataSerie.map( days => {
        var times = [];
        days.map( a => times.push(a.TimeAmountMS))
        return { x: new Date(days[0].TimeStamp), y: times.reduce((a,b)=> a+b)}
    }).sort((a,b) => a.x - b.x);
    console.log((this));
    
    // this.dataPoints = dataSerie.map( ds => )
}


function request(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                callback(null, xhr.responseText);
            } else {
                callback(new Error("Erro na requisição"));
            }
        }
    }
    xhr.send(null);
}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function errorCheck(err) {
    if (err) {
        console.error(err);
        return true;
    }
    return false;
}

function sumTimes(times) {
    let ms = 0;
    for (let i = 0; i < times.length; i++) {
        ms += (times[i].split(':')[0] * 3600000)
        ms += (times[i].split(':')[1] * 60000)
        ms += (times[i].split(':')[2] * 1000)
    }
    return msToTime(ms);
}

function timeToMs(time) {
    let ms = 0;
    ms += (time.split(':')[0] * 3600000)
    ms += (time.split(':')[1] * 60000)
    return ms += (time.split(':')[2] * 1000)    
}

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



data: [
    {
        name: "Myrtle Beach",
        type: "spline",
        yValueFormatString: "#0.## °C",
        showInLegend: true,
        dataPoints: [
            { x: new Date(2017, 6, 24), y: 31 },
            { x: new Date(2017, 6, 24), y: 32 },
            { x: new Date(2017, 6, 24), y: 12 },
            { x: new Date(2017, 6, 25), y: 31 },
            { x: new Date(2017, 6, 26), y: 29 },
            { x: new Date(2017, 6, 27), y: 29 },
            { x: new Date(2017, 6, 28), y: 31 },
            { x: new Date(2017, 6, 29), y: 30 },
            { x: new Date(2017, 6, 30), y: 29 }
        ]
    }]