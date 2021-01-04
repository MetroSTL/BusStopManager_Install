import { jsonURL, survey_id, surveyData, clientId, redirectUri  } from "./private.js";

let token;
let logged_in = false;
const fullHash = document.location.hash.split('#')[1];
if (fullHash) {
    const params = JSON.parse('{"' + decodeURI(fullHash).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    token = params.access_token;

}

const sign_in = () => {
    
    window.location.href = 'https://metroas08.metrostlouis.org/arcgis/sharing/rest/oauth2/authorize?client_id=' + clientId + '&response_type=token&redirect_uri=' + window.encodeURIComponent(redirectUri), 'oauth-window', 'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes';
    logged_in = true;
};

// get survey data common function
const get_survey_data = async (url) => {
    const response = await fetch( url);
    const json = await response.json();
    let features = await json.features;
    console.log(features)
    return features;
};

    

// //STATIC URLS
// //HTML SECTION SELECTORS
const list_div = document.getElementById("list");

//POLYFILLS
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}


// clears out list of stops and searchbar
const clear_data = () => {
    document.getElementById("search").value = "";
    document.getElementById('list').innerHTML = "";
    return;
};

// // uses assessment status and returns color for css
// const setStatus = (stop) => {
//     console.log(stop)
//     let obj;
//         // failed renders red
//     if (assessments['failed'].list.includes(stop.attributes.stopID)) {
//         obj = {
//             color: 'red',
//             link: ''
//         };
//         // approved renders green
//     } else if (assessments['approved'].list.includes(stop.attributes.stopID)) {
//         obj = {
//             color: 'green',
//             link: ''
//         };
//         // pending renders orange
//     } else if (assessments['pending'].list.includes(stop.attributes.stopID)) {
//         obj = {
//             color: 'orange',
//             link: ''
//         };
//     } else if (assessments['dig'].list.includes(stop.attributes.stopID)) {
//         obj = {
//             color: 'pink',
//             link: ''
//         };
//         // renders unaddressed as blue
//     } else {
//         obj = {
//             color: 'blue',
//             link: ''
//         }
//     };

//     // start of the data mapping for assessment / install survey / survey button 
//     return `<div>
//                 <button href="#details-${stop.attributes.stopID}"
//                     data-objectid = '${stop.attributes.objectid}'
//                     data-globalid = '${stop.attributes.globalid}'
//                     data-stopid = '${stop.attributes.stopID}'
//                     data-assessStatus = '${stop.attributes.approved}'
//                     data-approvalComments = '${stop.attributes.approvalComments}'

//                     class='button_popup accordion-toggle center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-${obj.color}'>
//                     <ul>
//                         <li class='f5 helvetica'><b>Stop ID:</b> ${stop.attributes.stopID}</li>
//                         <li class='f5 helvetica'><b>Stop Name:</b> ${stop.attributes.stopName}</li>
//                     </ul>
//                 </button>
//             </div>`
//         };

// sort and render stops from specified list
const render = async function (d) {
  // SORTED DATA BY stop NUMBER
    const sorted_data = await d.sort(function (a, b) {
        if (a.attributes.stopID < b.attributes.stopID) {
        return -1;
        }
        if (b.attributes.stopID < a.attributes.stopID) {
        return 1;
        }
        return 0;
    });

    list_div.innerHTML = "";
    // let div = await sorted_data.map( el => setStatus(el) );
    let div = await sorted_data.map( el => {
        return `<div class='w-100 '>
                    <button 
                        onclick='${open_survey(el)}'
                        data-globalid = '${el.attributes.globalid}'
                        class='w-100p-6 m-6 button_popup accordion-toggle center fl w-100 link dim br2 mb2 dib white bg-blue'>
                        <b>Stop ID:</b> ${el.attributes.stop_id}<br/>
                        <b>  Stop Name:</b> ${el.attributes.stop_name}
                    </button>
                </div>`
    });
    console.log('render');
    list_div.innerHTML = await div
    
};

// html filler for showing data is loading
const dataLoading = fullHash ? '<h2 class="i">Data is loading...</h2>' : '<h2 class="i">Please login</h2>'


// search and render stops (generic function)
const searching = (stop_search) => {
    list_div.innerHTML = dataLoading;
    get_survey_data(stop_search).then((data) => {
    render(data);
  });
};

// // adds stop id's to pending, approved, or failed lists
const getAssessments = async (url) => {
        let assessments = await get_survey_data(url);
        render(assessments)
    return assessments
}; 

// // generic function that takes a type (pending, approved, failed) and renders only those stops
// const getIssues = async (type) => {
//     list_div.innerHTML = dataLoading;

//     let l = await assessments[type].obj.length;
//     if(await l > 0) {
//         list_div.innerHTML = assessments[type].obj.map(el => setStatus(el))
//     }
// };

// // function for generating iframe for surveys
// // divid == the div that the iframe will be inserted into (needs to be in the center of the page)
// // url == the url that the iframe is directed to
const iframe_gen = (divid, url) => {
    const div = document.getElementById(divid);

    div.innerHTML =
        `<div id='container' class='center w-100'>
        <iframe id='ifrm' src='${url}' allow="geolocation; microphone; camera"></iframe>
        <div id='close' class='w-100 center'>
                <a id='close-survey' class='center w-30 helvetica f5 link br2 pv3 dib white bg-dark-red'>Close</a>
            </div>
        </div>`;
};

// const close_survey = () => {
//     const close_survey = event.target.closest('#close-survey');
//     const close_button = document.getElementById("container");

//     if (close_survey) {
//         // CONFIRM AND CLOSE IFRAME
//         const conf = confirm("Do you want to close this survey? If you haven't submitted your data will be lost!")
        
//         if (conf == true) {
//             close_button.parentNode.removeChild(close_button);
//             initData();
//         } else {
//             return;
//         }
//         document.getElementById('app').style.display = 'block';
//         return;
//     }
// };

const open_survey = (item) => {        
    let href = `https://survey123.arcgis.com/share/${survey_id}?mode=edit&objectId=${item.objectid}&token=${token}`;
    console.log('opened surve')
    iframe_gen('icontainer', href);
    document.getElementById('icontainer').style.display = 'block';
    return;
};

// // const sign_in = () => {
// //     window.location.href = 'https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=' + clientId + '&response_type=token&redirect_uri=' + window.encodeURIComponent(redirectUri), 'oauth-window', 'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes';
// //     signin = true;
// // };

// const reveal_surveys = () => {
//     // Get the target content
//     var content = document.querySelector(event.target.closest('.accordion-toggle').hash);
//     if (!content) {
//         // kill it
//         return;
//     }
     
//     // If the content is already expanded, collapse it and quit
//     if (content.classList.contains('active')) {
//         content.classList.remove('active');
//         return;
//     }
     
//     // Get all open accordion content, loop through it, and close it
//     var accordions = document.querySelectorAll('.accordion-content.active');
//     for (var i = 0; i < accordions.length; i++) {

//         accordions[i].classList.remove('active');
//     }
     
//     // Toggle our content
//     content.classList.toggle('active');
// };

// // logic for clicks and submits
// const clickEvent = async (event) => {
//     // prevents default refresh and whatnot
//     event.preventDefault();
//     const container = document.getElementById('container');

//     if (container) {
//         close_survey();
    
//     }

//     // list of elements
//     const iframe_exists = document.getElementById("ifrm");
//     const stop_search = document.getElementById("search").value;

//     // list of event targets
//     const notification = event.target.closest('#notification-icon');
//     const mailbox = event.target.closest('#mailbox-icon');
//     const dig_icon = event.target.closest('#dig-icon');
//     const completed = event.target.closest('#completed-icon');
//     // const signInButton = event.target.closest('#sign-in-icon');
//     const item = event.target.closest(".openpop");

//     // signin (OAuth) for ArcGIS Online
//     // configurations are setup on AGOL developers portal. vars are set in private.js
//     // if (signInButton) {
//     //     sign_in();
//     //     return;
//     // }
//     // expand buttons
//     if (event.target.closest('.accordion-toggle')) {
//         reveal_surveys();
//     }
//     else if (((event.type == "submit" && event.target.closest('#form-search'))
//         ||
//         (event.type == 'click' && event.target.closest('#search')))
//         && stop_search != ""
//         && !iframe_exists) {
//             initData();
//             searching(jsonURL(stop_search, token).assess);
//             return;
//     }
//     // render filtered completed surveys (failed, pending, approved)
//     else if (notification) {
//         getIssues('failed');
//         return;
//     } else if (mailbox) {
//         getIssues('pending');
//         return;
//     } else if (completed) {
//         getIssues('approved');
//         return;
//     } else if (dig_icon){
//         getIssues('dig');
//         return;
//     } 
//     else if (event.target.closest(".openpop")) {
//         open_survey(event, item);
//   }
// };

// function handlePermission() {
//     navigator.permissions.query({name:'geolocation'}).then(function(result) {
//       if (result.state == 'granted') {
//         report(result.state);
//       } else if (result.state == 'prompt') {
//         report(result.state);
//         navigator.geolocation.getCurrentPosition(()=>console.log('success'), ()=>console.log('failed', {enableHighAccuracy: true}));
//       } else if (result.state == 'denied') {
//         report(result.state);
//       }
//       result.onchange = function() {
//         report(result.state);
//       }
//     });
//   }
  
//   function report(state) {
//     console.log('Permission ' + state);
//   }
  

const initData = () => {
    getAssessments(surveyData(token));
};

const startPage = () => {
    if (fullHash) {
        clear_data();
        initData();
        // handlePermission();
        // setInterval(()=>initData(),30*1000)
    }
};

startPage()

const clickEvent = (event) => {
    event.preventDefault()
    if(event.type == "click"){
        if(event.target.closest('#sign-in')){
            sign_in()
        }
        // else if (event.target.closest(".openpop")) {
        //     open_survey(event, item);
        // }
        
    }
}
    
window.addEventListener("click", clickEvent, false);
window.addEventListener("submit", clickEvent, false)