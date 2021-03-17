import React, { Component } from 'react'

export class Stops extends Component {
    constructor(props) {
        super(props);

        this.state={
            iframe: '',
            display: 'none'
        }
        this.onClick = this.onClick.bind(this);
        this.closeSurvey = this.closeSurvey.bind(this);
    }


    onClick(event, globalid) {
        const {token} = this.props;
        const survey_id = 'ad1421bb1d224e129752bba181588dc9'

        let href = `https://survey123.arcgis.com/share/${survey_id}?portalUrl=https://metroas08.metrostlouis.org/arcgis&mode=edit&globalId=${globalid}&token=${token}`;

        this.setState({iframe: href, display: 'block'})

    }

    closeSurvey() {
        this.setState({iframe: '', display: 'none'})
    }

    render() {
        const {features} = this.props;
        const {iframe} = this.state;
        return (
            <div>
                <div>
                {features.error ?
                    <h1>You need to sign in</h1> :
                    features.map(feat=>{
                        return (
                            <a className='w-100p-6 m-6  w-100 link dim br2 mb2 dib white bg-blue' key={feat.attributes.objectid} onClick={(e)=>this.onClick(e, feat.attributes.globalid)}>
                                <h3>Stop ID: {feat.attributes.stop_id}</h3>
                                <h3>Stop Name: {feat.attributes.stop_name}</h3>
                            </a>
                        )
                    })
                }
                </div>
                <div  id='icontainer' style={{display: `${iframe == '' ? 'none' : 'block'}`}}>
                    <iframe className='w-100 h-100' id='iframe' src={iframe}></iframe>
                    <button className='center w-30 helvetica f5 link br2 pv3 dib white bg-dark-red' onClick={this.closeSurvey}>Close</button>
                </div>
            </div>
        )
    }
}

export default Stops
