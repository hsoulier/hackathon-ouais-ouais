import jsonAccount from "../../assets/json/myAccount.json"
let dashboard = document.querySelector("#dashboard");
let tabAccount = document.querySelector("#tableAccount tbody");
let selectCrypto = document.querySelector("#crypto");
let variationWallet = 0;
let url = "https://api.alternative.me/v2/ticker/";

let data = [];

const getData = async () => {
  try {
      let response = await fetch(url)
      if(response.ok) {
          data = await response.json(); 
          Object.values(data.data).map((cryptos,round) => {
            if (round < 9) {
              dashboard.innerHTML += `
                    <article>
                        <div class="article__header">
                          <div class="article__header__img">
                            <img src="../../assets/icon_crypto/${cryptos.name}.svg"></img>
                          </div>
                          <div class="article__header__info">
                            <h2>${cryptos.name}</h2>
                            <span class="symbole">${cryptos.symbol}</span>
                          </div>
                        </div>
                        <div class="article__information">
                          <div class="article__information__evolution">
                            <p class="priceCrypto">$${cryptos.quotes.USD.price}</p>
                            <p class="evolution">Évolution des dernières 24h :</p>
                            <span class="percent_change_24h">${cryptos.quotes.USD.percent_change_24h > 0 ? '+' : ''} ${cryptos.quotes.USD.percent_change_24h.toFixed(2)}%
                              ${cryptos.quotes.USD.percent_change_24h > 0 ? '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.014 11.998c0 5.517 4.48 9.997 9.998 9.997s9.997-4.48 9.997-9.997c0-5.518-4.479-9.998-9.997-9.998s-9.998 4.48-9.998 9.998zm6.211-1.524s1.505-1.501 3.259-3.254c.146-.147.338-.22.53-.22s.384.073.53.22c1.754 1.752 3.258 3.254 3.258 3.254.145.145.217.335.217.526 0 .192-.074.384-.221.53-.292.293-.766.295-1.057.004l-1.977-1.977v6.693c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-6.693l-1.979 1.978c-.289.289-.761.287-1.054-.006-.147-.147-.221-.339-.222-.53 0-.191.071-.38.216-.525z" fill-rule="nonzero"/></svg>' : '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.005 12.002c0-5.517 4.48-9.997 9.997-9.997 5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998zm6.21 1.524s1.505 1.501 3.259 3.254c.147.147.338.22.53.22s.384-.073.531-.22c1.753-1.752 3.258-3.254 3.258-3.254.145-.145.217-.335.216-.526 0-.192-.074-.384-.22-.53-.293-.293-.766-.295-1.057-.004l-1.978 1.977v-6.693c0-.414-.336-.75-.75-.75s-.75.336-.75.75v6.693l-1.978-1.978c-.289-.289-.762-.287-1.055.006-.146.147-.22.339-.221.53s.071.38.215.525z" fill-rule="nonzero"/></svg>'}
                            </span>
                          </div>
                        </div>
                    </article>
                `;
            }
            let tabCryptoAccount = document.querySelectorAll(".name");
            let tabCryptoAccountPrice = document.querySelectorAll(".price");
            tabCryptoAccount.forEach((element,i) =>{
              let priceCrypto = cryptos.quotes.USD.price
              if(element.innerHTML === cryptos.name){
                tabCryptoAccountPrice[i].innerHTML = priceCrypto;
                let pourcent = -(cryptos.quotes.USD.percent_change_24h) / 100;
                if(cryptos.quotes.USD.percent_change_24h < 0) variationWallet -= pourcent * priceCrypto;
                else variationWallet += (priceCrypto * cryptos.quotes.USD.percent_change_24h) / 100;
              }
            })
          });
          document.querySelector(".variation__Wallet").innerHTML = "$ " + parseFloat(variationWallet).toFixed(2);
          total();
          setTimeout(() => {
            total();
          }, 300);
      } else {
          console.error('Retour du serveur : ', response.status)
      }
  } catch (e) {
      console.log(e)
  }
}
getData();
const getCrypto = async() =>{
  Object.values(jsonAccount).map(element =>{
    tabAccount.innerHTML += `
      <tr class="wallet">
          <td class="name">${element.name}</td>
          <td class="price"></td>
          <td class="quantity">${element.quantity}</td>
          <td class="total"></td>
      </tr>
    `
    selectCrypto.innerHTML += `
    <option value="${element.name}">${element.name}</option>
    `
  });
}

getCrypto();


let dash = document.querySelectorAll(".btnNav a");
let divDashboard = document.querySelectorAll(".dashboardSettings");
dash.forEach(function (items,i){
  items.addEventListener("click",function (){
    divDashboard.forEach(function (item,y){
      dash[y].classList.remove("active");
      item.classList.remove("active");
    });
    items.classList.add("active");
    divDashboard[i].classList.add("active");
  });
});

//set up total
function total(){
  let tabTable = document.querySelectorAll(".wallet");
  let totalPrice = 0;
  document.querySelector(".totalInfo").innerHTML = 0;
  tabTable.forEach(element =>{
    let totalWalletPrice = 0;
    let totalCount = 0;
    let totalInfo = document.querySelector(".totalInfo").innerHTML;
    totalCount = totalCount + totalInfo;
    totalPrice += parseFloat(element.querySelector(".total").innerHTML);
    
    document.querySelector(".totalInfo").innerHTML = "$ " + totalPrice;
    
    totalWalletPrice += element.querySelector(".quantity").innerHTML * element.querySelector(".price").innerHTML;
    element.querySelector(".total").innerHTML = totalWalletPrice.toFixed(2);
  });
}

//Envoie crypto

let submitBtn = document.querySelector(".crypto__virement form input[type=submit]");
let moneyInput = document.querySelector(".crypto__virement form input#money");
let moneySelector = document.querySelector(".crypto__virement form select#crypto");

let cryptoWallet = document.querySelectorAll(".crypto__myAccount table tr.wallet");

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(moneyInput.value != "" && moneySelector.value != "") {
    cryptoWallet.forEach(element => {
      let cryptoWalletName = element.getElementsByTagName("td")[0].innerHTML;

      if(moneySelector.value == cryptoWalletName) {
        // if(moneyInput.value < element.getElementsByTagName("td")[2].innerHTML) {
          element.getElementsByTagName("td")[2].innerHTML = element.getElementsByTagName("td")[2].innerHTML - moneyInput.value;
          total();
        // } else {
        //   alert("Vous n'avez pas les fonds nécessaires");
        // }
      }
    });
  } else {
    alert("Veuillez compléter les champs du formulaire");
  }
})



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
let tabBank = document.querySelector("#tableBank tbody");

Object.keys(json[0]).forEach(key => {
console.log(json[0][key]["balance"]);

xValues.push(json[0][key]["name"]);
yValues.push(json[0][key]["balance"]);
});

new Chart("bank__bars", {
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
  },
  scales: {
    yAxes: [{
        display: true,
        ticks: {
            beginAtZero: true
        }
    }]
}
}
});


var xValues = ["19/09","20/09","21/09"];

new Chart("bank__graph", {
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

if(tabBank){
Object.keys(json[0]).forEach(key => {
  tabBank.innerHTML += `
      <tr class="wallet">
          <td class="bank">`+json[0][key]["name"]+`</td>
          <td class="total">`+json[0][key]["balance"]+`</td>
          <td class="currency">`+json[0][key]["currency"]+`</td>
          <td class="iban">`+json[0][key]["iban"]+`</td>
      </tr>
    `
});
}