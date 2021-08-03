var mqtt;
var reconnectTimeout = 2000;
var host = "test.mosquitto.org";
var port = 8080;

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
    atualizaRelogio();
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
