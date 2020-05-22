import React, { Component } from 'react'

class Exemplaire extends Component {

    // constructor(props){
    //     super(props);

    // }

    showEtatBox = (event , etat ,exemplaire_id)=>{
        event.preventDefault();
        this.props.showEtatBox(event, etat , exemplaire_id);
    }

    render() {
        var {date_emprunt , date_retour, reference , etat} = this.props;
        return (
            <tr>
                <td>{reference}</td>
                <td>{etat}</td>
                <td>{date_emprunt}</td>
                <td>{date_retour}</td>
                <td>
                <button className='btn btn-danger' onClick={(event)=>this.showEtatBox(event,etat,reference)}>Rendre</button>
                </td>
            </tr>
        )
    }
}

export default Exemplaire