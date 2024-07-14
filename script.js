const investmentListEl = document.getElementById("investment-list");

const addInvestmentBtn = document.getElementById('add-inv-btn');

let investmentList;

// Function to load Investment list from local storage (on page load or refresh)
function loadInvestmentList() {
  const storedinvestmentListJson = localStorage.getItem("investmentList");
  if (storedinvestmentListJson) {
    investmentList = JSON.parse(storedinvestmentListJson);
  } else {
    investmentList = [];
  }
  populateinvestmentList();
}

// Function to add a new Investment item
const addInvestment = (newInvestment) => {
  investmentList.push(newInvestment);
  localStorage.setItem("investmentList", JSON.stringify(investmentList));
  populateinvestmentList();
};

// Function to remove a Investment item
const removeInvestment = (invIndex) => {
  investmentList.splice(invIndex, 1);
  localStorage.setItem("investmentList", JSON.stringify(investmentList));
  populateinvestmentList();
};

function updateinvestmentListInLocalStorage() {
  localStorage.setItem("investmentList", JSON.stringify(investmentList));
  populateinvestmentList();
}

function getTypeValue(invType) {
  switch(invType) {
    case 'stock':
      return 'Stock';
    case 'mf':
      return 'Mutual Fund';
    case 'fd':
      return 'Fixed Deposit';
    case 'ppf':
      return 'PPF';
    case 'ssy':
      return 'SSY';
    default:
      return 'Invalid';
  }
}

function sort() {
  const sortBy = document.getElementById('sort-by').value;
  switch(sortBy) {
    case 'type':
      return investmentList.sort((a, b) => (a.type.toLowerCase() < b.type.toLowerCase() ? -1 : 1));
    case 'name':
      return investmentList.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
    case 'amount':
      return investmentList.sort((a, b) => a.amount - b.amount);
    case 'date':
      return investmentList.sort((a, b) => new Date(a.date) - new Date(b.date));
    default:
      return investmentList.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
}

function populateinvestmentList() {
  investmentListEl.innerHTML = ""; // Clear existing list items

  const sortedInvestmentList = sort();

  investmentList.forEach((investmentItem) => {
    const newListItem = document.createElement("li");

    const typeDiv = document.createElement("div");
    const typeSpan = document.createElement("span");
    typeSpan.innerText = getTypeValue(investmentItem['type']);
    typeDiv.appendChild(typeSpan);
    newListItem.appendChild(typeDiv);

    const nameDiv = document.createElement("div");
    const nameSpan = document.createElement("span");
    nameSpan.innerText = investmentItem['name'];
    nameDiv.appendChild(nameSpan);
    newListItem.appendChild(nameDiv);

    const amountDiv = document.createElement("div");
    const amountSpan = document.createElement("span");
    amountSpan.innerText = '₹ ' + investmentItem['amount'];
    amountDiv.appendChild(amountSpan);
    newListItem.appendChild(amountDiv);

    const dateDiv = document.createElement("div");
    const dateSpan = document.createElement("span");
    dateSpan.innerText = investmentItem['date'];
    dateDiv.appendChild(dateSpan);
    newListItem.appendChild(dateDiv);

    const actionDiv = document.createElement("div");
    const removeBtn = document.createElement("button");
    removeBtn.innerText = "X";
    removeBtn.className = "inv-btn";
    removeBtn.addEventListener("click", () => {
      removeInvestment(investmentList.indexOf(investmentItem));
    });
    actionDiv.appendChild(removeBtn);
    newListItem.appendChild(actionDiv);

    investmentListEl.appendChild(newListItem);
  });

}

// Event listener for adding an Investment on button click
addInvestmentBtn.addEventListener('click', () => {
  const newInvType = document.getElementById('inv-type');
  const newInvName = document.getElementById('inv-name');
  const newInvAmount = document.getElementById('inv-amount');
  const newInvDate = document.getElementById('inv-date');

  const newInvTypeValue = newInvType.value.trim();
  const newInvNameValue = newInvName.value.trim();
  const newInvAmountValue = newInvAmount.value;
  const newInvDateValue = newInvDate.value;

  const newInvestment = { type: newInvTypeValue, name: newInvNameValue, amount: newInvAmountValue, date: newInvDateValue };
  
  if (newInvestment) {
    addInvestment(newInvestment);
    newInvName.value = "";
    newInvAmount.value = "";
    newInvDate.value = "";
  }
});


function calculateAnnualInterestRate() {

  const investmentDate = new Date(document.getElementById('investment-date').value);
  const principal = document.getElementById('invested-amount').value;
  const currentAmount = document.getElementById('current-amount').value;

  // 1. Calculate the time difference in years
  const today = new Date();
  const diffInMs = today.getTime() - investmentDate.getTime();
  const timeInYears = diffInMs / (1000 * 60 * 60 * 24 * 365);

  // 2. Calculate the interest earned
  const interestEarned = currentAmount - principal;

  // 3. Use the compound interest formula (assuming annual compounding)
  const annualInterestRate = Math.pow((currentAmount / principal), (1 / timeInYears)) - 1;

  // 4. Populate the annual interest rate as a percentage
  const air = annualInterestRate * 100;
  document.getElementById('air').innerText = air.toFixed(2) + '%';

  document.getElementById('investment-date').value = "";
  document.getElementById('invested-amount').value = "";
  document.getElementById('current-amount').value = "";
}

// Load Investment list on page load
loadInvestmentList();
