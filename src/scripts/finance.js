// import { Chart } from 'chart.js';
let dashboard = document.querySelector("#dashboard");

let url = "https://api.alternative.me/v2/ticker/";

// const Chart = require('chart.js');
// import Chart from 'chart.js';

const getData = async () =>{
  const httpCall = await fetch(url);
  const response = await httpCall.json();
  
  return response;

}
const main = async() =>{
  
  let { data } = await getData();
  cryptos = Object.values(data);
  let round = 0;
  console.log(cryptos);
  cryptos.map(cryptos => {
    round++;

    if(round < 10) {
        dashboard.innerHTML += `
            <article>
                <div class="article__header">
                  <img src="../../assets/icon_crypto/bitcoin.svg"></img>
                  <div class="article__header__info">
                    <h2>${cryptos.name}</h2>
                    <span class="symbole">${cryptos.symbol}</span>
                  </div>
                </div>
                <div class="article__evolution">
                  <p class="price">$${cryptos.quotes.USD.price}</p>
                  <span class="percent_change_24h">${cryptos.quotes.USD.percent_change_24h > 0 ? '+ ' : ''} ${cryptos.quotes.USD.percent_change_24h.toFixed(2)}%
                    ${cryptos.quotes.USD.percent_change_24h > 0 ? '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.014 11.998c0 5.517 4.48 9.997 9.998 9.997s9.997-4.48 9.997-9.997c0-5.518-4.479-9.998-9.997-9.998s-9.998 4.48-9.998 9.998zm6.211-1.524s1.505-1.501 3.259-3.254c.146-.147.338-.22.53-.22s.384.073.53.22c1.754 1.752 3.258 3.254 3.258 3.254.145.145.217.335.217.526 0 .192-.074.384-.221.53-.292.293-.766.295-1.057.004l-1.977-1.977v6.693c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-6.693l-1.979 1.978c-.289.289-.761.287-1.054-.006-.147-.147-.221-.339-.222-.53 0-.191.071-.38.216-.525z" fill-rule="nonzero"/></svg>' : '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.005 12.002c0-5.517 4.48-9.997 9.997-9.997 5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998zm6.21 1.524s1.505 1.501 3.259 3.254c.147.147.338.22.53.22s.384-.073.531-.22c1.753-1.752 3.258-3.254 3.258-3.254.145-.145.217-.335.216-.526 0-.192-.074-.384-.22-.53-.293-.293-.766-.295-1.057-.004l-1.978 1.977v-6.693c0-.414-.336-.75-.75-.75s-.75.336-.75.75v6.693l-1.978-1.978c-.289-.289-.762-.287-1.055.006-.146.147-.22.339-.221.53s.071.38.215.525z" fill-rule="nonzero"/></svg>'}
                  </span>
                </div>
                <div class="article__graph">
                  <canvas id="${cryptos.name}"></canvas>
                </div>
            </article>
        `;

        let ctx = document.getElementById(cryptos.name);
        
        let config = {
           type: 'line',
           data: {
             labels: ['label 1', 'label 2', 'label 3'],
             datasets: [{
               data: [12, 19, 3],
             }],
           }
         }
        console.log(ctx);
        new Chart("Bitcoin", config)
        new Chart("Litecoin", config)
        //new Chart(ctx, config)
        //new Chart(ctx, config)
        //new Chart(ctx, config)
        //new Chart(ctx, config)
        //new Chart(ctx, config)
    }

    
  })

  
}

main();