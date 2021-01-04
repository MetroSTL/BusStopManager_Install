import React, { Component } from 'react'



export class Stops extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log("stops state: ",this.state)
    }

    render() {
        const {features} = this.props;
        return (
            <div>
                {features.map(feat=>{
                    return (<button>
                        <h3>Stop ID: {feat.attributes.stop_id}</h3>
                        <h3>Stop Name: {feat.attributes.stop_name}</h3>
                        </button>)
                })}
            </div>
        )
    }
}

export default Stops
