var mqtt;
var reconnectTimeout = 2000;
var host = "test.mosquitto.org";
var port = 8080;
var tempFloat = null;

function MQTTConnect() {
  console.log("Conectando " + host + " " + port);
  mqtt = new Paho.MQTT.Client(host, port, "clientId");
  var options = {
    timeout: 10,
    keepAliveInterval: 10,
    onSuccess: onConnect,
    onFailure: onError,
  };
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.onConnectionLost = onError;
  mqtt.connect(options);
}

function onConnect() {
  console.log("Conectado");
  mqtt.subscribe("/temp/value/01");
}

function onError(message) {
  console.log("Falha: " + message.errorCode + " " + message.errorMessage);
  setTimeout(MQTTConnect, reconnectTimeout);
}

function onMessageArrived(msg) {
  console.log("Mensagem: " + msg.destinationName + "=" + msg.payloadString);

  if (msg.destinationName == "/temp/value/01") {
    var t = document.getElementById("temp");

    t.innerText = msg.payloadString;
    tempFloat = parseFloat(msg.payloadString);

    atualizaRelogio();

    dataTemp.setValue(0, 1, msg.payloadString);
    chartTemp.draw(dataTemp, optionsTemp);

    // dataLineTemp.setValue(0, 1, msg.payloadString);
    // chartLineTemp.draw(dataLineTemp, optionsLineTemp);
  }
  if (tempFloat) {
    dataLine.addRows([[new Date(), tempFloat]]);
    if (dataLine.getNumberOfRows() > 20) {
      dataLine.removeRow(0);
    }
    tempFloat = null;
    chartLine.draw(dataLine, optionsLine);
  }
}

function atualizaRelogio() {
  var momentoAtual = new Date();

  var vhora = momentoAtual.getHours();
  var vminuto = momentoAtual.getMinutes();
  var vsegundo = momentoAtual.getSeconds();

  var vdia = momentoAtual.getDate();
  var vmes = momentoAtual.getMonth() + 1;
  var vano = momentoAtual.getFullYear();

  if (vdia < 10) {
    vdia = "0" + vdia;
  }
  if (vmes < 10) {
    vmes = "0" + vmes;
  }
  if (vhora < 10) {
    vhora = "0" + vhora;
  }
  if (vminuto < 10) {
    vminuto = "0" + vminuto;
  }
  if (vsegundo < 10) {
    vsegundo = "0" + vsegundo;
  }

  dataFormat = vdia + "-" + vmes + "-" + vano;
  horaFormat = vhora + ":" + vminuto + ":" + vsegundo;

  document.getElementById("data").innerHTML = dataFormat;
  document.getElementById("hora").innerHTML = horaFormat;

  setTimeout("atualizaRelogio()", 1000);
}

// grafico

var chartTemp;
var dataTemp;
var optionsTemp;

var chartLine;
var dataLine;
var optionsLine;

google.charts.load("current", {
  packages: ["gauge", "corechart"],
  language: "pt-br",
  mapsApiKey: "AIzaSyBWF8UvD9TyJSKsSCKP3PtHisRPbG4zuRA",
});

google.charts.setOnLoadCallback(drawTemp);
google.charts.setOnLoadCallback(drawLine);

function drawTemp() {
  dataTemp = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["Temp. °C", 0],
  ]);
  optionsTemp = {
    min: -10,
    max: 50,
    majorTicks: ["-10", "0", "10", "20", "30", "40", "50"],
    minorTicks: 2,
    greenFrom: -10,
    greenTo: 5,
    greenColor: "#00c0ff",
    redFrom: 30,
    redTo: 50,
  };
  chartTemp = new google.visualization.Gauge(
    document.getElementById("temp_chart")
  );
  chartTemp.draw(dataTemp, optionsTemp);
}

function drawLine() {
  // Desenha Gráfico de Linhas
  dataLine = new google.visualization.DataTable();
  dataLine.addColumn("datetime", "Hora");
  dataLine.addColumn("number", "Temp");
  optionsLine = {
    title: "Gráfico Temperatura x Tempo",
    pointSize: 5,
    legend: {
      position: "right",
    },
    animation: {
      duration: 500,
      easing: "out",
    },
    curveType: "function",
    hAxis: {
      title: "Horário",
      format: "HH:mm:ss",
      gridlines: {
        count: 8,
      },
    },
    vAxis: {
      title: "Valor (°C)",
      format: "long",
      gridlines: {
        count: 8,
      },
      viewWindow: {
        min: 0,
        max: 50,
      },
    },
  };
  dataLine.addRows([[new Date(), 0]]);
  chartLine = new google.visualization.LineChart(
    document.getElementById("line")
  );
  chartLine.draw(dataLine, optionsLine);
}
