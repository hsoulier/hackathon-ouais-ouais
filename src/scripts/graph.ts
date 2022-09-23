import bankInfos from "../../assets/json/bank-infos.json"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export const drawGraphs = () => {
  const bankNames: string[] = []
  const yValues: any[] = []
  const barColors = ["#6c48c7", "#5c918b", "#FD5200"]

  bankInfos["bank-values"].forEach((bank) => {
    bankNames.push(bank["name"])
    yValues.push(bank["balance"])
  })

  new Chart("bank__bars", {
    type: "bar",
    data: {
      labels: bankNames,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "My Balance",
          color: "#fff",
          font: {
            size: 24,
            family: "Clash Display",
          },
        },

        legend: {
          display: false,
        },
      },
    },
  })

  var xValues = ["19/09", "20/09", "21/09"]
  const datasets = bankInfos["bank-values"].map((bank, index) => {
    return {
      data: Object.values(bank.pastbalance),
      fill: false,
      borderColor: barColors[index],
      tension: 0.2,
      name: bank.name,
    }
  })
  new Chart("bank__graph", {
    type: "line",
    data: {
      labels: xValues,
      datasets,
    },
    options: {
      responsive: true,
    
      plugins: {
        title: {
          display: true,
          text: "Last 3 days",
          color: "#fff",
          font: {
            size: 24,
            family: "Clash Display",
          },
        },
        legend: {
          display: false,
        },
      },
    },
  })
}

// new Chart("bank__bars", {
//   type: "bar",
//   data: {
//     labels: xValues,
//     datasets: [
//       {
//         backgroundColor: barColors,
//         data: yValues,
//       },
//     ],
//   },
//   options: {
//     legend: { display: false },
//     title: {
//       display: true,
//       text: "Vos comptes aujourd'hui",
//     },
//     scales: {
//       yAxes: [
//         {
//           display: true,
//           ticks: {
//             beginAtZero: true,
//           },
//         },
//       ],
//     },
//   },
// })

// if (tabBank) {
//   Object.keys(json[0]).forEach((key) => {
//     tabBank.innerHTML +=
//       `
//       <tr class="wallet">
//           <td class="bank">` +
//       json[0][key]["name"] +
//       `</td>
//           <td class="total">` +
//       json[0][key]["balance"] +
//       `</td>
//           <td class="currency">` +
//       json[0][key]["currency"] +
//       `</td>
//           <td class="iban">` +
//       json[0][key]["iban"] +
//       `</td>
//       </tr>
//     `
//   })
// }
