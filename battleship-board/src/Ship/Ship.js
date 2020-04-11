import React from "react";
import Constants from "../Consts.js";

class Ship extends React.Component {

    constructor(props) {
        super(props)
        this.shipLength = props.length * Constants.CELL_SZ;
        
    }

    render() {
        return (
            <div className="ship">
                <h3>Ship</h3>
            </div>
        )
    }
}

export { Ship };