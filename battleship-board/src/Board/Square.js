import React from "react";
import "./Board.css";

class Square extends React.Component {    
    render() {        
        return (
            <td className="boardCell" style={{
                width: "auto",
                height: this.props.size
            }}
            onClick={this.props.clicked} >
                <div style={{
                    border: "1px solid",                    
                    borderColor: "black",    
                    backgroundColor: this.props.color,        
                    height: this.props.size,
                    width: this.props.size              
                }} />
            </td>
        )
    }
}

export default Square;