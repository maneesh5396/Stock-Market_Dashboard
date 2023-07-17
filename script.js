//Welcome to Alpha Vantage! Here is your API key: PJF7VZUNDSI5OG98. Please record this API key at a safe place for future data access.

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchButton');
const intraday = document.getElementById('intraday');
const daily = document.getElementById('daily');
const weekly = document.getElementById('weekly');
const monthly = document.getElementById('monthly');

searchBtn.addEventListener('click', ()=>{
  const inputValue = searchInput.value;
   
  var url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue}&apikey=PJF7VZUNDSI5OG98`
  async function searchTrades(url){
    const response = await fetch(url);
    let data = await response.json();
    const searchList = document.getElementById('searchList');
    const searchResp = data.bestMatches;
    let list = "";
    searchResp.forEach(element => {
      list += `<li onclick="getCompanyData('${element['1. symbol']}')">${element['2. name']}</li>`;
    });
    searchList.innerHTML = list;
    console.log(data);
  }
  // console.log(tradeTypeValue);
  searchTrades(url);
})
async function getCompanyData(symbol){
  const tradeType = document.getElementsByName('trade_type');
  let tradeTypeValue = "";
  for (i = 0; i < tradeType.length; i++) {
    if (tradeType[i].checked){
      tradeTypeValue = tradeType[i].value;
    }       
  }
  const url = `https://www.alphavantage.co/query?function=${tradeTypeValue}&symbol=${symbol}&interval=5min&apikey=PJF7VZUNDSI5OG98`
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  
}
  



