/**
* Template Name: Ninestars - v4.0.1
* Template URL: https://bootstrapmade.com/ninestars-free-bootstrap-3-theme-for-creative/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

"use strict";

/**
 * Easy selector helper function
 */
const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

/**
 * Easy event listener function
 */
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all)
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener))
    } else {
      selectEl.addEventListener(type, listener)
    }
  }
}

/**
 * Easy on scroll event listener 
 */
const onscroll = (el, listener) => {
  el.addEventListener('scroll', listener)
}

/**
 * Navbar links active state on scroll
 */
let navbarlinks = select('#navbar .scrollto', true)
const navbarlinksActive = () => {
  let position = window.scrollY + 200
  navbarlinks.forEach(navbarlink => {
    if (!navbarlink.hash) return
    let section = select(navbarlink.hash)
    if (!section) return
    if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
      navbarlink.classList.add('active')
    } else {
      navbarlink.classList.remove('active')
    }
  })
}
window.addEventListener('load', navbarlinksActive)
onscroll(document, navbarlinksActive)

/**
 * Scrolls to an element with header offset
 */
const scrollto = (el) => {
  let header = select('#header')
  let offset = header.offsetHeight

  let elementPos = select(el).offsetTop
  window.scrollTo({
    top: elementPos - offset,
    behavior: 'smooth'
  })
}

/**
 * Back to top button
 */
let backtotop = select('.back-to-top')
if (backtotop) {
  const toggleBacktotop = () => {
    if (window.scrollY > 100) {
      backtotop.classList.add('active')
    } else {
      backtotop.classList.remove('active')
    }
  }
  window.addEventListener('load', toggleBacktotop)
  onscroll(document, toggleBacktotop)
}

/**
 * Mobile nav toggle
 */
on('click', '.mobile-nav-toggle', function(e) {
  select('#navbar').classList.toggle('navbar-mobile')
  this.classList.toggle('bi-list')
  this.classList.toggle('bi-x')
})

/**
 * Mobile nav dropdowns activate
 */
on('click', '.navbar .dropdown > a', function(e) {
  if (select('#navbar').classList.contains('navbar-mobile')) {
    e.preventDefault()
    this.nextElementSibling.classList.toggle('dropdown-active')
  }
}, true)

/**
 * Scroll with offset on links with a class name .scrollto
 */
on('click', '.scrollto', function(e) {
  if (select(this.hash)) {
    e.preventDefault()

    let navbar = select('#navbar')
    if (navbar.classList.contains('navbar-mobile')) {
      navbar.classList.remove('navbar-mobile')
      let navbarToggle = select('.mobile-nav-toggle')
      navbarToggle.classList.toggle('bi-list')
      navbarToggle.classList.toggle('bi-x')
    }
    scrollto(this.hash)
  }
}, true)

/**
 * Scroll with ofset on page load with hash links in the url
 */
window.addEventListener('load', () => {
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollto(window.location.hash)
    }
  }
});


/**
 * Animation on scroll
 */
window.addEventListener('load', () => {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false
  });
});

//trigger msgTrigger to send directions to phone numbers from user input
async function sendAddress(phone1, phone2, address, name){
  var functionUrl = "/api/msgTrigger";
  const resp = await fetch (functionUrl, {
    method: 'POST',
    body:JSON.stringify({phone1, phone2, address, name}),
    headers: {
      'Content-Type': 'application/json'
    },
  });

}

async function handle(event){
  console.log ("submitting form..."); //debug
  $('#printRestaurant').html("Loading...")
  event.preventDefault(); //disable reload 

  var myForm = document.getElementById('food-form');
  var payload = new FormData(myForm); //key-value pairs
  var zip1=payload.get('zip1');
  var zip2=payload.get('zip2');
  var cuisine=payload.get('cuisine');


  var functionUrl = "https://bc-finalproject.azurewebsites.net/api/dineTrigger?code=8a1YBCP4EKDWev2UCyaZXHBOY/s5Ezm9kzc3pdxCh1/zFPQZliO69w=="
  //var functionUrl = "/api/dineTrigger";
  const resp = await fetch (functionUrl, {
      method: 'POST',
      body:JSON.stringify({zip1, zip2, cuisine}),
      headers: {
        'Content-Type': 'application/json'
      },
  });
  //await restaurant data from Azure Maps
  var data = await resp.json();
  var newData = JSON.stringify(data.results);
  var obj = JSON.parse(newData);

  $('#resultsDiv').empty(); //need to clear results every time the user searches
  
  document.getElementById("cuisineName").innerHTML="Cuisine: " + cuisine;

  //populate results in two rows of four elements
 for (var i=0; i< 8; ++i){
    var myOuterFoodDiv = document.createElement("div");
    myOuterFoodDiv.setAttribute("class", "col-md-6 col-lg-3 d-flex align-items-stretch");
    myOuterFoodDiv.setAttribute("data-aos", "zoom-in");


    var innerFoodDiv = document.createElement("div");
    innerFoodDiv.setAttribute("class", "icon-box");

    var site = document.createElement("h5");
    var myWebsite = obj[i].poi.url;
    //check if website exists 
    if (myWebsite==undefined){
      site.innerHTML=obj[i].poi.name;
    }
    //ensure website begins with https
    else{
      if(!myWebsite.startsWith("http")){
        myWebsite = "https://" + myWebsite;
      }
      var aTag = document.createElement('a');
      aTag.setAttribute('href', myWebsite);
      aTag.innerText = obj[i].poi.name;
      site.appendChild(aTag);
    }

    var phone = document.createElement("h4");
    phone.setAttribute("class", "description");
    phone.innerHTML = obj[i].poi.phone;
    var address = document.createElement("p");
    address.setAttribute("class", "description");
    address.innerHTML = obj[i].address.freeformAddress;
    innerFoodDiv.appendChild(site);
    innerFoodDiv.appendChild(phone);
    innerFoodDiv.append(address);

    var selectBtn = document.createElement("BUTTON");
    selectBtn.setAttribute("class", "btn btn-outline-success");
    selectBtn.innerHTML="Send Directions!";
    //when the user selects a restaurant, send form values
    selectBtn.addEventListener("click", sendAddress.bind(null, payload.get('phone1'), payload.get('phone2'), obj[i].address.freeformAddress, obj[i].poi.name));
    innerFoodDiv.append(selectBtn);

    myOuterFoodDiv.appendChild(innerFoodDiv);
    document.getElementById('resultsDiv').appendChild(myOuterFoodDiv);
    $('#printRestaurant').html("");
 }
}
