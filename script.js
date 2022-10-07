const url = "http://localhost:3000/tickets";

var dataFromServer = [];

async function getData() {
  const response = await fetch(url + "?_sort=price");
  dataFromServer = await response.json();
  console.log(dataFromServer);
}

const filters = document.querySelector(".filter");
var filterValue = "cheapest";

filters.addEventListener("click", (e) => {
  if (e.target.closest("button") || e.target != null) {
    var childs = Array.from(filters.children);
    childs.forEach((elem) => {
      elem.classList.remove("active");
    });
    e.target.classList.add("active");
    if (e.target === childs[0]) {
      filterValue = "cheapest";
    }
    if (e.target === childs[1]) {
      filterValue = "fastest";
    }
    if (e.target === childs[2]) {
      filterValue = "optimal";
    }
  }
});

const setting = document.querySelectorAll(".setting");
var settingValue = ["All", "", "", "", ""];

setting.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    if (e.target.closest("span") || e.target != null) {
      if (elem.children[0].classList.contains("checkbox-active")) {
        elem.children[0].classList.remove("checkbox-active");
      } else {
        elem.children[0].classList.add("checkbox-active");
      }
    }
    if (e.target === setting[0]) {
      if (settingValue.includes("All")) {
        settingValue[0] = "";
        console.log("no All");
      } else {
        settingValue[0] = "All";
        console.log("All");
      }
    }
    if (e.target === setting[1]) {
      if (settingValue.includes("Without transit")) {
        settingValue[1] = "";
        console.log("no wo transit");
      } else {
        settingValue[1] = "Without transit";
        console.log("Without transit");
      }
    }
    if (e.target === setting[2]) {
      if (settingValue.includes("All")) {
        settingValue[2] = "";
        console.log("no All");
      } else {
        settingValue[2] = "All";
        console.log("All");
      }
    }
    if (e.target === setting[3]) {
      if (settingValue.includes("All")) {
        settingValue[3] = "";
        console.log("no All");
      } else {
        settingValue[3] = "All";
        console.log("All");
      }
    }
    if (e.target === setting[4]) {
      if (settingValue.includes("All")) {
        settingValue[4] = "";
        console.log("no All");
      } else {
        settingValue[4] = "All";
        console.log("All");
      }
    }
  });
});

async function changeLogo() {
  await getData();
  const tickets = document.querySelectorAll(".ticket");
  var i = 0;
  tickets.forEach((elem) => {
    var logo = (elem
      .querySelector(":scope > .price-logo")
      .querySelector(
        ":scope > .ticket-logo"
      ).src = `http://pics.avs.io/99/36/${dataFromServer[i].carrier}.png`);
    var price = (elem
      .querySelector(":scope > .price-logo")
      .querySelector(":scope > .price").textContent = dataFromServer[i].price);
    i++;
  });
}

changeLogo();
