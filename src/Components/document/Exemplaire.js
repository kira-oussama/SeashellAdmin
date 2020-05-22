import React, { Component } from 'react'

class Exemplaire extends Component {
    constructor(props){
        super(props);
        // this.supprimerExemplaire = this.supprimerExemplaire.bind(this)
        this.showConfirmBox = this.showConfirmBox.bind(this)
    }

    // supprimerExemplaire = ()=>{
    //     this.props.supprimerExemplaire(this.props.reference_exemplaire)
    // }

    showConfirmBox=(event,reference_exemplaire)=>{
        this.props.showConfirmBox(event,reference_exemplaire)
    }
    render() {
        const {reference_exemplaire,etat}= this.props;
        return (
            <tr key={reference_exemplaire}>
                <td>{reference_exemplaire}</td>
                <td>{etat}</td>
                    <td>
                        <button className='btn btn-danger' onClick={event=>this.showConfirmBox(event,reference_exemplaire)} >Supprimer</button>
                    </td>
            </tr>
        )
    }
}

export default Exemplaire
