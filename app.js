import { jsonURL, surveyID, surveyData, clientId, redirectUri  } from "./private.js";
import nearest_place from './nearest_place.js';

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('code');

console.log(token)

//STATIC URLS
//HTML SECTION SELECTORS
const list_div = document.getElementById("list");
// let stop_search = document.getElementById("search").value;
let signin = false

// generic lists for putting list of stopID's
let assessments = {
    failed: [],
    approved: [],
    pending: [],
    dig: [],
    missing_place: nearest_place().features
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

    const countyCorrection = (co) => {
        let county = {
            'ST. LOUIS CITY': 'ST. LOUIS CITY',
            'ST LOUIS CITY': 'ST. LOUIS',
            'SAINT LOUIS CITY': 'ST. LOUIS CITY',
            'ST. LOUIS COUNTY': 'ST. LOUIS CITY',
            'ST LOUIS COUNTY': 'ST. LOUIS',
            'SAINT LOUIS COUNTY': 'ST. LOUIS CITY'
        }
        if (county[co.toUpperCase()]) {
            return county[co.toUpperCase()]
        } else {
            alert("THERE IS AN ISSUE WITH THE COUNTY!");
            return `COUNTY ERRROR: ${co}`;
        }
    }

    const cityCorrection = (stop) => {
        const ids = [236, 414, 2425, 2436, 2455, 2456, 2457, 2459, 2571, 2572, 2573, 3019, 3020, 3023, 3024, 3025, 3045, 3047, 3048, 3049, 3050, 3092, 3093, 3094, 3095, 3096, 3132, 3133, 3140, 3883, 3884, 3886, 3888, 3890, 3893, 3894, 3897, 3899, 3901, 3902, 3903, 3904, 3905, 3906, 3909, 3911, 3912, 3913, 3923, 3925, 3928, 3929, 3932, 3946, 3949, 3952, 3953, 3954, 3955, 3956, 3957, 3959, 3962, 3966, 3968, 3971, 3973, 3975, 3977, 3978, 4328, 4492, 4532, 4533, 4535, 4537, 4539, 4560, 4567, 4568, 4569, 4570, 4573, 4574, 4576, 4604, 4616, 4617, 4619, 4622, 4625, 4626, 4627, 4628, 4652, 4654, 4655, 4656, 4657, 4679, 5022, 5023, 5062, 5063, 5194, 5482, 5483, 5484, 5485, 5487, 5488, 5489, 5490, 5491, 5494, 5496, 5510, 5511, 5514, 5515, 5517, 5518, 5519, 5525, 5561, 5562, 5605, 5606, 5607, 5608, 5609, 5610, 5621, 5624, 5625, 5626, 5637, 5638, 5639, 5640, 5643, 5658, 5659, 5660, 5661, 5662, 5663, 5664, 5665, 5666, 5668, 5714, 5717, 5730, 5761, 5771, 5774, 5776, 5779, 5780, 5785, 5786, 5787, 5788, 5792, 5851, 5902, 5904, 5909, 5911, 5912, 5913, 5972, 5993, 5994, 6010, 6061, 6503, 6505, 6506, 6509, 6512, 6683, 6685, 6687, 6689, 6747, 6840, 6841, 6843, 6844, 6845, 6846, 6873, 6940, 6980, 6981, 6984, 7064, 7065, 7066, 7067, 7068, 7070, 7071, 7073, 7074, 7076, 7085, 7087, 7088, 7090, 7091, 7092, 7161, 7162, 7165, 7166, 7167, 7169, 7175, 7178, 7180, 7181, 7182, 7183, 7186, 7188, 7189, 7193, 7613, 7615, 7621, 7637, 7638, 7642, 7643, 7644, 7646, 7699, 7701, 7722, 7724, 7727, 7729, 7730, 7803, 7811, 7813, 7861, 7862, 7864, 7866, 7867, 7868, 7870, 7874, 7876, 8121, 8123, 8127, 8128, 8130, 8143, 8145, 8146, 8147, 8148, 8149, 8150, 8152, 8154, 8155, 8179, 8180, 8182, 8185, 8186, 8187, 8189, 8191, 8208, 8210, 8211, 8214, 8217, 8408, 8706, 8707, 8708, 8721, 8765, 8778, 8779, 9161, 9163, 9164, 9171, 9182, 9186, 9189, 9191, 9192, 9194, 9195, 9200, 9201, 9202, 9215, 9222, 9224, 9235, 9395, 9396, 9397, 9399, 9401, 9404, 9406, 9409, 9411, 9415, 9417, 9418, 9419, 9726, 9733, 9799, 9801, 9814, 9816, 9900, 9908, 9909, 9911, 10033, 10035, 10126, 10129, 10130, 10131, 10132, 10133, 10134, 10135, 10137, 10139, 10141, 10148, 10150, 10152, 10154, 10155, 10157, 10158, 10159, 10160, 10163, 10220, 10345, 10390, 10392, 10396, 10397, 10399, 10401, 10402, 10403, 10405, 10407, 10409, 10461, 10472, 10474, 10475, 10478, 10479, 10481, 10482, 10483, 10485, 10488, 10489, 10492, 10494, 10496, 10498, 10500, 10501, 10502, 10504, 10505, 10508, 10509, 10511, 10533, 10535, 10544, 10547, 10551, 10632, 10633, 10634, 13330, 13410, 13551, 13598, 13636, 13638, 13642, 13657, 13660, 13877, 13964, 13966, 14088, 14100, 14104, 14148, 14444, 14445, 14457, 14458, 14495, 14628, 14676, 14678, 14680, 14681, 14701, 14705, 14706, 14711, 14720, 14726, 14727, 14729, 14730, 14745, 14746, 14747, 14748, 14749, 14904, 14905, 14969, 14970, 14972, 14973, 14974, 14978, 14979, 14980, 14981, 14982, 14983, 14984, 14989, 14996, 15082, 15083, 15156, 15231, 15232, 15488, 15495, 15496, 15498, 15614, 15666, 15753, 15797, 15862, 15884, 15885, 15886, 15887, 15888, 15889, 15890, 15895, 15896, 15897, 15900, 15928, 15981, 15987, 15990, 16023, 16024, 16032, 16033, 16044, 16049, 16050, 16063, 16075, 16076, 16085, 16086, 16097, 16104, 16111, 16112, 16113, 16114, 16115, 16116, 16117, 16118, 16131, 16137, 16138, 16141, 16163, 16190, 16208, 16209, 16210, 16211, 16212, 16218, 16220, 16256, 16257, 16283, 16284, 16285, 16286, 16299, 16300, 16305, 16306, 16312, 16313, 16316];

        if (ids.includes(parseInt(stop['stopID']))) {
            for (let i = 0; i < assessments['missing_place'].length; i++){                
                if (parseInt(assessments['missing_place'][i].properties.stopID) == parseInt(stop.stopID)) {
                    return assessments['missing_place'][i].properties.new_juris;
                }
            };
            console.error('error missing data from nearest place')
            return;
        }

        let muni = {
            'CREVE COUER': 'CREVE COUER',
            'ST LOUIS': "ST. LOUIS",
            'ST LOUIS CITY': 'ST. LOUIS',
        };

        if (muni[stop['JURIS']]) {
            return muni[stop['JURIS']];
        } else {
            return stop['JURIS'];
        }
    }

    const digComplete = id => {
        if (assessments['dig'].includes(parseInt(id))) {
            return 'submitted strike'
        }
        else {
            return;
        }
    }

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
                        <li class='f5 helvetica'><b>Stop ID:</b> ${stop.attributes.stopID}
                        </li>
                        <li class='f5 helvetica'><b>Stop Name:</b> ${stop.attributes.stopName}
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
                    <a class="dig ${digComplete(stop.attributes.stopID)} button_popup openpop link dim br2 ph3 pv2 mb2 dib white bg-orange"
                        data-stopid = '${stop.attributes.stopID}'
                        data-stopname = '${stop.attributes.stopName}'
                        data-stppos = '${stop.attributes.STP_P}'
                        data-onst = '${stop.attributes.onSt}'}'
                        data-atst = '${stop.attributes.atSt}'
                        data-city = '${cityCorrection(stop.attributes)}'
                        data-county = '${countyCorrection(stop.attributes.COUNTY)}'
                        data-state = '${stop.attributes.STATE}' 
                        data-holes = '${stop.attributes.Tholes}'
                        data-location = '${stop.geometry.y}, ${stop.geometry.x}'
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
    console.log(url)
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
            assessments['dig'].push(parseInt(el.attributes.stop_id))
        })
        return assessments['dig'];
    })
}


// generic function that takes a type (pending, approved, failed) and renders only those stops
const getIssues = async (type) => {
    list_div.innerHTML = dataLoading;
    const crossRef = async () => {
        let list = [];
        assessments[type].forEach(async item => {
            await get_survey_data(await jsonURL(item, token).assess)
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

// function for generating iframe for surveys
// divid == the div that the iframe will be inserted into (needs to be in the center of the page)
// url == the url that the iframe is directed to
const iframe_gen = (divid, url) => {
    const div = document.getElementById(divid);

    // setup iframe for rendering
    var ifrm = document.createElement('iframe');
    ifrm.setAttribute('id', 'ifrm'); // assign an id
    ifrm.setAttribute(`src`, url);

    // create close button
    var button = document.createElement('div');
    button.setAttribute('id', 'close'); // assign an id
    button.setAttribute('class', 'w-100 center');
    button.innerHTML = "<a id='close-survey' class='center w-30 helvetica f5 link br2 pv3 dib white bg-dark-red'>Close</a>";

    // to place before another page element (render divs)
    var el = document.getElementById('marker');
    div.parentNode.insertBefore(ifrm, el);
    div.parentNode.insertBefore(button, el)

};

// logic for clicks and submits
const clickEvent = async (event) => {
    // prevents default refresh and whatnot
    event.preventDefault();

    // list of elements
    const iframe_exists = document.getElementById("ifrm");
    const close_button = document.getElementById("close-survey");
    const stop_search = document.getElementById("search").value;

    // list of event targets
    const notification = event.target.closest('#notification-icon');
    const mailbox = event.target.closest('#mailbox-icon');
    const completed = event.target.closest('#completed-icon');
    const signInButton = event.target.closest('#sign-in-icon');
    const close_survey = event.target.closest('#close-survey');
    const item = event.target.closest(".openpop");

    // signin (OAuth) for ArcGIS Online
    // configurations are setup on AGOL developers portal. vars are set in private.js
    
    // if (signInButton || signin == false) {
    if (signInButton) {
        window.location.href = 'https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=' + clientId + '&response_type=code&redirect_uri=' + window.encodeURIComponent(redirectUri), 'oauth-window', 'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes';

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
            initData();
            searching(jsonURL(stop_search, token).assess);
            return;
    }
  // CLOSE IFRAME / CLICK OFF IFRAME WHEN ITS OPEN
    else if (close_survey) {
        // CONFIRM AND CLOSE IFRAME
        // const iframeSource = document.getElementById("ifrm").src;
        const conf = confirm("Do you want to close this survey? If you haven't submitted your data will be lost!")
        
        if (conf == true) {
            iframe_exists.parentNode.removeChild(iframe_exists);
            close_button.parentNode.removeChild(close_button);
            initData();
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
            let dig = event.target.closest('.dig');

            if (dig) {
                return `https://survey123.arcgis.com/share/${surveyID().dig}
                ?center=${dig.dataset.location}
                &field:stop_id=${dig.dataset.stopid}
                &field:stop_name=${dig.dataset.stopname}
                &field:on_street=${dig.dataset.onst}
                &field:at_street=${dig.dataset.atst}
                &field:STP_P=${dig.dataset.stppos}
                &field:city=${dig.dataset.city}
                &field:county=${dig.dataset.county}
                &field:_state=${dig.dataset.state}
                &field:total_number_of_holes_at_stop=${dig.dataset.holes}`
            }
            else {
                return `https://survey123.arcgis.com/share/${surveyID().assess}?mode=edit&objectId=${item.dataset.objectid}`;
            }

        };
            
        let href = url();
        if (href == "") {
            return;
        }
        if (event.target.closest('.submitted')) {
            alert('A dig request has already been submitted for this stop.');
            return;
        }
        iframe_gen('app', href);
        return;
  }
};

const initData = () => {
    getAssessments(surveyData(token).assess);
    getDigRequests(surveyData(token).dig);
    console.log('new data!')
};

const startPage = () => {
    clear_data();
    initData();
};

startPage();

// get new dig and assessment data ever 30 seconds
setInterval(()=>initData(),30*1000)
    
window.addEventListener("click", clickEvent, false);
window.addEventListener("submit", clickEvent, false);

let arc_token = () => {
    console.log(window.url)
}
arc_token()