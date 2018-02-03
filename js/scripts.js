var api2 = 'http://10.8.66.4/LTSApi/api/interferences?days=';
var api = 'http://10.8.66.4/LTSApi/api/interferences?startDate={startDate}&endDate={endDate}';

var filteredData = null;
var line = null;
var data = null;
var rawData = null;
var responsibles = null;
var functionStopTime = null;
var dataSeries = null;
var inputs = document.getElementsByTagName('input');
var groups = document.getElementById('select-group');
var line = document.getElementById('select-line');
var day = document.getElementById('select-day');
var startDate = $("#start-date");
var endDate = $("#end-date");
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


window.onload = function () {
    loadChart();
    generateOptions();
}

function loadChart() {
    getServerData(function (err, data) {
        if (err) return console.error(err);
        rawData = JSON.parse(data);        
        rawData = generateDateTime(rawData);
        filteredData = filterData(rawData);        
        generateDataSeries(filteredData, line.value, generateChart);
    });
}

function DataSerie(dataSerie) {
    if (!dataSerie.length) {
        return;
    }
    this.name = dataSerie[0][0].Responsible;
    this.type = "line";
    this.visible = true;
    this.showInLegend = true;
    this.dataPoints = dataSerie.map(generateDataPoints)
        .sort(function (a, b) { return (a.x - b.x) });        
}

function generateDataPoints(data) {
    var times = data.map(function (a) { return a.TimeAmountMS }).reduce(function (a, b) { return (a + b) });
    return {
        x: new Date(data[0].TimeStamp),
        y: times
    }    
}

function getServerData(days, callback) {
    request(api + days, function (err, response) {
        if (err)
            return callback(err);
        return callback(null, response);
    });
}

function generateDataSeries(data, line, callback) {    
    data = filterLine(data, line);        
    responsibles = groupByResponsible(data).map(groupByDate);               
    dataSeries = responsibles.map(function (resp) { return new DataSerie(resp) });
    callback(dataSeries);
}



function selectGroup() {
    if (groups.value == "Todos") {
        return loadChart();        
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

function generateDateTime(data) {
    data.map(function (d) {
        d["Date"] = d.TimeStamp.slice(0, 10);
        d["TimeAmountMS"] = timeToMs(d.TimeAmount);
    });
    return data;
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

function getServerData(callback) {    
    var url = api.replace('{startDate}', startDate.val()).replace('{endDate}', endDate.val());
    request(url, function (err, response) {
        if (err)
            return callback(err);
        return callback(null, response);
    });
}


for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', function (e) {
        var target = e.target.value
        if (target > 59) {
            e.target.value = 59;
        }
    });
}

