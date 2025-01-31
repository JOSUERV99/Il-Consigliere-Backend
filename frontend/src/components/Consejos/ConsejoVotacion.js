import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Convocados from './Convocados';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import DefaultComponent from '../../helpers/DefaultComponent';
import { Loading } from '../../helpers/Loading';
import { myAlert } from '../../helpers/alert';
import './Consejos.css';
var fileDownload = require('js-file-download');

export default class Consejos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      consecutivo: this.props.match.params.consecutivo,
      consejo: {},
      aprobados: [],
      Convocados: [],
      punto: '',
      cedula: auth.getInfo().cedula,
      encontrado: true,
      redirect: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkedCouncil = this.checkedCouncil.bind(this);
    this.generarActa = this.generarActa.bind(this);
  }

  componentDidMount() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get(`/consejo/${this.state.consecutivo}`)
            .then(res => {
              if (res.data.success) {
                console.log(res.data.council);
                this.setState({
                  isLoading: false,
                  consejo: res.data.council
                });
                axios.get(`/punto/votacion/${this.state.consecutivo}`)
                  .then(resp => {
                    if (resp.data.success) {
                      for (let i = 0; i < resp.data.discussions.length; i++) {
                        resp.data.discussions[i].editable = false;
                        if (resp.data.discussions[i].abstencion === null) {
                          resp.data.discussions[i].nuevo = true;
                        } else {
                          resp.data.discussions[i].nuevo = false;
                        }
                      }
                      this.setState({
                        aprobados: resp.data.discussions
                      });
                    }
                  })
                  .catch((err) => console.log(err));
              } else {
                this.setState({
                  isLoading: false,
                  encontrado: false
                });
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  handleInputChange(e, i) {
    let value = e.target.value;
    let name = e.target.name;
    if ((!Number(value)) && (value !== '') && (value !== '0')) {
      return;
    }
    let puntos = this.state.aprobados;
    puntos[i][name] = value;
    this.setState({
      aprobados: puntos
    });
  }

  saveChanges(e, i) {
    e.preventDefault();
    let puntos = this.state.aprobados;
    puntos[i].editable = false;
    if (puntos[i].favor === null) {
      puntos[i].favor = 0;
    }
    if (puntos[i].contra === null) {
      puntos[i].contra = 0;
    }
    if (puntos[i].abstencion === null) {
      puntos[i].abstencion = 0;
    }
    let punto = puntos[i];
    if (punto.nuevo) {
      axios.post('/votacion', { id_punto: punto.id_punto, favor: punto.favor, contra: punto.contra, abstencion: punto.abstencion })
        .then(res => {
          if (res.data.success) {
            puntos[i].nuevo = false;
            this.setState({
              aprobados: puntos
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      axios.put('/votacion', { id_punto: punto.id_punto, favor: punto.favor, contra: punto.contra, abstencion: punto.abstencion })
        .then(res => {
          if (res.data.success) {
            this.setState({
              aprobados: puntos
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  makeEditable(e, i) {
    e.preventDefault();
    let puntos = this.state.aprobados;
    puntos[i].editable = true;
    this.setState({
      aprobados: puntos
    });
  }

  checkedCouncil(e) {
    e.preventDefault();
    swal({
      title: "Confirmación",
      text: `La información de este consejo no se podrá volver a editar.`,
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    })
      .then((willUpdate) => {
        if (willUpdate) {
          axios.put(`/consejo/no_editable/${this.state.consecutivo}`)
            .then(res => {
              if (res.data.success) {
                this.props.history.push('/gConsejos');
              }
            })
            .catch((err) => console.log(err));
        }
      });
  }

  getDiscussions() {
    const discussions = [];
    for (let i = 0; i < this.state.aprobados.length; i++) {
      discussions.push(
        this.getDiscussion(this.state.aprobados[i], i)
      );
    }
    return discussions;
  }

  getDiscussion(discussion, i) {
    if (!this.state.consejo.editable) {
      if (discussion.id_tipo_punto === 2) {
        return <div  key={i}>
                  <li className='m-0 text-justify'>{discussion.asunto}</li>;
                  {discussion.comentario && <p className='text-justify m-0 my-muted'>Comentario: {discussion.comentario}</p>}
                </div>
      }
      return (
        <div className='my-2' key={i}>
          <li className='m-0 text-justify'>{discussion.asunto}</li>
          {discussion.comentario && <p className='text-justify m-0 my-muted'>Comentario: {discussion.comentario}</p>}
          <p className='m-0'>Resultados de votaciones</p>
          <div className='d-flex align-items-center'>
            <p className='m-0'>A favor: {discussion.favor}</p>
            <p className='m-0 mx-2'>En contra: {discussion.contra}</p>
            <p className='m-0'>Abstenciones: {discussion.abstencion}</p>
          </div>
        </div>
      );
    }
    if (discussion.id_tipo_punto === 2) {
      return <div>
                <li className='m-0 text-justify' key={i}>{discussion.asunto}</li>
                {discussion.comentario && <p className='text-justify m-0 my-muted'>Comentario: {discussion.comentario}</p>}
              </div>
    }
    if (discussion.editable) {
      return (
        <div className='my-2' key={i}>
          <li className='m-0 text-justify'>{discussion.asunto}</li>
          {discussion.comentario && <p className='text-justify m-0 my-muted'>Comentario: {discussion.comentario}</p>}
          <div className='justify-content-between align-items-center flex-fill'>
            <div className='d-flex flex-column justify-content-center align-items-center '>
              <div className='d-flex flex-row'>
                <label className='p-2  flex-fill'> A favor: </label>
                <label className='p-2 mx-2  flex-fill'> En Contra: </label>
                <label className='p-2  flex-fill'> Abstenciones: </label>
              </div>
              <div className='d-flex flex-row'>
                <input type="text" required maxLength="4" name="favor"
                  placeholder="a favor" autoComplete="off" className="form-control votacion-input"
                  onChange={(e) => this.handleInputChange(e, i)} value={discussion.favor === null ? '' : discussion.favor} />
                <input type="text" required maxLength="4" name="contra"
                  placeholder="en contra" autoComplete="off" className="form-control votacion-input mx-2"
                  onChange={(e) => this.handleInputChange(e, i)} value={discussion.contra === null ? '' : discussion.contra} />
                <input type="text" required maxLength="4" name="abstencion"
                  placeholder="abstenciones" autoComplete="off" className="form-control votacion-input"
                  onChange={(e) => this.handleInputChange(e, i)} value={discussion.abstencion === null ? '' : discussion.abstencion} />
                <button className="far fa-check-circle my-icon fa-lg my-button mx-1" type="button" onClick={(e) => this.saveChanges(e, i)} />
              </div>
            </div>
            
          </div>
        </div>
      );
    }
    if (!discussion.nuevo) {
      return (
        <div className='my-2' key={i}>
          <li className='m-0 text-justify'>{discussion.asunto}</li>
          {discussion.comentario && <p className='text-justify m-0 my-muted'>Comentario: {discussion.comentario}</p>}
          <p className='m-0'>Resultados de votaciones</p>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex align-items-center'>
              <p className='m-0'>A favor: {discussion.favor}</p>
              <p className='m-0 mx-2'>En contra: {discussion.contra}</p>
              <p className='m-0'>Abstenciones: {discussion.abstencion}</p>
            </div>
            <button className="fas fa-edit my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.makeEditable(e, i)} />
          </div>
        </div>
      );
    }
    return (
      <div className='d-flex justify-content-between align-items-center my-2' key={i}>
        <li className='m-0 text-justify'>{discussion.asunto}</li>
        {discussion.comentario && <p className='text-justify m-0 my-muted'>Comentario: {discussion.comentario}</p>}
        <button className="fas fa-vote-yea my-icon fa-lg mx-1 my-button" type="button" onClick={(e) => this.makeEditable(e, i)} />
      </div>
    );
  }

  generarActa() {
    console.log('aqui');
    try{

      axios.get(`/convocado/nombres_usuario/${this.state.consecutivo}`)
      .then(resp => {
        if (resp.data.success) {
          var convs = []
          for (let i = 0; i < resp.data.convocados.length; i++) {
            let convocado = resp.data.convocados[i];
            convs.push(convocado);
          }
          var aprob = this.state.aprobados;
          for (let i = 0; i < aprob.length; i++) {
            aprob[i]['orden'] = i+1;
          } 
          var data = {
            consecutivo: this.state.consecutivo,
            campus: this.state.consejo.campus,
            carrera: this.state.consejo.carrera,
            fecha: this.state.consejo.fecha,
            hora: this.state.consejo.hora,
            tipoSesion: 'Ordinaria',
            institucion: this.state.consejo.institucion,
            lugar: this.state.consejo.lugar,
            nombre_consejo: this.state.consejo.nombre_consejo,
            puntos: aprob,
            Convocados:  convs
          }
          axios.post('/consejo/generarActa/', data, {responseType: "blob"})
          .then(response => {
            const regExpFilename = /filename="(?<filename>.*)"/;
            const filename = regExpFilename.exec(response.headers["content-disposition"])?.groups?.filename ?? null;
            console.log(filename);
            fileDownload(response.data, filename);
          }, (error) =>{
            alert('error al descargar' + error);
          });

        }
      })
      .catch((err) => console.log(err));
    } catch(error){
      myAlert('Atencion', 'Error al generar acta.','error');
      console.log(error);
    }
  }

  displayActa() {
    return  <div className="form-group d-flex justify-content-left">
              <button className="btn btn-outline-primary mt-4 editar-button" onClick={this.generarActa}>Generar Acta</button>
            </div>
  }

  render() {
    console.log(this.state.consejo.editable);
    return (this.state.isLoading ? <Loading /> : this.state.redirect ? <Redirect to='/' /> : !this.state.encontrado ? <DefaultComponent /> :
      <>
        <Navegacion />
        <div className="row m-0">
          <div className="col-md-11 m-auto">
            <div className="card border-primary consejo-card">
              <div className="card-body">
                <Link to='/gConsejos'><i className="fas fa-times fa-lg m-2 ubicar-salida" style={{ color: 'navy' }}></i></Link>
                <div className='todo-registro'>
                  <div className='registro-container izq'>
                    <p className="card-title text-center text-uppercase m-0">{this.state.consejo.institucion}</p>
                    <p className='text-uppercase text-center m-0'>{this.state.consejo.escuela}</p>
                    <p className='text-uppercase text-center m-0'>Convocatoria</p>
                    <p className='text-uppercase text-center m-0'>Sesión {this.state.consejo.id_tipo_sesion === 1 ? 'Ordinaria' : 'Extraordinaria'} {this.state.consecutivo}</p>
                    <p className='text-uppercase text-center m-0'>{this.state.consejo.nombre_consejo}</p>
                    <p className='text-center m-0'>FECHA: {this.state.consejo.fecha}</p>
                    <p className='text-center m-0'>HORA: {this.state.consejo.hora}</p>
                    <p className='text-center m-0'>LUGAR: {this.state.consejo.lugar}</p>
                    <hr />
                    <Convocados consecutivo={this.state.consecutivo} />
                  </div>
                  <div className='registro-container der'>
                    <p>Puntos de Agenda:</p>
                    <div className='punto-votacion'>
                      <ol className='pl-4 m-0'>
                        {this.getDiscussions()}
                      </ol>
                    </div>
                  </div>
                </div>
                {this.state.consejo.editable &&
                  <div className="form-group d-flex justify-content-around">
                    <button type="button" className="btn btn-outline-primary mt-4 editar-button" onClick={this.checkedCouncil}>Guardar Cambios</button>
                    <Link className="btn btn-outline-secondary mt-4 editar-button" to='/gConsejos'>Cancelar</Link>
                  </div>
                }
                {!this.state.consejo.editable &&
                  this.displayActa()
                }
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
