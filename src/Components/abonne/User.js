import React, { Component } from 'react'
import male from './../../images/gender/male.jpg'
import female from './../../images/gender/female.jpg'
import { Link } from 'react-router-dom'
import './../../css/user.css'

export class User extends Component {

    constructor(props){
        super(props)
        this.deleteuser = this.deleteuser.bind(this)
    }


    deleteuser(){
        this.props.onDelete(this.props.numcarte)
    }
    
    render() {
        const {nom,prenom,sexe,numcarte} = this.props;
        return (
            <div className="card col-3">
                <img src={sexe === 'male' ? male : female} alt="gender"/>
                <div className="card-body">
                    <h4 className="card-title">{nom +' '+ prenom}</h4>
                    <p className="card-text">{numcarte}</p>
                    <div className="row">
                        <Link to={`show/${numcarte}`} className="btn btn-primary card-link consulte-btn col-12">Consulter</Link>
                    </div>
                    <div className="row">
                        <Link to={`edit/${numcarte}`} className="btn btn-primary card-link modifier-btn">Modifier</Link>
                        <button onClick={this.deleteuser} className="btn btn-danger card-link supprimer-btn ml-auto">Suprimmer</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default User
