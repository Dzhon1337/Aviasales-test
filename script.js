const url = "http://localhost:3000/tickets";

var dataFromServer = [];

async function getData() {
  const response = await fetch(url);
  dataFromServer = await response.json();
}

async function sortData(setting, filter) {
  function filterBySettings(ticket) {
    if (
      setting.includes(ticket.segments[0].stops.length.toString()) &&
      setting.includes(ticket.segments[1].stops.length.toString())
    ) {
      return true;
    }
    if (setting.includes("4") || setting.length === 0) {
      return true;
    }
    return false;
  }
  if (filter === "cheapest") {
    var sortedData = dataFromServer
      .sort((a, b) => (a.price > b.price ? 1 : b.price > a.price ? -1 : 0))
      .filter(filterBySettings);
    return sortedData;
  }
  if (filter === "fastest") {
    var sortedData = dataFromServer
      .sort(compareDuration)
      .filter(filterBySettings);
    function compareDuration(a, b) {
      var durationA = 0;
      var durationB = 0;
      a.segments.forEach((segment) => {
        durationA += segment.duration;
      });
      b.segments.forEach((segment) => {
        durationB += segment.duration;
      });
      if (durationA > durationB) {
        return 1;
      }
      if (durationA < durationB) {
        return -1;
      }
      return 0;
    }
    return sortedData;
  }
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
    changeTicket();
  }
});

const settings = document.querySelectorAll(
  "input[type=checkbox][name=setting]"
);
var settingValue = ["4"];

settings.forEach((setting) => {
  setting.addEventListener("change", () => {
    settingValue = Array.from(settings)
      .filter((i) => i.checked)
      .map((i) => i.value);
    if (settingValue.length === 0) {
      settings[0].checked = true;
    }
    if (settingValue.length > 1) {
      settings[0].checked = false;
    }
    changeTicket();
    console.log(settingValue);
  });
});

async function changeTicket() {
  await getData();
  var sortedData = await sortData(settingValue, filterValue);
  console.log(sortedData[0]);
  const tickets = document.querySelectorAll(".ticket");
  var i = 0;
  tickets.forEach((ticket) => {
    var logo = (ticket.querySelector(
      ".ticket-logo"
    ).src = `http://pics.avs.io/99/36/${sortedData[i].carrier}.png`);

    var price = (ticket.querySelector(".price").textContent = `${sortedData[
      i
    ].price.toLocaleString()} P`);

    var inFlightTime = ticket.querySelectorAll(".in-flight");
    inFlightTime[0].querySelector(
      ".in-flight-time"
    ).textContent = `${Math.floor(sortedData[i].segments[0].duration / 60)}ч ${
      sortedData[i].segments[0].duration % 60
    }м`;
    inFlightTime[1].querySelector(
      ".in-flight-time"
    ).textContent = `${Math.floor(sortedData[i].segments[1].duration / 60)}ч ${
      sortedData[i].segments[1].duration % 60
    }м`;

    var transfers = ticket.querySelectorAll(".transfer");
    transfers.forEach((elem) => {
      var transfer = Array.prototype.slice.call(transfers);

      var transferNumber = elem.querySelector(".transfer-number");
      var transferStops = elem.querySelector(".transfer-iata");

      transferStops.textContent =
        sortedData[i].segments[transfer.indexOf(elem)].stops.join(", ");

      switch (sortedData[i].segments[transfer.indexOf(elem)].stops.length) {
        case 0:
          transferNumber.textContent = "";
          break;
        case 1:
          transferNumber.textContent = "1 пересадка";
          break;
        case 2:
          transferNumber.textContent = "2 пересадки";
          break;
        default:
          transferNumber.textContent = "3 пересадки";
      }
    });

    var destinations = ticket.querySelectorAll(".destination");
    destinations.forEach((elem) => {
      function padTo2Digits(num) {
        return String(num).padStart(2, "0");
      }
      var destitation = Array.prototype.slice.call(destinations);

      var iata = elem.querySelector(".iata");

      iata.textContent = `${
        sortedData[i].segments[destitation.indexOf(elem)].origin
      } - ${sortedData[i].segments[destitation.indexOf(elem)].destination}`;

      var time = elem.querySelector(".time");
      var date = Date.parse(
        sortedData[i].segments[destitation.indexOf(elem)].date.slice(0, -1)
      );
      var newDate = new Date(date);
      time.textContent = `${padTo2Digits(newDate.getHours())}:${padTo2Digits(
        newDate.getMinutes()
      )} - ${padTo2Digits(
        new Date(
          newDate.getTime() +
            sortedData[i].segments[destitation.indexOf(elem)].duration * 60000
        ).getHours()
      )}:${padTo2Digits(
        new Date(
          newDate.getTime() +
            sortedData[i].segments[destitation.indexOf(elem)].duration * 60000
        ).getMinutes()
      )}`;
    });

    i++;
  });
}

changeTicket();
