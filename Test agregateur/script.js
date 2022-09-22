const json = [
    {
        "0" : {
            "id": 123,
            "name": "Credit Agricole",
            "number": 212366548,
            "iban": "FR1221954549412158521",
            "type": "checking",
            "balance": 1452.56,
            "pastbalance":{
                "19/09/22" : 1345.16,
                "20/09/22" : 1400.50,
                "21/09/22" : 900.27
            },
            "coming": null,
            "currency": "EUR",
            "transactions" : {
                "0" : {
                    "lorem ipsum" : -16.50,
                    "lorem apsum" : 45.06,
                    "lorem epsum" : -20.99
                },
                "1" : {
                    "Lorem Ipmum" : 45.89,
                    "Lorem Iasum" : -200.16,
                    "Lorem Iesum" : 157.12
                },
                "2" : {
                    "loraem ipsum" : -16.50,
                    "loreem ipsum" : 45.06,
                    "loredm ipssum" : -20.99
                    },
                "3" : {
                    "Lorzem Ipsum" : 45.89,
                    "Lorem Ipqsum" : -200.16,
                    "Lordem Ipsum" : 157.12
                }
            }
        },
        "1" :{
            "id": 416,
            "name": "BNP Paribas",
            "number": 48976516354,
            "iban": "FR1221954549412158521",
            "type": "savings",
            "balance": 1514.83,
            "pastbalance":{
                "19/09/22" : 1500,
                "20/09/22" : 1000.83,
                "21/09/22" : 1654.83
            },
            "coming": null,
            "currency": "EUR",
            "transactions" : {
                "0" : {
                    "Saving up" : 6514.83
                }
            }
        },
        "2" :{
            "id": 520,
            "name": "Lydia",
            "number": 4876513865,
            "iban": "FR1221954549412158521",
            "type": "online",
            "balance": 1000,
            "pastbalance":{
                "19/09/22" : 0,
                "20/09/22" : 450.23,
                "21/09/22" : 1200.89
            },
            "coming": null,
            "currency": "EUR",
            "transactions" : {
                "0" : {
                    "Lorzem Ipsum" : 45.89,
                    "Lorem Ipsdum" : -200.16,
                    "Losrem Ipsum" : 157.12
                }
            }
        }
    }
]




var xValues = [];
var yValues = [];
var barColors = ["#3399FF", "#33FFFF","#33FF99"];

Object.keys(json[0]).forEach(key => {
  console.log(json[0][key]["balance"]);

  xValues.push(json[0][key]["name"]);
  yValues.push(json[0][key]["balance"]);
});

new Chart("bankbars", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Vos comptes aujourd'hui"
    }
  }
});


var xValues = ["19/09","20/09","21/09"];

new Chart("banktotal", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      data: getline(0),
      borderColor: "#3399FF",
      fill: false
    },{
      data: getline(1),
      borderColor: "#33FFFF",
      fill: false
    },{
      data: getline(2),
      borderColor: "#33FF85",
      fill: false
    }]
  },
  options: {
    legend: {display: false},
      title: {
      display: true,
      text: "Totaux sur ces 3 derniers jours"
    }
  }
});

function getline(count) {
  var linetable = [];

  Object.keys(json[0][count]["pastbalance"]).forEach(key => {
    console.log(json[0][count]["pastbalance"][key]);
  
    linetable.push(json[0][count]["pastbalance"][key]);
  });

  return linetable;
}

var drawerbar = document.getElementById("drawerbar");

if(drawerbar){
  Object.keys(json[0]).forEach(key => {
  
    drawerbar.innerHTML += '<button class="baritem drawerbutton" onclick="opendrawer('+ json[0][key]["id"] +')">'+json[0][key]["name"]+'</button>';

  });
}

var drawers = document.getElementById("bankdrawers");

if(drawers){
  Object.keys(json[0]).forEach(key => {
    drawers.innerHTML += '<div id="'+ json[0][key]["id"] +'" class="drawer" style="display:none"><h2>'+ json[0][key]["name"] +'</h2><p>Account number : '+ json[0][key]["number"] +'</p><p>IBAN : '+ json[0][key]["iban"] +'</p><p>Today type : '+ json[0][key]["type"] +'</p><h2>Balance : '+ json[0][key]["balance"] +'</h2></div>';
  });
}

function opendrawer(drawername) {
  var i;
  var x = document.getElementsByClassName("drawer");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(drawername).style.display = "block";
}