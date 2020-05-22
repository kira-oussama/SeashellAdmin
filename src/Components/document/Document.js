import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class Document extends Component {
    constructor(props){
        super(props)
        this.deleteuser = this.deleteuser.bind(this)
    }


    deleteuser(){
        this.props.onDelete(this.props.id)
    }

    render() {
        const {titre,auteur,photo,id} = this.props;
        return (
            <div className="card col-3">
                <img src={photo} alt='document'/>
                <div className="card-body">
                    <h4 className="card-title">{titre}</h4>
                    <p className="card-text">{auteur}</p>
                    <div className="row">
                        <Link to={`show/${id}`} className="btn btn-primary card-link consulte-btn col-12">Consulter</Link>
                    </div>
                    <div className="row">
                        <Link to={`edit/${id}`} className="btn btn-primary card-link modifier-btn">Modifier</Link>
                        <button onClick={this.deleteuser} className="btn btn-danger card-link supprimer-btn ml-auto">Suprimmer</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Document
