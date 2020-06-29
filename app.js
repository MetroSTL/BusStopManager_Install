import { jsonURL, surveyID, surveyData, clientId, redirectUri  } from "./private.js";


// todo:change url based on status
 // edit existing = if failed || pending find the stop id in surveyData()
 // set url to '' if approved
 // attach to setStatus();



//STATIC URLS
//HTML SECTION SELECTORS
const list_div = document.getElementById("list");
let stop_search = document.getElementById("search").value;
let signin = false

// generic lists for putting list of stopID's
let assessments = {
    failed: [],
    approved: [],
    pending: [],
    dig: [],
};

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

// get survey data common function
const get_survey_data = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  let data = json.features;
  return data;
};

// clears out list of stops and searchbar
const clear_data = async () => {
  list_div.innerHTML = "";
  document.getElementById("search").value = "";
  return;
};

// uses assessment status and returns color for css
const setStatus = (stop) => {
    let obj;
        // failed renders red
        if (assessments['failed'].includes(String(stop.attributes.stopID))) {
            obj = {
                color: 'red',
                link: '',
            };
        // approved renders green
        } else if (assessments['approved'].includes(String(stop.attributes.stopID))) {
            obj = {
                color: 'green',
                link: '',
            };
        // pending renders orange
        } else if (assessments['pending'].includes(String(stop.attributes.stopID))) {
            obj = {
                color: 'orange',
                link: '',
            };
        // renders unaddressed as blue
        } else {
            obj = {
                color: 'blue',
                link: '',
            }
    };

    const cityCorrection = (juris) => {
        let muni = {
            'BELLERIVE': " ",
            'CREVE COUER': 'CREVE COUER',
            'O FALLON': " ",

            'SAINT LOUIS COUNTY': "ST. LOUIS COUNTY",
            'ST ANN': " ",
            'ST GEORGE': " ",
            'ST JOHN': " ",
            'ST LOUIS': " ",
            'ST LOUIS CITY': "ST. LOUIS CITY",
            'ST LOUIS COUNTY': "ST. LOUIS COUNTY",
        };

        if (muni[juris]) {
            return muni[juris];
        } else {
            return juris;
        }

    }
    console.log(stop)

    // start of the data mapping for assessment / install survey / survey button 
    return `
        <a href="#details-${stop.attributes.stopID}"
                    data-objectid = '${stop.attributes.objectid}'
                    data-globalid = '${stop.attributes.globalid}'
                    data-stopid = '${stop.attributes.stopID}'
                    data-assessStatus = '${stop.attributes.approved}'
                    data-approvalComments = '${stop.attributes.approvalComments}'

                    class='button_popup accordion-toggle center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-${obj.color}'>
                    <ul>
                        <li class='f3 helvetica'><b>Stop ID:</b> ${stop.attributes.stopID}
                        </li>
                        <li class='f3 helvetica'><b>Stop Name:</b> ${stop.attributes.stopName}
                        </li>    
                    </ul>
                </a>

                <div class="pa2 ba br3 accordion-content w-100" id="details-${stop.attributes.stopID}">
                    <a class="assess button_popup openpop link dim br2 ph3 pv2 mb2 dib white bg-${obj.color}"
                        data-objectid = '${stop.attributes.objectid}'
                        data-globalid = '${stop.attributes.globalid}'
                        data-stopid = '${stop.attributes.stopID}'
                        data-assessStatus = '${stop.attributes.approved}'
                        data-approvalComments = '${stop.attributes.approvalComments}'
                    >
                        Assessment/Install
                    </a>
                    <a class="dig button_popup openpop link dim br2 ph3 pv2 mb2 dib white bg-orange"
                        data-stopid = '${stop.attributes.stopID}'
                        data-stopname = '${stop.attributes.stopName}'
                        data-stppos = '${stop.attributes.STP_P}'
                        data-onst = '${stop.attributes.onSt}'}'
                        data-atst = '${stop.attributes.atSt}'
                        data-city = '${cityCorrection(stop.attributes.JURIS)}'
                        data-county = '${stop.attributes.COUNTY}'
                        data-state = '${stop.attributes.STATE}' 
                        data-holes = '${stop.attributes.Tholes}'
                    >
                        Dig Survey
                    </a>
                </div>`;

};

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
    await sorted_data.forEach((element) => {
        list_div.innerHTML += setStatus(element, 'assess');
    });
    
};

// html filler for showing data is loading
const dataLoading =  '<h2 class="i">Data is loading...</h2>';

// search and render stops (generic function)
const searching = (stop_search, version) => {
    list_div.innerHTML = dataLoading;
    get_survey_data(stop_search).then((data) => {
    render(data, version);
  });
};

// adds stop id's to pending, approved, or failed lists
const getAssessments = (url) => {
    get_survey_data(url)
        .then((data) => { 
            data.forEach(el => {
                // install has not been filled out
                if (el.attributes.approved == "no" || el.attributes.approvalComments != null) {
                    assessments['failed'].push(el.attributes.stopID);
                // if install was approved
                } else if (el.attributes.approved == "yes" ) {
                    assessments['approved'].push(el.attributes.stopID);
                // if stop is pending approval
                } else if (el.attributes.approved == null && el.attributes.installToSpec != null) {
                    assessments['pending'].push(el.attributes.stopID);
                }
            })
        return assessments
    }).then(assessments => {
        if (assessments.failed.length > 0) {
            document.getElementById('notification-icon').src = 'assets/notification2.svg';}
        if (assessments.pending.length > 0) {
            document.getElementById('mailbox-icon').src = 'assets/mailbox2.svg';}
    })
};

const getDigRequests = async (url) => {
    get_survey_data(url).then(data => {
        data.forEach( async el => {        
            console.log(el.attributes.stop_id);
            assessments['dig'].push(parseInt(el.attributes.stop_id))
        })
        return assessments['dig'];
    }).then(list=>console.log(list))
}


// generic function that takes a type (pending, approved, failed) and renders only those stops
const getIssues = async (type) => {
    list_div.innerHTML = dataLoading;
    const crossRef = async () => {
        let list = [];
        assessments[type].forEach(async item => {
            await get_survey_data(await jsonURL(item).assess)
                .then(data => {
                    list.push(data[0]);
                })
        })
        return await list;
    };
    crossRef().then(async data => {
        let div = '';
        // waits 3 seconds to 
        setTimeout(async () => {
            // renders if there are no stops that match that parameter
            if (data.length == 0) {
                list_div.innerHTML = '<h2 class="i">No Stops Match that Parameter</h2>';
            }
            // renders list of stops from the type list
            await data.forEach(async (element) => {
                list_div.innerHTML = ''
                list_div.innerHTML += setStatus(element);
                return await div;
            })
            
        }, 3000);
    })
};

const clickEvent = async (event) => {
    event.preventDefault();
    const iframe_exists = document.getElementById("ifrm");
    stop_search = document.getElementById("search").value;
    const iframe = event.target.closest("#iframe");
    // const search = event.target.closest("#search");
    const notification = event.target.closest('#notification-icon');
    const mailbox = event.target.closest('#mailbox-icon');
    const completed = event.target.closest('#completed-icon');
    var signInButton = event.target.closest('#sign-in-icon');

    let item = event.target.closest(".openpop");
    if (signInButton) {
    // if (signInButton || signin == false) {
        window.open('https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=' + clientId + '&response_type=token&expiration=20160&redirect_uri=' + window.encodeURIComponent(redirectUri), 'oauth-window', 'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes')
        signin = true;
        return;
    }
    // expand buttons
    else if (event.target.closest('.accordion-toggle')) {
        // Get the target content
        var content = document.querySelector(event.target.closest('.accordion-toggle').hash);
        if (!content) {
            // kill it
            return;
        }
        
        // If the content is already expanded, collapse it and quit
        if (content.classList.contains('active')) {
            content.classList.remove('active');
            return;
        }
        
        // Get all open accordion content, loop through it, and close it
        var accordions = document.querySelectorAll('.accordion-content.active');
        for (var i = 0; i < accordions.length; i++) {

            accordions[i].classList.remove('active');
        }
        
        // Toggle our content
        content.classList.toggle('active');
    }
    else if (((event.type == "submit" && event.target.closest('#form-search'))
        ||
        (event.type == 'click' && event.target.closest('#search')))
        && stop_search != ""
        && !iframe_exists) {
            searching(jsonURL(stop_search).assess);
            return;
    }
  // CLOSE IFRAME / CLICK OFF IFRAME WHEN ITS OPEN
    else if (!iframe && iframe_exists) {
        // CONFIRM AND CLOSE IFRAME
        const iframeSource = document.getElementById("ifrm").src;
        const conf = confirm("Do you want to close this survey? If you haven't submitted your data will be lost!")
        
        if (conf == true) {
            iframe_exists.parentNode.removeChild(iframe_exists);
        } else {
            return;
        }
        return;

    // render filtered completed surveys (failed, pending, approved)
    } else if (notification) {
        getIssues('failed');
        return;
    } else if (mailbox) {
        getIssues('pending');
        return;
    } else if (completed) {
        getIssues('approved');
        return;

    // CLICK LIST ELEMENT AND OPEN IFRAME!!!
    // dataset: DOMStringMap(8)
        // atst: "UNION BLVD"
        // city: "ST LOUIS"
        // county: "ST LOUIS CITY"
        // holes: "0"
        // onst: "WATERMAN BLVD"
        // state: "MO"
        // stopid: "15033"
        // stppos: "NS"
        
    } else if (event.target.closest(".openpop")) {
        let url = () => {
            if (event.target.closest('.dig')) {
                return `https://survey123.arcgis.com/share/${surveyID().dig}
                ?field:stop_id=${event.target.closest('.dig').dataset.stopid}
                &field:stop_name=${event.target.closest('.dig').dataset.stopname}
                &field:on_street=${event.target.closest('.dig').dataset.onst}
                &field:at_street=${event.target.closest('.dig').dataset.atst}
                &field:STP_P=${event.target.closest('.dig').dataset.stppos}
                &field:city=${event.target.closest('.dig').dataset.city}
                &field:county=${event.target.closest('.dig').dataset.county}
                &field:_state=${event.target.closest('.dig').dataset.state}
                &field:total_number_of_holes_at_stop=${event.target.closest('.dig').dataset.holes}`
            }
            else {
                return `https://survey123.arcgis.com/share/${surveyID().assess}?mode=edit&objectId=${item.dataset.objectid}`;
            }

        };
            
        let href = url();
        console.log(href)
        if (href == "") {
            return;
        }
        const ifrm = document.createElement("iframe");
        const el = document.getElementById("marker");
        const main = document.querySelector("#main");

        ifrm.setAttribute("id", "ifrm"); // assign an id
        ifrm.setAttribute(`src`, href);

        main.parentNode.insertBefore(ifrm, el);
        return;
  }
};

clear_data();
getAssessments(surveyData().assess);
getDigRequests(surveyData().dig);
window.addEventListener("click", clickEvent, false);
window.addEventListener("submit", clickEvent, false);
