import React, { Component } from 'react'
import Axios from 'axios';
import Exemplaire from './Exemplaire';
import '../../css/personalExemplaires.css'
import loading from './../../images/loading.gif'


class Exemplaires extends Component {

    constructor(props){
        super(props);
        this.state = {
            exemplaires:[],
            reference:'',
            numcarte: '',
            is_loading: false,
            errors : [],
            etat :'',
            nvetat:'',
            exemplaire_id:''
        }

        this.referenceChangeHandler = this.referenceChangeHandler.bind(this)
        this.preterExemplaire = this.preterExemplaire.bind(this)
        this.etatChangeHandler = this.etatChangeHandler.bind(this)
        this.rendreChangeHandler = this.rendreChangeHandler.bind(this)
        this.penalizeHandler = this.penalizeHandler.bind(this)
    }

    componentDidMount(){
        var numcarte = window.location.href
        numcarte = numcarte.replace('http://localhost:3000/abonne/show/','')
        this.setState({numcarte})
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;
        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(`http://localhost:8000/api/admin/exemplaire/pret?abonne_numcarte=${numcarte}`,headers)
        .then(response=>{
            this.setState({exemplaires:response.data})
        })
        .catch(err=>console.log(err))
    }

    referenceChangeHandler = event=>{
        this.setState({reference:event.target.value})
    }

    preterExemplaire = event=>{
        event.preventDefault();
        this.setState({is_loading:true})
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;
        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        var post = {
            reference_exemplaire: this.state.reference,
            abonne_numcarte : this.state.numcarte
        }

        Axios.post(`http://localhost:8000/api/admin/exemplaire/pret`, post, headers)
        .then(response=>{
            if(response.data[0]){
                this.setState({exemplaires:[...this.state.exemplaires,response.data[0]],reference:'',is_loading:false})
            }else{
                document.querySelector('.disable').style.display = 'block';
                document.querySelector('.confirm-box').style.display = 'block';
                this.setState({errors:[response.data],is_loading:false})
            }
        })
        .catch(err=>{
            console.log(err)
            this.setState({is_loading:false})
        })

    }

    selfHide = (event , obj)=>{
        document.querySelector(`${obj}`).style.display = 'none';
        document.querySelector(`.disable`).style.display = 'none';
    }

    etatChangeHandler = event=>{
        event.preventDefault()
        this.setState({nvetat:event.target.value})
    }

    etatChanger = etat =>{
        if(etat === 'mauvais'){
            return(
                <select className="form-control" onChange={this.etatChangeHandler} value={this.state.nvetat}>
                    <option value='mauvais'>Mauvais</option>    
                </select>
            )
        }else
        if(etat === 'bien'){
            return(
                <select className='form-control' onChange={this.etatChangeHandler} value={this.state.nvetat}>
                    <option value='bien'>Bien</option>
                    <option value='mauvais'>Mauvais</option>
                </select>
            )
        }else
        if(etat === 'exellent'){
            return(
                <select className='form-control' onChange={this.etatChangeHandler} value={this.state.nvetat}>
                    <option value='exellent'>Exellent</option>
                    <option value='bien'>Bien</option>
                    <option value='mauvais'>Mauvais</option>
                </select>
            )
        }

    }

    showEtatBox = (event,etat,exemplaire_id)=>{
        event.preventDefault();
        document.querySelector('.confirm-box-2').style.display = "block";
        document.querySelector('.disable').style.display = 'block';
        this.setState({exemplaire_id,nvetat:etat,etat})
    }

    rendreChangeHandler = (event,id) =>{
        event.preventDefault();
        this.setState({is_loading:true})
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;
        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        var post = {
            reference_exemplaire: this.state.exemplaire_id,
            abonne_numcarte : this.state.numcarte,
            etat : this.state.nvetat
        }

        Axios.post('http://localhost:8000/api/admin/exemplaire/rendre',post,headers)
        .then(response=>{
            console.log(response)
            document.querySelector('.confirm-box-2').style.display = "none";
            document.querySelector('.disable').style.display = 'none';
            const exemplaires = this.state.exemplaires.filter(exem=>exem.reference_exemplaire !== id);
            this.setState({exemplaires,is_loading:false})
            this.penalizeHandler(response.data.est_penalize,response.data.date_de_depinalization)
        })
        .catch(err=>{
            console.log(err)
            this.setState({is_loading:false})
        })

    }

    penalizeHandler = (est_penalize,date_de_depinalization)=>{
        this.props.penalizeHandler(est_penalize,date_de_depinalization)
    }

    render() {
        return (
            <div >

                <div className="disable"></div>
                <div className="confirm-box">
                    {
                        this.state.errors.map((err,index)=>{
                            return(
                                <h5 key={index}>{err.Errors}</h5>
                            )
                        })
                    }
                    <button className="btn btn-danger" id="hideErrors" onClick={(event)=>this.selfHide(event,'.confirm-box')}>d'accord</button>
                </div>

                <div className="confirm-box-2">
                    <div className="form-group">
                      <label >Qu'elle est l'état de ce livre ?</label>
                      {
                          this.etatChanger(this.state.etat)
                      }
                    </div>

                    <button className="btn btn-danger" id="hideErrors" onClick={(event)=>this.selfHide(event,'.confirm-box-2')}>Fermer</button>
                    <button className='btn btn-success' onClick={event=>this.rendreChangeHandler(event,this.state.exemplaire_id)}>Rendre</button>
                </div>


                <div className="row addexemp">
                    <div className="form-group">
                    <input type="text" className="form-control" placeholder="Reference" onChange={this.referenceChangeHandler} value={this.state.reference} />
                    </div>&nbsp;
                    <div>
                        <button className='btn btn-primary' onClick={this.preterExemplaire} >Préter</button>&nbsp;
                        <img src={this.state.is_loading? loading : ''} alt={this.state.is_loading ? 'loading...' : ''} />
                    </div>
                </div>

                <p style={{color:'#FC4445'}}>{this.state.error}</p>

                {/* exemplaires table */}
                <table className="table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Etat</th>
                            <th>date d'emprunt</th>
                            <th>date de retour</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.exemplaires.map(exem=>{
                                return (
                                    <Exemplaire 
                                        key={exem.id}
                                        reference={exem.reference_exemplaire}
                                        etat={exem.etat}
                                        date_emprunt={exem.pivot.date_emprunt}
                                        date_retour={exem.pivot.date_retour}
                                        selfHide={this.selfHide}
                                        showEtatBox={this.showEtatBox}
                                />)
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Exemplaires
