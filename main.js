const TIME = "time";

async function fetchTime() { return fetch("https://www.canada.ca/api/assets/cra-arc/content-fragments/wait-times.json");}

async function getTime() {
  return fetchTime().then(res => res.json()).then(res => res.properties.elements.individual_en.value);
}

function timeToMinute(time) {
  if (!time) {
    return null;
  }
  
  hour = time.match(/(.+)h/);
  hourInt = 0;
  if (hour) {
    hourInt = parseInt(hour[1].trim()); 
  }
  
  if (hour) {
		min = time.match(/h(.+)min/);    
  } else {
    min = time.match(/(.+)min/);
  }

  minInt = 0;
 	if (min) {
   minInt = parseInt(min[1].trim());
 	}
  
  return hourInt * 60 + minInt;
}

function notifyMe(time) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    createNewNotification(time);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        createNewNotification(time);
      }
    });
  }
}

function createNewNotification(time) {
  new Notification(`CRA wait time is ${time}`);
}


async function getTimes() {
  const time = await getTime()
  return {
    time: time,
    date: new Date().toLocaleTimeString()
  }
 }

 async function logTime() {
  const timeObject = await getTimes();
  const {time, date} = timeObject;

  localStorage.setItem(TIME, time)

  const timeTable = document.getElementById('timeTable');

  const row = timeTable.insertRow(0);;
  const timeTd = document.createElement('td');
  const dateTd = document.createElement('td');

  timeTd.textContent = time;
  dateTd.textContent = date;

  row.appendChild(timeTd);
  row.appendChild(dateTd);
 }

logTime();

setInterval(logTime, 60000);

setInterval(() => {
  const time = localStorage.getItem(TIME);
  if (timeToMinute(time) < 30) {
    notifyMe(time);
  }
}, 60000 * 10)