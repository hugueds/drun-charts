var api = 'http://10.8.66.4/LTSApi/api/interferences?days=';
var days = 1;
var data = null;
var responsibles = null;
var dataSeries = null;


// Verificar se é process Stop Time
// 

// Se for 1 dia agrupar por hora, se for 7 dias agrupar por dias

window.onload = () => {

    request(api + days, (err, response) => {
        if (!errorCheck(err)) {
            data = JSON.parse(response);
            responsibles = Object.values(groupBy(data, 'Responsible'))
                .map((r, i) => r.filter(f => f.isProcessStopTime));

            responsibles = responsibles.map(r => {
                r.map(d => d["Date"] = d.TimeStamp.slice(0, 10));
                return Object.values(groupBy(r, "Date"));
            });
            
            responsibles.map( r => {
                dataSeries.push(new DataSerie(r));
            });
            
        }
    });
}

function DataSerie(dataSerie) {
    this.name = dataSerie.Responsible;
    this.type = "spline";
    this.showInLegend = true;    
    this.dataPoints = dataSerie.map( ds => )
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