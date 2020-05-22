import React, { Component } from 'react'
import './../../css/personaladd.css'
import Axios from 'axios';
import anime from 'animejs/lib/anime.es'
import loading from './../../images/loading.gif'
import { Link } from 'react-router-dom';

class Edit extends Component {

    constructor(props){
        super(props);
        this.state ={
            nom:'',
            prenom:'',
            adresse:'',
            phoneStart:'',
            num:'',
            email:'',
            numcarte:'',
            sexe:'',
            errors:[],
            is_loading:false,
        }

        this.setDefaultState();
        
        this.phoneStart = this.phoneStart.bind(this)
        this.nomChangeHandler = this.nomChangeHandler.bind(this)
        this.prenomChangeHandler = this.prenomChangeHandler.bind(this)
        this.emailChangeHandler = this.emailChangeHandler.bind(this)
        this.adresseChangeHandler = this.adresseChangeHandler.bind(this)
        this.numcarteChangeHandler = this.numcarteChangeHandler.bind(this)
        this.numChangeHandler = this.numChangeHandler.bind(this)
        this.setGender = this.setGender.bind(this)
        this.addUser = this.addUser.bind(this)
        this.formbackfromsuccess = this.formbackfromsuccess.bind(this)
        this.formbackfromfailed = this.formbackfromfailed.bind(this)
    }


    setDefaultState(){
        var numcarte = window.location.href
        numcarte = numcarte.replace('http://localhost:3000/abonne/edit/','')
        
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
            var number = String(response.data.numtel)
            number =number.substring(2,10)
            var start = String(response.data.numtel)
            start = start.substring(0,2)
            this.setState({
                nom:response.data.nom,
                prenom:response.data.prenom,
                adresse:response.data.adresse,
                num: number,
                phoneStart:start,
                email:response.data.email,
                numcarte:response.data.numcarte,
                sexe:response.data.sexe,
            })
        })
        .then(error=>{
            console.log(error)
        })
    }

    setGender(){
        if(document.querySelector('#male').checked){
            document.querySelector('.male').style.backgroundColor = '#007EE5';
            document.querySelector('.male').style.color = '#FFF';
            document.querySelector('.female').style.backgroundColor = '#FFF';
            document.querySelector('.female').style.color = '#222';
            this.setState({sexe:'male'})
        }else if(document.querySelector('#female').checked){
            document.querySelector('.female').style.backgroundColor = '#FC4445';
            document.querySelector('.female').style.color = '#FFF';
            document.querySelector('.male').style.backgroundColor = '#FFF';            
            document.querySelector('.male').style.color = '#222';            
            this.setState({sexe:'female'})
        }
    }


    phoneStart(){
        var code = document.querySelector('#isp').value

        if(code === '05'){
            document.querySelector('.phonestart').innerHTML = '05';
        }

        if(code === '06'){
            document.querySelector('.phonestart').innerHTML = '06';
        }

        if(code === '07'){
            document.querySelector('.phonestart').innerHTML = '07';
        }

        this.setState({phoneStart:code})
    
    }

    nomChangeHandler(event) {
        this.setState({nom:event.target.value});
    }

    prenomChangeHandler(event) {
        this.setState({prenom:event.target.value});
    }

    emailChangeHandler(event) {
        this.setState({email:event.target.value});
    }

    numcarteChangeHandler(event) {
        this.setState({numcarte:event.target.value});
    }

    numChangeHandler(event) {
        this.setState({num:event.target.value});
    }

    adresseChangeHandler(event) {
        this.setState({adresse:event.target.value});
    }

    formbackfromsuccess(){
        const intialState = {
            nom:'',
            prenom:'',
            adresse:'',
            num:'',
            email:'',
            numcarte:'',
            errors:[]
        }
        document.querySelector('.userform').style.marginLeft = '25%';
        anime({
            targets : '.alert-success',
            translateX : 1000
        })
        document.querySelector('#nom').value = ''
        document.querySelector('#prenom').value = ''
        document.querySelector('#adresse').value = ''
        document.querySelector('#email').value = ''
        document.querySelector('#numc').value = ''
        document.querySelector('#phone_num').value = ''
        this.setState(intialState)
    }


    formbackfromfailed(){
        
        document.querySelector('.userform').style.marginLeft = '25%';
        anime({
            targets : '.alert-danger',
            translateX : 1000
        })
        
        for(var i=0 ; i< this.state.errors.length ; i++){
            this.deletewrongfields(this.state.errors[i])
        }

    }

    deletewrongfields(error){
        
        var regex_nom = /Le nom/;
        var regex_prenom = /Le prenom/;
        var regex_adresse = /Le adresse/;
        var regex_email = /Le email/;
        var regex_numtel = /Le numtel/;
        var regex_numcarte = /Le numcarte/;
        

        // Regex conditions
        if(regex_nom.test(error)){
            document.querySelector('#nom').value = ''
        }
    
        if(regex_prenom.test(error)){
            document.querySelector('#prenom').value = ''
        }
    
        if(regex_adresse.test(error)){
            document.querySelector('#adresse').value = ''
        }
    
        if(regex_email.test(error)){
            document.querySelector('#email').value = ''
        }
    
        if(regex_numtel.test(error)){
            document.querySelector('#phone_num').value = ''
        }
    
        if(regex_numcarte.test(error)){
            document.querySelector('#numc').value = ''
        }
        //regex end
    }

    addUser(event){
        event.preventDefault();
        this.setState({is_loading:true})

        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;

        var numcarte = this.state.numcarte

        var postData = {
            nom : this.state.nom,
            prenom : this.state.prenom,
            adresse : this.state.adresse,
            email : this.state.email,
            numcarte : this.state.numcarte,
            numtel : this.state.phoneStart+this.state.num,
            sexe : this.state.sexe
        }

        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        const that = this;

        Axios.put(`http://localhost:8000/api/admin/abonne/update/${numcarte}`,postData,headers)
        .then(function(response){
            // if user added
            if(!response.data.errors){

                document.querySelector('.userform').style.marginLeft = '110%';
                anime({
                    targets : '.alert-success',
                    translateX : -1000
                })
                that.setState({is_loading:false})
            }else{//if user not added
                document.querySelector('.userform').style.marginLeft = '110%';
                anime({
                    targets : '.alert-danger',
                    translateX : -1000
                })
                that.setState({errors:response.data.errors,is_loading:false})
                console.log(response)
            }
        }).then(function(error){
            console.log(error)
        })



    }

    render() {
        return (
        <div className="userform">

            <div className="alert alert-success" >
                <h1><strong>Succés</strong> l'abonné a était bien modifier.</h1>
                <Link to={'/abonne/search'} className="btn btn-primary btn-lg addnew">retourner</Link>
            </div>

            {<div className="alert alert-danger">
                <h3>il ya un probleme</h3>
                <ul>                    
                    {this.state.errors.map((error,index) =>{
                        return <li key={index}>{error}</li>
                    })}
                </ul>
                <button type="button" className="btn btn-danger btn-lg correct" onClick={this.formbackfromfailed}>Corrigé</button>
            </div>}

            <h1 className="addtitle">Modifier Abonné</h1>
            <form onSubmit={this.addUser}>

                <div className="row">
                    <div className="col-3">
                        <div className="form-group">
                            <label htmlFor="nom">Nom</label>
                            <input type="text" className="form-control" onChange={this.nomChangeHandler} value={this.state.nom} id="nom" maxLength="20" minLength="4" required />  
                        </div>
                    </div>
                

                    <div className="col-3">
                        <div className="form-group">
                            <label htmlFor="prenom">Prenom</label>
                            <input type="text" className="form-control" onChange={this.prenomChangeHandler} value={this.state.prenom} id="prenom" maxLength="20" minLength="4" required />  
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="adresse">Adresse</label>
                            <input type="text" className="form-control" onChange={this.adresseChangeHandler} value={this.state.adresse} id="adresse" maxLength="30" minLength="5" required />  
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" onChange={this.emailChangeHandler} value={this.state.email} id="email" required />  
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="numc">Numéro de carte</label>
                            <input type="text" className="form-control" onChange={this.numcarteChangeHandler} value={this.state.numcarte} id="numc" minLength="12" maxLength="12" required />  
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-3">
                      <label htmlFor="isp">Numero de téléphone : </label>
                      <select className="form-control" name="isp" id="isp" value={this.state.phoneStart} onChange={this.phoneStart}>
                        <option value="07">Djezzy</option>
                        <option value="05">Ooredoo</option>
                        <option value="06">Mobilis</option>
                      </select>
                    </div>
                </div>

                <div className="row">
                    <h4 className="phonestart">{this.state.phoneStart}</h4>
                    <div className="form-group">
                        <input type="text" className="form-control" onChange={this.numChangeHandler} value={this.state.num} id="phone_num" maxLength="8" minLength="8" required />
                    </div>
                </div>


                <label>Sexe :</label>
                <div className="row sexe">
                    <div className="form-check form-check-inline">
                        <label className="form-check-label male">
                            <input className="form-check-input" type="radio" name="sexe" id="male" value="male" defaultChecked={this.state.sexe==='male'} onChange={this.setGender} /> Male <i className="fa fa-mars" aria-hidden="true"></i>
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <label className="form-check-label female">
                            <input className="form-check-input" type="radio" name="sexe" id="female" value="female" defaultChecked={this.state.sexe === 'female'} onChange={this.setGender} /> Female <i className="fa fa-venus"  aria-hidden="true" ></i>
                        </label>
                    </div>
                </div>

        
                <button type="submit" id="add" className="col-3 btn btn-primary">Modifier</button>
                &nbsp;&nbsp;<img src={this.state.is_loading ? loading : ''} alt={this.state.is_loading ? 'loading ...' : ''}/>
        
            </form>
        </div>
        )
    }
}

export default Edit