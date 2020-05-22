import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Logo from './../images/seashelllogo.png'
import Profilepic from './../images/avatar-4.png'
import './../css/bootstrap/bootstrap.min.css'
import './../css/personalnavbar.css'


class Navbar extends Component {

    constructor(props){
        super(props);
        this.state = {
            user : JSON.parse(localStorage.getItem('userData'))
        }

        this.logout = this.logout.bind(this)
    }


    logout(){
        localStorage.setItem('userData','')
        localStorage.clear()
    }

    render() {
        return (
            <div>
                <nav className="navbar fixed-top navbar-expand-sm navbar-dark bg-primary">
                    <Link className="navbar-brand" to="/"><img src={Logo} alt="seashell" className="logo"/></Link>
                    <div className="collapse navbar-collapse" id="collapsibleNavId">
                        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href='/' id="dropdownId" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src={Profilepic} className='profilepic' alt="profilepic"/> {this.state.user.user.name}</a>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="/" onClick={this.logout}>Déconnexion</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>           
            </div>
        )
    }
}

export default Navbar
