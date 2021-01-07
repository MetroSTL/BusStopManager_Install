import React, { Component } from 'react';
import Stops from'./Stops';
import axios from 'axios';


export class Search extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            form : "",
            blank: '',
            token: this.props.token,
            stops: []
        };
    
        this.textInput = this.textInput.bind(this);
        this.searchStops = this.searchStops.bind(this);
    }



    searchStops(event) {
        event.preventDefault()
        const jsonURL = (id) => `https://metroas08.metrostlouis.org/arcserver/rest/services/Hosted/Install_Survey_Results_Bus_Stop_Manager/FeatureServer/0/query?where=cast%28stop_id+as+varchar%2810%29%29+LIKE+%27%25${id}%25'&%28assess_feasible+%3D+%27YES%27%29+OR+%28install_approved+<>+%27YES%27%29&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnCentroid=false&sqlFormat=none&resultType=&datumTransformation=&f=pjson&token=${this.state.token}`
        axios.get(jsonURL(this.state.form))
        .then(d=>{
            this.setState({stops: d.data.features})

        })
    }
    
    textInput(event) {
        this.setState(()=>({form: event.target.value}))
    }

    render() {
        return (
             <div id='init-search' className="w-70" style={{marginLeft:'auto', marginRight:'auto'}}>
                <form id="form-search" className="px-40 black-80">
                    <label for="stop" className="center f6 b mb2">Stop ID</label>
                    <div className="measure" className='mx-auto'>
                        <input id="search" onChange={this.textInput} className="input mx-auto w-90 helvetica input-reset ba b--black-20 pa2 mb2 " type="number" aria-describedby="name-desc" />
                        <small id="stop" className="row mx-auto text-center flex justify-center f6 black-60 mb2">Enter a Stop ID to start a search.</small>
                        <button 
                        id="search" 
                        onClick={this.searchStops}
                        className="input w-80 helvetica link dim br2 ph3 pv2 mb2 dib white bg-dark-blue ">
                            Search</button>
                    </div>
                </form>   
                <Stops features={this.state.stops} token={this.state.token} /> 
            </div>
        )
    }
}

export default Search
