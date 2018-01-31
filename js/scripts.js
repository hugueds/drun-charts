var api = 'http://10.8.66.4/LTSApi/api/interferences?days=';
var days = 7;
var line = null;
var data = null;
var rawData = null;
var responsibles = null;
var functionStopTime = null;
var dataSeries = null;
var inputs = document.getElementsByTagName('input');
var groups = document.getElementById("select-group");
var line = document.getElementById("select-line");
var day = document.getElementById('select-day');
var oce = 0;
var calcOce = 0;
var interferenceGroups = {
    "Todos": [],
    "Qualidade": ["QUAL", "LTS", "QG FA5"],
    "Produção": ["PROD GG", "PROD DV", "PROD TR", "FA0", "FA1.1", "FA1.2", "FA2", "FA3.1", "FA3.2", "FA4", "FA5"],
    "Logística": ["LOG MP", "LOG MH"],
    "Manutenção": ["MAN ROF", "MAN EQ"],
    "Fabricas": ["MOT", "CAB", "TRANSM"],
    "Outros": ["IT SLA", "ENG PR", "ENG PP"]
};

var filteredData;

window.onload = function () {
    getServerData(days, function (err, data) {
        if (err)
            return console.error(err);
        rawData = JSON.parse(data);
        generateDataSeries(rawData, line.value = 0, generateChart);
        filteredData = filterResponsible(rawData, "IND");
        filteredData = groupByFunction(filteredData);
        console.log(filteredData);
        let series = new BarDataSerie(filteredData);
        generateStopTimeChart(series);        
    });
    generateOptions();

}

function DataSerie(dataSerie) {
    this.name = dataSerie[0][0].Responsible;
    this.type = "line";
    this.visible = true;
    this.showInLegend = true;
    this.dataPoints = dataSerie.map(function (days) {
        let times = [];
        days.map(function (a) { times.push(a.TimeAmountMS) });
        return { 
            x: new Date(days[0].TimeStamp), 
            y: times.reduce(function (a, b) { return (a + b) }) }})
                    .sort(function (a, b) { return (a.x - b.x) });
}

function BarDataSerie(data) {
    this.type = "column";
    this.showInLegend = true;
    this.legendMarkColor = "Funções";
    this.dataPoints = generateBarDataSeries(data);
}

function generateBarDataSeries(data) {
    return data.map(f => {
        let times = [];
        times.push(f.TimeAmountMS)        
        return {
            label: f[0].Function,
            y: 100 // times.reduce((a, b) => a.TimeAmountMS + b.TimeAmountMS)
        }
        
    });
}

function getServerData(days, callback) {
    request(api + days, function (err, response) {
        if (err)
            return callback(err);
        return callback(null, response);
    });
}

function generateDataSeries(data, line, callback) {
    data = filterResponsible(data, "IND");
    responsibles = orderByResponsible(data)
        .map(function (r) { return filterStopTime(r) })
        .map(function (r) {
            if (parseInt(line))
                return filterLine(r, line)
            return r;
        })
        .map(function (r) {
            generateDateTime(r);
            return Object.values(groupBy(r, "Date"));
        });
    dataSeries = responsibles.map(function (resp) { return new DataSerie(resp) });
    callback(dataSeries);
}

function orderByResponsible(data) {
    return Object.values(groupBy(data, 'Responsible'))
}

function filterStopTime(data) {
    return data.filter(function (f) { return f.isProcessStopTime });
}

function filterProcessAndStopTime(data) {
    return data.filter(function (f) { return f.isProcessStopTime || f.isStopTime });
}

function filterLine(data, line) {
    return data.filter(function (f) { return f.ProcessId == line });
}

function filterResponsible(data, responsible) {
    return data.filter(function (f) { return f.Responsible != responsible });
}

function selectGroup() {
    if (groups.value == "Todos") {
        updateChartDays();
        return;
    }
    var selected = interferenceGroups[groups.value];
    dataSeries.forEach(function (element) {
        for (var i = 0; i < selected.length; i++) {
            if (element.name == selected[i]) {
                element.visible = true;
                break;
            }
            element.visible = false;
        }
    });
    chart.render();
}

function groupByDate(data) {

}

function generateDateTime(data) {
    var data = data.map(function (d) {
        d["Date"] = d.TimeStamp.slice(0, 10);
        d["TimeAmountMS"] = timeToMs(d.TimeAmount);
    });
}

function updateChartDays() {
    groups.value = "Todos";
    getServerData(day.value, function (err, data) {
        if (err)
            return console.error(err);
        rawData = JSON.parse(data);
        generateDataSeries(rawData, line.value, generateChart);
    });
}

function updateLine() {
    groups.value = "Todos";
    getServerData(day.value, function (err, data) {
        if (err)
            return console.error(err);
        rawData = JSON.parse(data);
        generateDataSeries(rawData, line.value, generateChart);
    });
}

function updateObjective() {
    var min = parseInt(document.getElementById('target-minute').value) * 60 * 1000 || 0;
    var sec = parseInt(document.getElementById('target-second').value) * 1000 || 0;
    var ms = min + sec;
    chart.axisY[0].stripLines[0].set('value', ms);
}

function toggleSelection() {
    dataSeries.forEach(function (element) { element.visible = !element.visible; });
    chart.render();
}

function downloadChart() {
    var fileName = new Date().toISOString().slice(0, 10);
    chart.exportChart({ format: String("jpg"), fileName: fileName })
}

function printChart() {
    chart.print();
}

function generateOptions() {
    for (var key in interferenceGroups) {
        var option = document.createElement("OPTION");
        option.value = key;
        option.textContent = key;
        groups.appendChild(option);
    }
}


for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', function (e) {
        var target = e.target.value
        if (target > 59) {
            e.target.value = 59;
        }
    });
}

function groupByFunction(data) {
    var pattern = /(FA\d[\s\.]\d?)\s?P\d/;
    data.map(function (d) {
        if (d.CellDescription == "FA0") 
            d.Function = "FA0";        
        else if (pattern.test(d.StationDescription)) 
            d.Function = d.StationDescription.match(pattern)[1].replace(" ", "");        
    });
    return Object.values(groupBy(data, "Function"));    
}
