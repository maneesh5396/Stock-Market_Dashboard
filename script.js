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
    // console.log(data);
  }
  // console.log(tradeTypeValue);
  searchTrades(url);
})

searchInput.addEventListener("keyup", searchListRender)
searchInput.addEventListener("click", searchListRender);
function searchListRender(){
  const searchList = document.getElementById('searchList'); 
  if(searchInput.value == ""){
    searchList.innerHTML = "";
  }
}

async function getCompanyData(symbol){
  const tradeType = document.getElementsByName('trade_type');
  let tradeTypeValue = "";
  for (i = 0; i < tradeType.length; i++) {
    if (tradeType[i].checked){
      tradeTypeValue = tradeType[i].value;
    }       
  }
  console.log(tradeTypeValue);
  const url = `https://www.alphavantage.co/query?function=${tradeTypeValue}&symbol=${symbol}&interval=5min&apikey=PJF7VZUNDSI5OG98`
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  let dataToStore = [];
  // console.log();
  let datakey = 'Weekly Time Series'
  switch(tradeTypeValue){
    case "TIME_SERIES_DAILY":
      datakey = 'Time Series (Daily)'
      break;
    case "TIME_SERIES_MONTHLY":
      datakey = 'Monthly Time Series'
      break;
    case "TIME_SERIES_INTRADAY":
      datakey = 'Time Series (5min)'
      break;
  }
  const objToPush = {
    name: symbol,
    tradeType: tradeTypeValue,
    price: Object.values(data[datakey])[0]['2. high'],
    data: data[datakey],
  };
  const wishlist = JSON.parse(localStorage.getItem('wishlist'))?.store;
  const filterCheck = wishlist?.filter((d)=> d.name == symbol);
  if(wishlist?.length > 0 && filterCheck.length == 0) {
    wishlist.push(objToPush);
    dataToStore = wishlist;
  }else {
    dataToStore.push(objToPush);
  }

  
  localStorage.setItem('wishlist', JSON.stringify({store: dataToStore}));

  renderWishList();
  
  // check the localstorage for the wishlist key and date
  // when wishlist has the date append the new data inside it
  // if wishlist dnt have data push the first date 
  // call the render wishlist function and render wishlist will get the date from localstorage and store it.
  
}

function renderWishList() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist'))?.store;
  const watchlistResultDiv = document.getElementById('watchlistResult');
  let wishlistCard = '';
  wishlist?.map((d)=>{
    wishlistCard += `<div id="watchlistCard" class="watchlistWrapper" onclick="showData('${d.name}')" data-store='${d.data}'>
    <div>${d.name}</div>
    <div>${d.price}</div>
    <div>${d.tradeType}</div>
    <button id="delete" onclick="deleteItem('${d.name}')"><i class="fa-solid fa-delete-left fa-2xl" style="color: #fa0000;"></i></button>
</div>`
  });
  watchlistResultDiv.innerHTML = wishlistCard;
}
function deleteItem(symbol){
  const deleteBtn = document.getElementById('delete');
  // console.log(symbol,deleteBtn);
  const wishlist = JSON.parse(localStorage.getItem('wishlist'))?.store;
  // console.log(wishlist);
  const filterCheck = wishlist?.filter((d)=> d.name != symbol);
  // console.log(filterCheck);
  localStorage.setItem('wishlist', JSON.stringify({store: filterCheck}));
  renderWishList();

}
function showData(symbol){
  const wishlist = JSON.parse(localStorage.getItem('wishlist'))?.store;
  // console.log(wishlist);

  const wishlistCardData = wishlist?.filter((d)=> d.name == symbol);
  console.log(wishlistCardData);
  let dataTable = document.getElementById("tableData");
  console.log(dataTable);
  let dataTableStr = `
  <thead>
      <tr>
          <td>Date</td>
          <td>Open</td>
          <td>High</td>
          <td>Low</td>
          <td>Close</td>
          <td>Volume</td>
      </tr>
  </thead>
  <tbody>`;
  const tableData = wishlistCardData[0].data;
  const keyArr = Object.keys(tableData);
  keyArr?.map((d, i)=>{
    (i<10) && (dataTableStr +=`
        <tr>
            <td>${d}</td>
            <td>${tableData[d]['1. open']}</td>
            <td>${tableData[d]['2. high']}</td>
            <td>${tableData[d]['3. low']}</td>
            <td>${tableData[d]['4. close']}</td>
            <td>${tableData[d]['5. volume']}</td>
        </tr>`)
  })
  dataTableStr += `</tbody>`;
  dataTable.innerHTML = dataTableStr;
  
}

renderWishList();



