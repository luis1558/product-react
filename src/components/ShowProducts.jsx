import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowProducts = () => {
  const url = 'https://sgemvite-back-turso-cqbp8f01j-luis-castanedas-projects-c59586f9.vercel.app/equipos';
  const [equipos, updateEquipo] = useState([]);
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(1);
  const [id_equipo, setId_equipo] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [ae_title, setAe_title] = useState('');
  const [ip_address, setIp_address] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [id_sede, setId_sede] = useState('');

  useEffect(() => {
    getEquipos();
  }, []);

  const getEquipos = async () => {
    try {
      const respuesta = await axios.get(url);
      updateEquipo(respuesta.data);
    } catch (error) {
      console.error('Error fetching equipos:', error);
    }
  }

  const openModal = (op, id_equipo = '', nombre = '', tipo = '', marca = '', modelo = '', serie = '', ae_title = '', ip_address = '', ubicacion = '', id_sede = '') => {
    setId_equipo(String(id_equipo));
    setNombre(nombre);
    setTipo(tipo);
    setMarca(marca);
    setModelo(modelo);
    setSerie(serie);
    setAe_title(ae_title);
    setIp_address(ip_address);
    setUbicacion(ubicacion);
    setId_sede(id_sede);
    setOperation(op);
    setTitle(op === 1 ? 'Registrar Equipo' : 'Editar Equipo');
  
    if (op === 3) {
      setNombre(nombre);
      setTipo(tipo);
      setMarca(marca);
      setModelo(modelo);
      setSerie(serie);
      setAe_title(ae_title);
      setIp_address(ip_address);
      setUbicacion(ubicacion);
      setId_sede(id_sede);
    }
  
    window.setTimeout(function () {
      document.getElementById('nombre').focus();
    }, 500);
  }

  const validar = () => {
    let parametros;
    let metodo;
  
    if (String(id_equipo).trim() === '') {
      show_alerta('Escribe el id del Equipo', 'warning');
    } else if (String(nombre).trim() === '') {
      show_alerta('Escribe el nombre del Equipo', 'warning');
    } else if (String(tipo).trim() === '') {
      show_alerta('Escribe el Tipo del Equipo', 'warning');
    } else if (String(marca).trim() === '') {
      show_alerta('Escribe la Marca del Equipo', 'warning');
    } else if (String(modelo).trim() === '') {
      show_alerta('Escribe el modelo del Equipo', 'warning');
    } else if (String(serie).trim() === '') {
      show_alerta('Escribe la Serie del Equipo', 'warning');
    } else if (String(ae_title).trim() === '') {
      show_alerta('Escribe el ae title del Equipo', 'warning');
    } else if (String(ip_address).trim() === '') {
      show_alerta('Escribe la ip address del Equipo', 'warning');
    } else if (String(ubicacion).trim() === '') {
      show_alerta('Escribe la Ubicacion del Equipo', 'warning');
    } else if (String(id_sede).trim() === '') {
      show_alerta('Escribe el id de la Sede del Equipo', 'warning');
    } else {
      parametros = {
        id_equipo: String(id_equipo).trim(), 
        nombre: String(nombre).trim(),
        tipo: String(tipo).trim(),
        marca: String(marca).trim(),
        modelo: String(modelo).trim(),
        serie: String(serie).trim(),
        ae_title: String(ae_title).trim(),
        ip_address: String(ip_address).trim(),
        ubicacion: String(ubicacion).trim(),
        id_sede: String(id_sede).trim(),
      };
      metodo = operation === 1 ? 'POST' : 'PUT';
      enviarSolicitud(metodo, parametros, id_equipo);
    }
  }
  
  

  const enviarSolicitud = async (metodo, parametros, id = '') => {
    let endpoint = url;
    if (metodo !== 'POST') {
      endpoint = `${url}/${id}`; // Agrega id_equipo para PUT y DELETE
    }

    console.log(`Sending ${metodo} request to: ${endpoint}`);
  
    await axios({ method: metodo, url: endpoint, data: metodo !== 'DELETE' ? parametros : {} }) // No enviar datos para DELETE
      .then(function (respuesta) {
        const { tipo, mensaje } = respuesta.data;
        show_alerta(mensaje, tipo);
        if (tipo === 'success') {
          document.getElementById('btnCerrar').click();
          getEquipos(); // Vuelve a obtener los equipos para actualizar la tabla
        }
      })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error'); 
        console.log(error);
      });
  }

  const deleteEquipo = (id_equipo, nombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Estás seguro de eliminar el equipo ' + nombre + ' ?',
      icon: 'question', text: 'No se podrá marcha atrás',
      showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud('DELETE', {}, id_equipo).then(() => {
          getEquipos();
        });
      }
      else {
        show_alerta('El equipo No fue eliminado', 'info');
      }
    })
  }

  return (
    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalEquipos'>
                <i className='fa-solid fa-circle-plus'></i> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-12'>
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>id_equipo</th>
                    <th>nombre</th>
                    <th>tipo</th>
                    <th>marca</th>
                    <th>modelo</th>
                    <th>serie</th>
                    <th>ae_title</th>
                    <th>ip_address</th>
                    <th>ubicacion</th>
                    <th>id_sede</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {equipos.map((equipo, i) => (
                    <tr key={equipo.id}>
                      <td>{i + 1}</td>
                      <td>{equipo.id_equipo}</td>
                      <td>{equipo.nombre}</td>
                      <td>{equipo.tipo}</td>
                      <td>{equipo.marca}</td>
                      <td>{equipo.modelo}</td>
                      <td>{equipo.serie}</td>
                      <td>{equipo.ae_title}</td>
                      <td>{equipo.ip_address}</td>
                      <td>{equipo.ubicacion}</td>
                      <td>{equipo.id_sede}</td>
                      <td>
                        <button onClick={() => openModal(3, equipo.id_equipo, equipo.nombre, equipo.tipo, equipo.marca, equipo.modelo, equipo.serie, equipo.ae_title, equipo.ip_address, equipo.ubicacion, equipo.id_sede)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalEquipos'>
                          <i className='fa-solid fa-edit'></i>
                        </button>
                        &nbsp;
                        <button onClick={() => deleteEquipo(equipo.id_equipo, equipo.nombre)} className='btn btn-danger'>
                          <i className='fa-solid fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div id='modalEquipos' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <input type="hidden" id='id'></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='id_equipo' className='form-control' placeholder='id_equipo' value={id_equipo} onChange={(e) => setId_equipo(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='nombre' className='form-control' placeholder='Nombre' value={nombre} onChange={(e) => setNombre(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='tipo' className='form-control' placeholder='Tipo' value={tipo} onChange={(e) => setTipo(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='marca' className='form-control' placeholder='Marca' value={marca} onChange={(e) => setMarca(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='modelo' className='form-control' placeholder='Modelo' value={modelo} onChange={(e) => setModelo(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='serie' className='form-control' placeholder='Serie' value={serie} onChange={(e) => setSerie(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='ae_title' className='form-control' placeholder='ae_title' value={ae_title} onChange={(e) => setAe_title(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='ip_address' className='form-control' placeholder='ip_address' value={ip_address} onChange={(e) => setIp_address(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='ubicacion' className='form-control' placeholder='ubicacion' value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input type="text" id='id_sede' className='form-control' placeholder='id_sede' value={id_sede} onChange={(e) => setUbicacion(e.target.value)}></input>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='btn btn-success'>
                  <i className='fa-solid fa-floppy-disk'></i> Guardar
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' id='btnCerrar' className='btn btn-danger' data-bs-dismiss='modal'>
                <i className='fa-solid fa-xmark'></i> Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowProducts;
