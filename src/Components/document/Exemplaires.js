import React, { Component } from 'react'
import Axios from 'axios';
import Exemplaire from './Exemplaire';
import loading from './../../images/loading.gif'

class Exemplaires extends Component {

    constructor(props){
        super(props);

        this.state = {
            exemplaires:[],
            reference_exemplaire : '',
            etat : 'mauvais',
            error:'',
            reference_del:'',
            is_loading :false
        }

        this.referenceChangeHandler = this.referenceChangeHandler.bind(this)
        this.etatChangeHandler = this.etatChangeHandler.bind(this)
        this.ajouterExemplaire = this.ajouterExemplaire.bind(this)
        this.showConfirmBox = this.showConfirmBox.bind(this)
    }

    componentDidMount(){
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;
        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(`http://localhost:8000/api/admin/exemplaire/show/${this.props.document_id}`,headers)
        .then(response=>{
            this.setState({exemplaires:response.data})
        })
        .catch(err=>console.log(err))
    }

    referenceChangeHandler = event=>{
        this.setState({reference_exemplaire:event.target.value})
    }

    etatChangeHandler = event=>{
        this.setState({etat:event.target.value})
    }

    ajouterExemplaire = event=>{
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
            document_id : this.props.document_id,
            reference_exemplaire : this.state.reference_exemplaire,
            etat : this.state.etat
            
        }

        Axios.post('http://localhost:8000/api/admin/exemplaire/store',post,headers)
        .then(response=>{
            console.log(response)
            if(response.status === 201){
                this.setState({exemplaires:[...this.state.exemplaires,{reference_exemplaire:this.state.reference_exemplaire,etat:this.state.etat}]})
                this.setState({is_loading:false})
            }else{
                this.setState({error:'La référence doit etre unique et n\'est pas vide '})
                this.setState({is_loading:false})
            }
        })
        .catch(err=>{
            console.log(err)
            this.setState({is_loading:false})
        })

    }

    supprimerExemplaire = (event)=>{
        event.preventDefault()
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;

        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.delete(`http://localhost:8000/api/admin/exemplaire/${this.state.reference_del}`,headers)
        .then(response=>{
            if(response.data.id){
                const exemplaires = this.state.exemplaires.filter(exem => exem.reference_exemplaire !== this.state.reference_del)
                this.setState({exemplaires})
                document.querySelector('.disable').style.display = 'none';
                document.querySelector('.confirm-box').style.display = 'none';
            }
        })
        .catch(err=>console.log(err))
    }

    showConfirmBox = (event,reference_del)=>{
        event.preventDefault();
        this.setState({reference_del})
        document.querySelector('.disable').style.display = 'block';
        document.querySelector('.confirm-box').style.display = 'block';
    }

    hideSelf = ()=>{
        document.querySelector('.disable').style.display = 'none';
        document.querySelector('.confirm-box').style.display = 'none';
    }

    render() {
        return (
            <div>

                <div className="disable"></div>
                <div className="confirm-box">
                    <h4>Est-ce que vous étes sur de supprimmer cette exemplaire ?</h4>
                    <button className="btn btn-primary" id="hideErrors" onClick={this.hideSelf}>Non</button>
                    <button className="btn btn-danger" id="hideErrors" onClick={this.supprimerExemplaire}>Oui</button>
                </div>


                {/* the search form */}
                <div className="row addexemp">
                    <div className="form-group">
                    <input type="text" className="form-control" placeholder="reference" onChange={this.referenceChangeHandler} value={this.state.reference}/>
                    </div>&nbsp;
                    <div className="form-group">
                        <select className="form-control" onChange={this.etatChangeHandler} value={this.state.etat}>
                            <option value='mauvais'>Mauvais</option>
                            <option value='bien'>Bien</option>
                            <option value='exellent'>Exellent</option>
                        </select>
                    </div>&nbsp;
                    <div>
                        <button className='btn btn-primary' onClick={this.ajouterExemplaire}>Ajouter</button>&nbsp;&nbsp;
                        <img src={this.state.is_loading ? loading : ''} alt={this.state.is_loading ? 'loading...' : ''}/>
                    </div>
                </div>

                <p style={{color:'#FC4445'}}>{this.state.error}</p>

                {/* exemplaires table */}
                <table className="table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Etat</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.exemplaires.map(exem =>{
                                return(
                                    <Exemplaire 
                                        key={exem.reference_exemplaire}
                                        reference_exemplaire={exem.reference_exemplaire}
                                        etat={exem.etat}
                                        supprimerExemplaire={this.supprimerExemplaire}
                                        showConfirmBox={this.showConfirmBox}
                                    />
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Exemplaires
