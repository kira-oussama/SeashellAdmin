import React, { Component } from 'react'
import './../css/personalsidenav.css'
import Profilepic from './../images/avatar-4.png'
import { Link } from 'react-router-dom';
import './../css/bootstrap/bootstrap.min.css'

class Sidebar extends Component {

    constructor(props){
        super(props);
        this.state = {
            user : JSON.parse( localStorage.getItem('userData') )
        }
    }

    render() {
        return (
            <div className="sidebar">
                <div className="sidebar-head">
                    <img src={Profilepic} alt="profilepic"/>
                    <h1>{this.state.user.user.name}</h1>
                </div>
                <hr/>
                <h4>Gerer Les Abonnés</h4>
                <ul className="sidebar-links">
                    <Link to={'/abonne/add'}><li> <i className="fa fa-user-plus" aria-hidden="true"></i> Ajouter un abonné</li></Link>
                    <Link to={'/abonne/search'}><li> <i className="fa fa-search" aria-hidden="true"></i> Rechercher un abonné</li></Link>
                </ul>
                <hr/>
                <h4>Gerer Les Documents</h4>
                <ul className="sidebar-links">
                    <Link to={'/document/add'}><li> <i className="fa fa-file" aria-hidden="true"></i> Ajouter un document</li></Link>
                    <Link to={'/document/search'}><li> <i className="fa fa-search" aria-hidden="true"></i> Rechercher un document</li></Link>
                </ul>
            </div>
        )
    }
}

export default Sidebar