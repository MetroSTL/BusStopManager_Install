import { jsonURL as jsonURL, surveyID as surveyID } from './private.js'; 

//STATIC URLS
//HTML SECTION SELECTORS
const list_div = document.getElementById('list');
const item = document.querySelector('button_popup');
const button_popup = document.querySelector('.button_popup');
let stop_search = document.getElementById('search').value;
const init = document.getElementById('init-search');
const stopButton = document.getElementById('main');
let searchData;




// JAVASCRIPT VARIABLES
let stops, filtered_stops;
let filtered = false;

//POLYFILLS
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        let el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
}};


const get_survey_data = async (id) => {
    const response = await fetch(jsonURL(id));
    const json = await response.json();
    let data = json.features;    stops = data;
    return data;
}

const clear_data = async () => {
    list_div.innerHTML = '';
    document.getElementById('search').value = '';
    return;
}

const render = async (d) => {
    // SORTED DATA BY stop NUMBER
    const sorted_data = d.sort(function (a, b) {
        if (a.properties.STP_ID <b.properties.STP_ID) {
            return -1;
        }
        if (b.properties.STP_ID <a.properties.STP_ID) {
            return 1;
        }
        return 0;
    });
    
    list_div.innerHTML = '';
    if(sorted_data.length == 0){
        list_div.innerHTML = 'No stops with that number';
    }else{
        sorted_data.forEach(element => {
            list_div.innerHTML += 
                `<div id='${element.properties.STP_ID}' class='button_popup fl w-100 '>
                    <a 
                        data-stopID = '${element.properties.STP_ID}'
                        data-onSt = '${element.properties.ON_ST}'
                        data-atSt = '${element.properties.AT_ST}'
                        data-stopName = '${element.properties.STP_NAME}'
                        data-installInfo = '${element.properties.LocChange}'
                        data-routes = '${element.properties.ROUTES}'
                        data-tParkPoles ='${element.properties.TParkPoles}'
                        data-tParkSigns = '${element.properties.TNPSigns}'
                        data-busStopPole = '${element.properties.TStopPoles}'
                        data-instPos = '${element.properties.InstPos}'
                        data-stdInstLoc = '${element.properties.StdInLoc}'
                        data-parkSignRear = '${element.properties.NPSign1}'
                        data-parkSignNSFront = '${element.properties.NPSign2}'
                        data-parkSignMBFront = '${element.properties.NPSign3}'
                        data-parkSignFarside = '${element.properties.NPSign4}'
                        data-gpsLat = '${element.geometry.coordinates[0]}'
                        data-gpsLon = '${element.geometry.coordinates[1]}'
                    
                    class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-blue'>
                    <ul>
                        <li class='f3 helvetica'><b>Stop ID:</b> ${element.properties.STP_ID}
                        </li>
                        <li class='f3 helvetica'><b>Stop Name:</b> ${element.properties.STP_NAME}
                        </li>    
                    </ul>
                        </a>
                </div>`;
        }
    )};

};

const searching = (stop_search) => {
    list_div.innerHTML = 'Data is loading...';
        get_survey_data(stop_search).then(data =>{
            render(data)
            console.log(data)
            searchData = data;
        }) 
}




const clickEvent = async (event) => {
    event.preventDefault();
    const iframe_exists = document.getElementById('ifrm');
    stop_search = document.getElementById('search').value
    const iframe = event.target.closest('#iframe');
    const search = event.target.closest('#search');
    console.log(`event: ${event}`)
    console.log(event.type)
    if (event.type == 'submit' && !iframe_exists) {
        searching(stop_search);
        return
    }

    // CLOSE IFRAME / CLICK OFF IFRAME WHEN ITS OPEN
    if(!iframe && iframe_exists){
        
        // CLOSE IFRAME
        iframe_exists.parentNode.removeChild(iframe_exists);
        return;
        
    // SEARCH CLICK!!!
    }else if(search){
        if(stop_search != ''){
            searching(stop_search);
        }else if(stop_search == '' && filtered){
            render(vehicles)
            return;
        }
    // CLICK LIST ELEMENT AND OPEN IFRAME!!!
    }else if (event.target.closest('.openpop')){        
        let item = event.target.closest('.openpop');
        console.log(item);
        console.log(item.dataset)

        let url = `https://survey123.arcgis.com/share/${surveyID()}?field:stopID=${item.dataset.stopid}
                    &field:onSt=${item.dataset.onst} 
                    &field:atSt=${item.dataset.atst} 
                    &field:stopName=${item.dataset.stopname} 
                    &field:installInfo=${item.dataset.installinfo} 
                    &field:routes=${item.dataset.routes} 
                    &field:tParkPoles=${item.dataset.tparkpoles} 
                    &field:tParkSigns=${item.dataset.tparksigns} 
                    &field:installSurface=${item.dataset.installsurface}
                    &field:installBusStopPole=${item.dataset.installpole=='0'? 'no' : 'yes'}
                    &field:assignedPos=${item.dataset.instpos} 
                    &field:parkSignRear=${item.dataset.parksignrear} 
                    &field:parkSignNSFront=${item.dataset.parksignnsfront} 
                    &field:parkSignMBFront=${item.dataset.parksignmbfront} 
                    &field:parkSignFarside=${item.dataset.parksignfarside} 
                    &field:gpsLat${item.dataset.gpslat}
                    &field:gpsLat${item.dataset.gpslon}`;
        console.log(url)
        const ifrm = document.createElement('iframe');
        const el = document.getElementById('marker');
        const main = document.querySelector('#main');


        ifrm.setAttribute('id', 'ifrm'); // assign an id
        ifrm.setAttribute(`src`, url);

        main.parentNode.insertBefore(ifrm, el);        
        return;
    }
}


clear_data();

window.addEventListener("click", clickEvent, false)
window.addEventListener("submit", clickEvent, false)



