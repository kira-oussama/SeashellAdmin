import React, { Component } from 'react'
import './../css/main.css'
import Axios from 'axios'
import { Redirect } from 'react-router-dom';

class Main extends Component {

    constructor(props){
        super(props);

        this.state = {
            abonnes : 0,
            exemplaires: 0,
            emprunts : 0,
            penalize : 0,
            mauvais : 0,
            bien : 0,
            exellent : 0,
            redirect : false
        }

    }

    componentDidMount(){
        //redirect if not logged in
        var acessToken = localStorage.getItem('userData');
        if(acessToken==null){
            this.setState({redirect:true})
        }else{
            var token = JSON.parse(localStorage.getItem('userData'))
            token = token.acessToken;
            var headers = {
                headers:{
                    'Accept' : 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            }

            Axios.get('http://localhost:8000/api/admin/exemplaire/stats',headers)
            .then(response=>{
                this.setState({
                    abonnes:response.data.abonnes,
                    exemplaires:response.data.exemplaires,
                    emprunts:response.data.emprunts,
                    penalize:response.data.penalise,
                    mauvais : response.data.mauvais,
                    bien : response.data.bien,
                    exellent : response.data.exellent
                })
            })
            .catch(err=>console.log(err))
        }
    }

    render() {
        var {abonnes,exemplaires,emprunts,penalize,mauvais,bien,exellent,redirect} = this.state;
        if(redirect){
            return <Redirect to={'/login'} />
        }
        return (
            <div className='mainFrame'>
                
                <h1>Informations Generale</h1>
                <div className="row">
                    <div className="infoBox">
                        <h2>{abonnes}</h2>
                        <h3>Abonnés</h3>
                    </div>

                    <div className="infoBox blue">
                        <h2>{exemplaires}</h2>
                        <h3>Exemplaires</h3>
                    </div>
                    
                    <div className="infoBox black">
                        <h2>{emprunts}</h2>
                        <h3>Emprunts</h3>
                    </div>

                    <div className="infoBox sky">
                        <h2>{penalize}</h2>
                        <h3>Abonnés pénalisé</h3>
                    </div>

                </div>

                <h1>Etat Des Exemplaires</h1>
                <div className="row">
                    <div className="infoBox">
                        <h2>{mauvais}</h2>
                        <h3>Mauvais</h3>
                    </div>

                    <div className="infoBox blue">
                        <h2>{bien}</h2>
                        <h3>bien</h3>
                    </div>
                    
                    <div className="infoBox black">
                        <h2>{exellent}</h2>
                        <h3>Exellent</h3>
                    </div>

                </div>
            </div>
        )
    }
}

export default Main
