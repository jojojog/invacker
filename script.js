const investmentListEl = document.getElementById("investment-list");
const addInvestmentBtn = document.getElementById('add-inv-btn');
const addInvSection = document.getElementById("add-inv-section");
const airContainer = document.getElementById("air-container");
const investmentSummary = document.getElementById("investment-summary");

let investmentList;
let isVisible = false;
let airVisible = false;

function toggleAddInvestmentSection() {
  if (isVisible) {
    addInvSection.style.display = "none";
    isVisible = false;
  } else {
    addInvSection.style.display = "block";
    isVisible = true;
  }
}

function toggleAIR() {
  if (airVisible) {
    airContainer.style.display = "none";
    airVisible = false;
  } else {
    airContainer.style.display = "block";
    airVisible = true;
  }
}

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

  sort();

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

  const summary = investmentList.reduce((acc, current) => {
    if (acc[getTypeValue(current.type)]) {
      acc[getTypeValue(current.type)] += Number(current.amount);
    } else {
      acc[getTypeValue(current.type)] = Number(current.amount);
    }
    return acc;
  }, {});
  
  investmentSummary.innerHTML = "";
  Object.entries(summary).forEach(([type, amount]) => {
    const listItem = createListItem(type, amount);
    investmentSummary.appendChild(listItem);
  });

}

function createListItem(type, amount) {
  const listItem = document.createElement("li");
  listItem.textContent = `${type}: ${amount}`;
  return listItem;
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
