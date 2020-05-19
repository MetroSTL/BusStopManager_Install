import { jsonURL as jsonURL, surveyID as surveyID } from './private.js'; 

//STATIC URLS
//HTML SECTION SELECTORS
const list_div = document.getElementById('list');
const item = document.querySelector('button_popup');
const button_popup = document.querySelector('.button_popup');
let stop_search = document.getElementById('search').value;



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

// DATA PROCESSING
// const filter_data = (data, input) => {
//     const d = data.filter(d => {
//         return new RegExp('^' + input.replace(/\*/g, '.*') + '$').test(d.properties.Stp_id)
//         // return d.features.properties.stop_number == `${input}*`
//     });
//     filtered_stops = d;
//     filtered = true;
//     return d
// }

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
                    <a data-oid = ${element.properties.objectid} 
                    class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-blue'>
                        <h2 class='fl f3 helvetica fl'>Stop ID: ${element.properties.STP_ID} Stop Name: ${element.properties.STP_NAME}</h2>
                    </a>
                </div>`;
        }
    )};

};


const clickEvent = async (event) => {
    event.preventDefault();
    stop_search = document.getElementById('search').value
    const iframe_exists = document.getElementById('ifrm');
    const iframe = event.target.closest('#iframe');
    const search = event.target.closest('#search');

    const searching = async (value) => {
        list_div.innerHTML = 'Data is loading...';
        clear_data();
        filtered = true;
        render(await fv);
        return;
    };

    console.log('search!!!')
    console.log(event)
    if(stop_search == ''){

        return;
    }else{
        console.log('here')
        get_survey_data(stop_search).then(data => render(data))
        return;
    }
};

clear_data();

window.addEventListener("submit", clickEvent, false)


