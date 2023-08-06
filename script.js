let getStartBtn = document.querySelector(".get-started-btn");

let container = document.querySelector(".container");
let container2 = document.querySelector(".container-2");

let ipDiv = document.querySelector(".ip-address");

let userIpAddress = document.querySelector(".user-ip-address");

let latitude = document.getElementById("latitude");
let city = document.getElementById("city");
let organisation = document.getElementById("organisation");
let longitude = document.getElementById("longitude");
let region = document.getElementById("region");
let hostname = document.getElementById("hostname");

let addresses = document.querySelector(".addresses");

let map = document.querySelector(".map");

let search = document.querySelector("#searching");

let moreInfo = document.querySelector(".more-info");
// console.log(latitude, city, organisation, longitude, region, hostname);

getStartBtn.addEventListener("click", () => {
  container.style.display = "none";
  container2.style.display = "block";
});

//  getting client ip address
function getIpAddress() {
  $.getJSON("https://api.ipify.org?format=json", function (data) {
    // Setting text of element P with id gfg
    let ipAddress = data.ip;

    localStorage.setItem("IP-Address", JSON.stringify(ipAddress));
    console.log(ipAddress);
    // rendering ip address to home page
    ipDiv.innerHTML = `Your Current IP Address is <b> ${ipAddress} </b>`;
  });
}

async function fetchDetails() {
  let IpAddress = JSON.parse(localStorage.getItem("IP-Address"));

  try {
    const response = await fetch(
      `https://ipinfo.io/${IpAddress}?token=6a1ef772bacbd3`
    );
    const details = await response.json();
    // console.log(details);
    localStorage.setItem("userDetails", JSON.stringify(details));

    let coOrdinate = details.loc.split(",");

    let lat = coOrdinate[0];
    let long = coOrdinate[1];

    let hostName = window.location.hostname;
    // console.log(coOrdinate);

    userIpAddress.innerHTML = `Ip Address : ${details.ip}`;
    latitude.innerHTML = `Lat : ${lat}`;
    longitude.innerHTML = `long : ${long}`;
    city.innerHTML = `City : ${details.city}`;
    organisation.innerHTML = `Organisation : ${details.org}`;
    region.innerHTML = `Region : ${details.region}`;
    hostname.innerHTML = `Hostname : ${hostName}`;

    map.innerHTML = `<iframe
    src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed"
    height="370"
    frameborder="0"
    style="border: 0"
  ></iframe>`;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// getting details using timezone

let locationDetails = JSON.parse(localStorage.getItem("userDetails"));
console.log(locationDetails);

let userTimeZone = locationDetails.timezone;

let userLocationTimeZone = new Date().toLocaleString("en-US", {
  timeZone: `${userTimeZone}`,
});

let pincode = locationDetails.postal;

// getting data from pincode

async function fetchPincode() {
  try {
    let res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    let fetchedData = await res.json();
    let postOfficeDetails = fetchedData[0];

    console.log(postOfficeDetails);

    moreInfo.innerHTML = `
                <div>Time Zone : ${userTimeZone}</div>
            <div>Date and Time : ${userLocationTimeZone}</div>
            <div>Pincode : ${pincode}</div>
            <div>Message : ${postOfficeDetails.Message} </div>
    `;

    let nearYouPostOffice = postOfficeDetails.PostOffice;

    localStorage.setItem(
      "nearYouPostOffice",
      JSON.stringify(nearYouPostOffice)
    );

    console.log(nearYouPostOffice);

    // console.log(search);
  } catch (error) {
    console.log(error);
  }
}

let nearYouPostOffice = JSON.parse(localStorage.getItem("nearYouPostOffice"));

console.log(nearYouPostOffice);

function render(postOffices) {
  postOffices.forEach((postOffice) => {
    // console.log(postOffice);
    addresses.innerHTML += `
          <div class="card">
              <div>Name : ${postOffice.Name}</div>
              <div>Branch Type : ${postOffice.BranchType}</div>
              <div>Delivery Status : ${postOffice.DeliveryStatus}</div>
              <div>District : ${postOffice.District}</div>
              <div>Division : ${postOffice.Division}</div>
          </div>`;
  });
}

getIpAddress();
fetchDetails();
fetchPincode();
render(nearYouPostOffice);

search.addEventListener("keyup", () => {
  const searchedvalue = search.value.toLowerCase();
  const filterdData = nearYouPostOffice.filter(
    (postOffice) =>
      postOffice.Name.toLowerCase().includes(searchedvalue) ||
      postOffice.BranchType.toLowerCase().includes(searchedvalue)
  );
  addresses.innerHTML = "";
  render(filterdData);
});
