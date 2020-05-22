import React, { Component } from 'react'
import './../../css/personalshowabonne.css'
import Axios from 'axios'
import male from './../../images/gender/male.jpg'
import female from './../../images/gender/female.jpg'
import Exemplaires from './Exemplaires'
import check from './../../images/check.svg'

class Show extends Component {

    constructor(props){
        super(props)
        this.state ={
            nom:'',
            prenom:'',
            adresse:'',
            num:'',
            email:'',
            numcarte:'',
            sexe:'',
            is_loading:true,
            est_penalize:0,
            date_de_depinalization:'',
            is_checked : false,
        }
        this.depinaliserHandler = this.depinaliserHandler.bind(this)
        this.penalizeHandler = this.penalizeHandler.bind(this)
        this.reinitialiser = this.reinitialiser.bind(this)
    }

    componentDidMount(){
        var numcarte = window.location.href
        numcarte = numcarte.replace('http://localhost:3000/abonne/show/','')
        
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;

        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(`http://localhost:8000/api/admin/abonne/show/${numcarte}`,headers)
        .then(response=>{
            this.setState({
                nom:response.data.nom,
                prenom:response.data.prenom,
                adresse:response.data.adresse,
                num: response.data.numtel,
                email:response.data.email,
                numcarte:response.data.numcarte,
                sexe:response.data.sexe,
                est_penalize: response.data.est_penalize,
                date_de_depinalization: response.data.date_de_depinalization,
            })
            this.setState({is_loading:false})
        })
        .then(error=>{
            console.log(error)
        })
    }

    depinaliserHandler = event =>{
        event.preventDefault();

        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;

        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        var post = {
            abonne_numcarte:this.state.numcarte
        }

        Axios.put('http://localhost:8000/api/admin/abonne/depinalise',post,headers)
        .then(response=>{
            this.setState({est_penalize:false})
        })
        .catch(err=>console.log(err))
    }

    penalizeHandler=(est_penalize,date_de_depinalization) =>{
        this.setState({est_penalize,date_de_depinalization})
    }

    reinitialiser = event =>{
        event.preventDefault();

        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;

        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        var post = {
            numcarte:this.state.numcarte
        }

        Axios.put('http://localhost:8000/api/admin/abonne/reinitialiser',post,headers)
        .then(response=>{
            this.setState({is_checked:true})
        })
        .catch(err=>console.log(err))
    }


    render() {
        var {nom,prenom,email,numcarte,sexe,adresse,num,date_de_depinalization} = this.state
        return (
            <div className='profilecontainer'>

                <img className='usershowimg' src={sexe === 'female' ? female : male} alt=""/>
                <h1 className='userinfo username'>{nom + ' ' + prenom}</h1>
                <h1 className='userinfo'>{numcarte}</h1>
                <h1 className='userinfo'>{email}</h1>
                <h1 className='userinfo'>{num}</h1>
                <h1 className='userinfo'>{adresse}</h1>
                {this.state.est_penalize ? <h1 className='userinfo blocked '>Penalisé</h1> : <h1 className='userinfo non-blocked'>Pas Penalizé</h1> }
                {/* eslint-disable-next-line */}
                {this.state.est_penalize ? <h1 className='userinfo blocked '>{date_de_depinalization}</h1> : <h1 className='userinfo'></h1> }
                {/* eslint-disable-next-line */}
                {this.state.est_penalize ? <button className="btn btn-danger" onClick={this.depinaliserHandler}>Depinaliser</button> : <h1 className='userinfo non-blocked'></h1> }&nbsp;&nbsp;
                <button className='btn btn-primary' onClick={this.reinitialiser}>reinitialiser le mot de passe</button>&nbsp;&nbsp;
                <img src={this.state.is_checked ? check : ''} alt={this.state.is_checked ? 'bien':''} height='30px'/>
                <div className='clear'></div>
                <Exemplaires penalizeHandler={this.penalizeHandler} />
            </div>
        )
    }
}

export default Show
