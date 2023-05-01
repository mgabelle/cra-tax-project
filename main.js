async function fetchTime() { return fetch("https://www.canada.ca/api/assets/cra-arc/content-fragments/wait-times.json");}

async function getTime() {
  return fetchTime().then(res => res.json()).then(res => 		         res.properties.elements.individual_en.value);
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

async function logTime() {
  var time = await getTime();
  var date = new Date();
   console.log(date.toLocaleTimeString());
   console.log("Wait time: " + time + " (min:" + timeToMinute(time) +")");
   console.log("\n");
 }

setInterval(logTime, 300000);