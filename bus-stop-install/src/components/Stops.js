import React, { Component } from 'react'



export class Stops extends Component {
    constructor(props) {
        super(props);

        this.state={
            iframe: ''
        }
        this.onClick = this.onClick.bind(this);
    }


    onClick(event, globalid) {
        const {token} = this.props;
        const survey_id = 'ad1421bb1d224e129752bba181588dc9'

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

        const open_survey = (href) => {        
            console.log('opened surve')
            // iframe_gen('icontainer', href);
            this.setState({iframe:href})
            document.getElementById('icontainer').style.display = 'block';
            document.getElementById('icontainer').src = href;
            return;
        };

        
        let href = `https://survey123.arcgis.com/share/${survey_id}?portalUrl=https://metroas08.metrostlouis.org/arcgis&mode=edit&globalId=${globalid}&token=${token}`;

        open_survey(href)
    }

    render() {
        const {features} = this.props;
        return (
            <div>
                {features.map(feat=>{
                    return (
                    <button className='rounded-md w-100 white bg-blue' key={feat.attributes.objectid} onClick={(e)=>this.onClick(e, feat.attributes.globalid)}>
                        <h3>Stop ID: {feat.attributes.stop_id}</h3>
                        <h3>Stop Name: {feat.attributes.stop_name}</h3>
                    </button>)
                })}
                <div  id='icontainer'>
                    <iframe className='w-100 h-100' id='iframe' src={this.state.iframe}></iframe>
                    <button className='center w-30 helvetica f5 link br2 pv3 dib white bg-dark-red' onClick={()=>document.getElementById('icontainer').style.display = 'none'}>Close</button>
                </div>
            </div>
        )
    }
}

export default Stops
