//STATIC URLS
const survey123Url = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/arcgis/rest/services/survey123_7c0c3ea3fb6b4fa986769afb9ae45e5e_fieldworker/FeatureServer/0/query?where=1%3D1&outFields=CreationDate,EditDate,Editor,requested_cleaning_areas,requested_cleaning_areas_other,vehicle_number,badge_number,cleaning_datetime,completed&outSR=4326&f=json'

//HTML SECTION SELECTORS
const list_div = document.getElementById('list');
const item = document.querySelector('button_popup');
const main = document.querySelector('#main');
const button_popup = document.querySelector('.button_popup');

let vehicles, filtered_vehicles;

//POLYFILLS
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
  }
  
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
  
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

const filter_data = (data, input) => {
    const d = data.filter(d => {
        return d.attributes.vehicle_number == input
    });
    filtered_vehicles = d;
    return d
}

const get_survey_data = async () => {
    const response = await fetch(survey123Url);
    const json = await response.json();
    let data = json.features;
    vehicles = data;
    return data;
}

const clear_data = async () => {
    list_div.innerHTML = '';
    return;
}


const render = async (d) => {
    // SORTED DATA BY VEHICLE NUMBER
    const sorted_data = d.sort(function (a, b) {
        if (a.attributes.vehicle_number <b.attributes.vehicle_number) {
            return -1;
        }
        if (b.attributes.vehicle_number <a.attributes.vehicle_number) {
            return 1;
        }
        return 0;
    });
    list_div.innerHTML = '';
    sorted_data.forEach(element => {
        const vehicle_number = element.attributes.vehicle_number;
        
        list_div.innerHTML += 
            `<div id='${vehicle_number}' class='button_popup fl w-100 '> 
                <a class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-blue'>
                    <h2 class='fl f3 helvetica fl'>Vehicle: ${vehicle_number}</h2>
                    <p class="fl f3 helvetica fl">This is some other content</p>
                </a>
            </div>`
    });

};


const clickEvent = async (event) => {
    event.preventDefault();
    const iframe_exists = document.getElementById('ifrm');
    const iframe = event.target.closest('#iframe');
    const search = event.target.closest('#search');
    const vehicle_search = document.getElementById('vehicle').value;
    
    // CLOSE IFRAME / CLICK OFF IFRAME WHEN ITS OPEN
    if(!iframe && iframe_exists){
        console.log('1')
        iframe.parentNode.removeChild(iframe);
        return;
        
    // SEARCH CLICK!!!
    }else if(search){
        clear_data();
        let fv = filter_data(vehicles, vehicle_search)
        render(await fv);
        return;
        
    // NOT A LIST ITEM!!!
    }else if(!event.target.closest('.openpop') && !iframe){
        console.log('Not list_div');
        clear_data();
        vehicles = await get_survey_data();
        render(await vehicles);
        return;
        
        // CLICK LIST ELEMENT AND OPEN IFRAME!!!
    }else{        
        let item = event.target.closest('.openpop');
        let url = item.getAttribute('data-url');
        console.log('list element click');
        const ifrm = document.createElement('iframe');
        const el = document.getElementById('marker');
        
        ifrm.setAttribute('id', 'ifrm'); // assign an id
        ifrm.setAttribute(`src`, url);

        // // to place before another page element
        main.parentNode.insertBefore(ifrm, el);

        // // assign url
        // ifrm.setAttribute('src', 'demo.html');
        
        return;
    }
}

get_survey_data().then(data =>{
    render(vehicles);
});

window.addEventListener("submit", clickEvent, false)
window.addEventListener("click", clickEvent, false)

