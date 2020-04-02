//STATIC URLS
const survey123Url = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/arcgis/rest/services/survey123_76494a3414534ab482f28ced119f1f0e_fieldworker/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'

//HTML SECTION SELECTORS
const list_div = document.getElementById('list');
const item = document.querySelector('button_popup');
const main = document.querySelector('#main');
const button_popup = document.querySelector('.button_popup');


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



const render = async () => {
    // DATA
    const response = await fetch(survey123Url);
    const json = await response.json();
    const data = json.features;
    console.log(data)
    //LINKS
    //HTML
    //PROCESSING 
    const sorted_data = data.sort(function (a, b) {
        if (a.attributes.new_requesting_facility <b.attributes.new_requesting_facility) {
            return -1;
        }
        if (b.attributes.new_requesting_facility <a.attributes.new_requesting_facility) {
            return 1;
        }
        return 0;
    });

    console.log(sorted_data)

    sorted_data.forEach(element => {
        // FIELDS
        const new_requesting_facility = element.attributes.new_requesting_facility;
        const requesting_facility = element.attributes.requesting_facility;
        const field_2 = element.attributes.field_2;


        const confirmationURL = `https://survey123.arcgis.com/share/9c92a1442f8b49faa8d5c8da83e581be?field:requesting_facility=${new_requesting_facility}`
        // https://survey123.arcgis.com/share/1cb28b212b5542acbbdbaa35feba0765?field:submittedBy=Fernando%20Paredes
        
        
        list_div.innerHTML += 
            `<div id='${new_requesting_facility}' class='button_popup fl w-100 '> 
                <a class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-blue' data-url="${confirmationURL}">
                    <h2 class='f3 helvetica fl w-100'>${new_requesting_facility}</h2>
                </a>
            </div>`
    
    });

};


const clickEvent = (event) => {
    event.preventDefault();
    const iframe = document.getElementById('ifrm');


    if(!event.target.closest('#iframe') && iframe){
        console.log('iframe present')
        iframe.parentNode.removeChild(iframe);
        return
    }else if(!event.target.closest('.openpop') && !iframe){
        console.log('Not list_div');
        return;
    }else{        
        console.log('list element click')

        let item = event.target.closest('.openpop');
        let url = item.getAttribute('data-url');
        console.log(`url: ${url}`)

        var ifrm = document.createElement('iframe');
        ifrm.setAttribute('id', 'ifrm'); // assign an id
        ifrm.setAttribute(`src`, url);

        //document.body.appendChild(ifrm); // to place at end of document

        // // to place before another page element
        var el = document.getElementById('marker');
        main.parentNode.insertBefore(ifrm, el);

        // // assign url
        // ifrm.setAttribute('src', 'demo.html');

    }
}


render();
window.addEventListener("click", clickEvent, false)