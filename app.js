import { jsonURL as jsonURL } from './private.js'; 

//STATIC URLS
const survey123Url = jsonURL();
console.log(jsonURL)

//HTML SECTION SELECTORS
const list_div = document.getElementById('list');
const item = document.querySelector('button_popup');
const button_popup = document.querySelector('.button_popup');

let vehicles, filtered_vehicles;
let filtered = false;

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
        return new RegExp('^' + input.replace(/\*/g, '.*') + '$').test(d.attributes.vehicle_number)
        // return d.attributes.vehicle_number == `${input}*`
    });
    filtered_vehicles = d;
    filtered = true;
    return d
}

const get_survey_data = async () => {
    console.log('fetch');
    const response = await fetch(survey123Url);
    const json = await response.json();
    let data = json.features;
    console.log('get_survey_data', data);
    vehicles = data;
    return data;
}

const clear_data = async () => {
    list_div.innerHTML = '';
    return;
}


const render = async (d) => {
    list_div.innerHTML = 'Data is loading...';
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
    if(sorted_data.length == 0){
        list_div.innerHTML = 'No vehicles with that number';
    }else{
        sorted_data.forEach(element => {
            const vehicle_number = element.attributes.vehicle_number;
            let curTime = new Date();

            let cleaningTime = 2 * 60 * 60 * 1000;

            let date = new Date(element.attributes.cleaning_datetime);
            let newDate = (date) => {
                let tod = ' AM';
                let hours = date.getHours()
                if(date.getHours() > 12){
                    hours = hours - 12
                    tod = ' PM'
                }
            return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear() + ' ' + hours + ':' + date.getMinutes() + tod;
            }

            let color = () => {
                if((curTime - date) > cleaningTime){
                    return 'bg-red';
                }else{
                    return 'bg-blue';
                }

            }

            list_div.innerHTML += 
                `<div id='${vehicle_number}' class='button_popup fl w-100 data-oid = ${element.id}'> 
                    <a class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white ${color()}'>
                        <h2 class='fl f3 helvetica fl'>Vehicle: ${vehicle_number}</h2>
                        <h2 class='fl f3 helvetica fl'>   Last Cleaned: ${newDate(date)}</h2>
                    </a>
                </div>`;
        }
    )};

};


const clickEvent = async (event) => {
    event.preventDefault();
    const iframe_exists = document.getElementById('ifrm');
    const iframe = event.target.closest('#iframe');
    const search = event.target.closest('#search');
    const vehicle_search = document.getElementById('vehicle').value;
    
    const searching = async () => {
        list_div.innerHTML = 'Data is loading...';
        clear_data();
        filtered = true;
        let fv = filter_data(vehicles, `${vehicle_search}*`);
        render(await fv);
        return;
    };

    // CLOSE IFRAME / CLICK OFF IFRAME WHEN ITS OPEN
    if(!iframe && iframe_exists){
        
        // CLOSE IFRAME
        iframe.parentNode.removeChild(iframe);
        return;
        
    // SEARCH CLICK!!!
    }else if(search){
        if(vehicle_search != ''){
            searching();
        }else if(vehicle_search == '' && filtered){
            render(vehicles)
            return;
        }

    // CLICK LIST ELEMENT AND OPEN IFRAME!!!
    }else if (event.target.closest('.openpop')){        
        let item = event.target.closest('.openpop');
        let url = item.getAttribute('data-url');
        const ifrm = document.createElement('iframe');
        const el = document.getElementById('marker');
        const main = document.querySelector('#main');

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

