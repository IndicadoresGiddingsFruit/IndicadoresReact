import React, { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';
import { makeStyles, Grid, Button, Modal, Paper, Typography } from '@material-ui/core';
import Contenedor from '../Contenedor.jsx';
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table';
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
    textAlign: "center",
  }
}))

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const rows = [
  {
    title: 'Id',
    field: 'id',
    width: -1,
    hidden: true
  },
  {
    title: 'Codigo',
    field: 'cod_Prod',
  },
  {
    title: 'Productor',
    field: 'productor'
  },
  {
    title: 'Asesor',
    field: 'asesor'
  },
  {
    title: 'Estatus',
    field: 'descEstatus'
  },
  {
    title: 'Comentarios',
    field: 'comentarios'
  },
  {
    title: 'SaldoFinal',
    field: 'saldoFinal'
  },
  {
    title: 'Semana 27-52',
    field: 'caja1'
  },
  {
    title: 'Semana 1-actual',
    field: 'caja2',
  }
];

const Financiamiento = (props) => {
  const styles = useStyles();
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/seguimiento";
  //const url="https://localhost:44344/api/seguimiento";    
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [estatusList, setEstatusList] = useState([]);
  const [enviados, setEnviados] = useState([]);
  const [sinEnviar, setSinEnviar] = useState([]);
  const [modoEdicion, setmodoEdicion] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingAP, setLoadingAP] = useState(false);
  const [loadingS, setLoadingS] = useState(false);

  const [id, setId] = useState('');
  const [admin, setAdmin] = useState(false);
  let idagen, recipient;
  const [asesor, setAsesor] = useState(null);
  const [descEstatus, setDescEstatus] = useState(null);
  const [nom_p, setnom_p] = useState("");
  const [asesores, setAsesores] = useState([]);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    cod_Prod: "",
    idAgen: parseInt(idagen)
  })

  const [filaSeleccionada, setfilaSeleccionada] = useState({
    id: "",
    estatus: "",
    descEstatus: "",
    comentarios: "",
    idAgen: ""
  })

  const seleccionarRegistro = (registro, opcion) => {
    setfilaSeleccionada(registro);
    (opcion === "Editar") ? abrirCerrarModalEditar()
      :
      abrirModalEliminar()
  }

  const handleChange = e => {
    let index = e.nativeEvent.target.selectedIndex;

    if (index !== undefined) {
      setDescEstatus(e.nativeEvent.target[index].text);
      console.log(descEstatus);
    }

    const { name, value } = e.target;
    setfilaSeleccionada(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleChangeNvo = e => {
    idagen = e.target.value;
    const { name, value } = e.target;
    setNuevoRegistro(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const peticionGet = async () => {
    await axios.get(url + `/${cookies.get('Id')}/${idagen}`)
      .then(res => {
        if (res.data.item1 !== null) {
          setSinEnviar(res.data.item1);
        }

        if (res.data.item2 !== null) {
          setEnviados(res.data.item2);
        }
      }).catch(error => {
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      })
  }

  useEffect(() => {
    if (cookies.get('Id') === '352') {
      setAdmin(true);
      idagen = 0;
    }
    else {
      if (cookies.get('IdAgen') === 'null') {
        idagen = 0;
      }
      else {
        idagen = cookies.get('IdAgen');
      }
      setAdmin(false);
    }
    peticionGet();
    /* setTimeout(peticionGet, 150000);   */
  }, [])

  const eliminar = async (id) => {
    var id_delete;

    if (id !== undefined) {
      id_delete = id;
    }
    else {
      id_delete = filaSeleccionada.id;
    }

    await axios.delete(url + "/" + id_delete)
      .then(response => {

        const arrFiltrado = sinEnviar.filter(item => item.id !== id_delete)
        setSinEnviar(arrFiltrado);

        const arrFiltrado2 = enviados.filter(item => item.id !== id_delete)
        setEnviados(arrFiltrado2);

        setModalEliminar(false);

      }).catch(error => {
        swal({
          title: error.response.data,
          text: "Favor de verificar la información",
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      })
  }

  const editar = (id) => {
    setmodoEdicion(true);
    setId(id);
  }

  const cancelar = () => {
    setmodoEdicion(false)
  }

  const guadar = async (id) => {
    filaSeleccionada.id = id;

    await axios.put(url + `/${id}`, filaSeleccionada)
      .then(response => {
        console.log(descEstatus);
        console.log(response.data);

        if (sinEnviar.length > 0) {
          console.log(sinEnviar);

          const arrayEditado = sinEnviar.map(item => (
            item.id === id ?
              {
                id: item.id,
                cod_Prod: item.cod_Prod,
                productor: item.productor,
                idAgen: item.idAgen,
                asesor: item.asesor,
                estatus: response.estatus,
                descEstatus: descEstatus,
                comentarios: response.data.comentarios,
                saldoFinal: item.saldoFinal,
                caja1: item.caja1,
                caja2: item.caja2,
              } : item
          ))
          setSinEnviar(arrayEditado);
        }

        const arrayEditado2 = enviados.map(item => (
          item.id === id ?
            {
              id: item.id,
              cod_Prod: item.cod_Prod,
              productor: item.productor,
              asesor: item.asesor,
              descEstatus: descEstatus !== null ? descEstatus : item.descEstatus,
              comentarios: filaSeleccionada.comentarios,
              saldoFinal: item.saldoFinal,
              caja1: item.caja1,
              caja2: item.caja2,
            } : item
        ))
        setEnviados(arrayEditado2);

        setmodoEdicion(false);
        setModalEditar(false);

      }).catch(error => {
        swal({
          title: "Algo salió mal",
          text: error.response.data,
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response);
        console.log(error.request);
        console.log(error.message);
      })
  }

  const CargarAsesor = function (e) {
    idagen = e.nativeEvent.target.selectedIndex;
    setAsesor(e.nativeEvent.target[idagen].text);
  }


  //cargar info
  const handlerCargarinfo = function (e) {
    /*  idagen=e.nativeEvent.target.selectedIndex;    
     setAsesor(e.nativeEvent.target[idagen].text);  */

    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/agentes" + `/${nuevoRegistro.cod_Prod}`)
      .then(res => {
        setAsesores(res.data);
        for (const dataObj of res.data) {
          setnom_p(dataObj.productor);
        }
      })
  }

  const enviar = e => {
    e.preventDefault();
    peticionPost();

  }

  const peticionPost = async () => {
    await axios.post(url, nuevoRegistro)
      .then(response => {

        try {
          setSinEnviar([
            ...sinEnviar,
            {
              id: response.data.id,
              cod_Prod: response.data.cod_Prod,
              productor: nom_p,
              idAgen: nuevoRegistro.idAgen,
              asesor: asesor,
              estatus: "",
              descEstatus: "",
              comentarios: "",
            }
          ])

        } catch (error) {
          console.log(error)
        }

        setAsesor(null);

      }).catch(error => {
        swal({
          title: error.response.data,
          text: "Favor de verificar la información",
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      })
  }

  const email = e => {
    e.preventDefault();
    setLoading(true);
    recipient = "Enviar a ingenieros";
    enviarEmail();
    /*  setTimeout(enviarEmail, 3000);          */
  }

  //Enviar a atención a productores 
  const emailAP = e => {
    e.preventDefault();
    setLoadingAP(true);
    recipient = "AP";
    setTimeout(enviarEmail, 3000);
  }

  //Guardar sin enviar correo
  const enviarSinCorreo = e => {
    e.preventDefault();
    setLoadingS(true);
    recipient = "Enviar sin correo";
    enviarEmail();
  }

  const enviarEmail = async () => {
    console.log(sinEnviar);

    await axios.patch(url + `/${recipient}`, sinEnviar)
      .then(response => {
        try {
          swal("Datos guardados correctamente!")
            .then((value) => {
              if (value === true) {
                for (let i = 0; i < response.data.length; i++) {
                  console.log(response.data[i].id);
                  const arrFiltrado = sinEnviar.filter(item => item.id !== response.data[i].id)
                  setSinEnviar(arrFiltrado);

                  setEnviados([
                    ...enviados,
                    {
                      id: response.data[i].id,
                      cod_Prod: response.data[i].cod_Prod,
                      productor: response.data[i].productor,
                      idAgen: response.data[i].idAgen,
                      asesor: response.data[i].asesor,
                      estatus: response.data[i].estatus,
                      descEstatus: response.data[i].descEstatus,
                      comentarios: response.data[i].comentarios,
                      saldoFinal: response.data[i].SaldoFinal,
                      caja1: response.data[i].caja1,
                      caja2: response.data[i].caja2
                    }
                  ])

                }
              }
            });
        } catch (error) {
          console.log(error)
        }

      }).catch(error => {
        swal({
          title: error.response.data,
          text: "Favor de verificar la información",
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      })
    setLoading(false);
    setLoadingAP(false);
    setLoadingS(false);
  }

  const reenviar = (id) => {
    setTimeout(reenviarEmail(id), 3000);
  }

  const reenviarEmail = async (id) => {
    swal({
      title: "¿Está seguro de reenviar estos datos?",
      text: "Once deleted, you will not be able to recover this imaginary file!" + id,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal("Datos enviados correctamente", {
            icon: "success",
          });
        } else {
          swal("Your imaginary file is safe!");
        }
      });
  }

  const abrirModalEliminar = () => {
    if (admin) {
      setModalEliminar(!modalEliminar);
    }
    else {
      swal({
        title: "¡No se puede borrar el registro!",
        icon: "warning",
        button: "Cerrar",
      });
    }
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  //cargar info
  const handlerCargarEstatus = function (e) {
    axios.get(url)
      .then(res => {
        setEstatusList(res.data);
      })
  }

  const bodyEditar = (
    <div className={styles.modal}>
      <h6>Editar Estatus</h6>
      Codigo:
      <input
        type="text" disabled
        className="form-control"
        id="cod_Prod" name="cod_Prod"
        value={filaSeleccionada && filaSeleccionada.cod_Prod}
      />
      <br />
      Estatus:
      <select name="estatus" className="form-control"
        onChange={handleChange} onClick={handlerCargarEstatus}>
        <option value={0} >Seleccione</option>
        {
          estatusList.map(item => (
            <option key={item.id} value={item.id} >{item.descEstatus}</option>
          )
          )}
      </select>
      <br />
      Comentarios
      <textarea
        className="form-control"
        rows="3"
        name="comentarios"
        value={filaSeleccionada && filaSeleccionada.comentarios}
        onChange={handleChange} />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => guadar(filaSeleccionada && filaSeleccionada.id)}>Guardar</Button>
        <Button onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el registro</p>
      <div align="right">
        <Button color="secondary" onClick={() => eliminar()}>Sí</Button>
        <Button onClick={() => abrirModalEliminar()}>No</Button>
      </div>
    </div>
  )

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}> </div>
        <section className="content font-weight-bold text-secondary">
          <Paper className={styles.paper}>
            <Typography
              variant="h6"
              id="tableTitle"
              component="div"
            >
              VALIDACIÓN DE ESTATUS DE FINANCIAMIENTO A PRODUCTORES
            </Typography>


            {admin ?
              <>
                <div className="card-body font-weight-bold text-secondary">
                  <form onSubmit={enviar}>
                    <div className="row">
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={2}>
                          Codigo:
                          <input
                            type="text" required
                            className="form-control" name="cod_Prod" maxLength={5} minLength={5} variant="outlined"
                            onChange={handleChangeNvo} onBlur={handlerCargarinfo} autoComplete="off"
                          />
                        </Grid>
                        <Grid item xs={12} md={12} lg={4}>
                          Nombre:
                          <input
                            type="text" disabled
                            className="form-control"
                            id="productor" name="productor"
                            value={nom_p}
                          />
                        </Grid>
                        <Grid item xs={12} md={12} lg={4}>
                          Asesor:
                          <select name="idAgen" id="idAgen" className="form-control"
                            onChange={handleChangeNvo} onClick={CargarAsesor}>
                            <option value={0}>Seleccione </option>
                            {
                              asesores.map(item => (
                                <option key={item.idAgen} value={item.idAgen}>{item.asesor}</option>
                              )
                              )}
                          </select>
                        </Grid>

                        <Grid item xs={12} md={12} lg={1}>
                          <button className="btn btn-primary btn-sm active float-right mt-4" type="submit"><i className="fas fa-plus"></i></button>
                        </Grid>
                      </Grid>
                    </div>
                  </form>
                </div>

                <div className="table-responsive table-condensed table-sm">
                  <table className="table table-hover table-sm table-striped"
                    style={{ fontSize: 11, textAlign: "center" }}>
                    <thead className="table-secondary">
                      <tr>
                      </tr><tr>
                        <th colSpan={6}></th>
                        <th className="table-primary" colSpan={2}>Cajas Entregadas</th>
                        <th colSpan={2}></th>
                      </tr>
                      <tr>
                        <th style={{ display: 'none' }}>Id</th>
                        <th>Codigo</th>
                        <th>Productor</th>
                        <th>Asesor</th>
                        <th>Estatus</th>
                        <th>Comentarios</th>
                        <th>Saldo Final</th>
                        <th className="table-primary">Semana 27-52</th>
                        <th className="table-primary">Semana 1-actual</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        sinEnviar.length === 0 ? (
                          <tr>
                            <td colSpan={11}>No hay datos</td>
                          </tr>
                        ) : (
                          sinEnviar.map(item => (
                            <tr key={item.id}>
                              <td style={{ display: 'none' }}>{item.id}</td>
                              <td>{item.cod_Prod}</td>
                              <td>{item.productor}</td>
                              <td>{item.asesor}</td>

                              {id === item.id && modoEdicion ? (
                                <>
                                  <td>
                                    <select name="estatus" className="form-control"
                                      onChange={handleChange} onClick={handlerCargarEstatus}>
                                      <option value={0} >Seleccione</option>
                                      {
                                        estatusList.map(item => (
                                          <option key={item.id} value={item.id} >{item.descEstatus}</option>
                                        )
                                        )}
                                    </select>
                                  </td>
                                  <td>
                                    <input type="text" className="form-control"
                                      name="comentarios"
                                      onChange={handleChange} />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>
                                    {item.descEstatus}
                                  </td>
                                  <td>{item.comentarios}</td>
                                </>
                              )
                              }

                              <td>{item.saldoFinal}</td>
                              <td>{item.caja1}</td>
                              <td>{item.caja2}</td>
                              {id === item.id && modoEdicion ? (
                                <>
                                  <td><button className="btn btn-primary btn-sm float-right mx-2" type="submit" onClick={() => guadar(item.id)}><i className="fas fa-save"></i></button></td>
                                  <td><button className="btn btn-secondary btn-sm float-right mx-2" type="submit" onClick={() => cancelar()}><i className="fas fa-ban"></i></button></td>
                                </>
                              ) : (
                                <>
                                  <td><button className="btn btn-warning btn-sm float-right" type="submit" onClick={() => editar(item.id)}><i className="fas fa-edit"></i></button></td>
                                  {admin ? (
                                    <>
                                      <td><button className="btn btn-danger btn-sm float-right mx-2" type="submit" onClick={() => eliminar(item.id)}><i className="fas fa-trash"></i></button></td>
                                    </>
                                  ) : (
                                    <>
                                      <td></td>
                                    </>
                                  )
                                  }
                                </>
                              )
                              }
                            </tr>
                          ))
                        )
                      }
                    </tbody>
                  </table>
                  <div>
                    <form onSubmit={email}>
                      <Button className="btn btn-primary btn-sm active float-right m-4" type="submit" endIcon={<EmailTwoToneIcon />}> {loading ? "Enviando..." : "Enviar"}</Button>
                    </form>
                    <form onSubmit={emailAP}>
                      <Button className="btn btn-danger btn-sm active float-right m-4" type="submit" endIcon={<EmailTwoToneIcon />}> {loadingAP ? "Enviando..." : "Ademir"} </Button>
                    </form>
                    <form onSubmit={enviarSinCorreo}>
                      <Button className="btn btn-success btn-sm active float-right m-4" type="submit" endIcon={<SaveTwoToneIcon />}> {loadingS ? "Guardando..." : "Guardar"} </Button>
                    </form>
                  </div>
                </div>
              </>
              :
              false
            }

            <div className="table-responsive table-condensed table-sm">
              <table className="table table-hover table-sm table-striped"
                style={{ fontSize: 11, textAlign: "center" }}>
                <thead className="table-secondary">
                  <tr>
                  </tr><tr>
                    <th colSpan={6}></th>
                    <th className="table-primary" colSpan={2}>Cajas Entregadas</th>
                    <th colSpan={1}></th>
                  </tr>
                  <tr>
                    <th style={{ display: 'none' }}>Id</th>
                    <th>Codigo</th>
                    <th>Productor</th>
                    <th>Asesor</th>
                    <th>Estatus</th>
                    <th>Comentarios</th>
                    <th>Saldo Final</th>
                    <th className="table-primary">Semana 27-52</th>
                    <th className="table-primary">Semana 1-actual</th>
                    {/*  <th>Editar</th> */}
                    {admin ?
                      <th>Borrar</th>
                      : null
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    enviados.length === 0 ? (
                      <tr>
                        <td colSpan={11}>No hay datos</td>
                      </tr>
                    ) : (
                      enviados.map(item => (
                        <tr key={item.id}>
                          <td style={{ display: 'none' }}>{item.id}</td>
                          <td>{item.cod_Prod}</td>
                          <td>{item.productor}</td>
                          <td>{item.asesor}</td>
                          <td>{item.descEstatus}</td>
                          <td>{item.comentarios}</td>
                          <td>{item.saldoFinal}</td>
                          <td>{item.caja1}</td>
                          <td>{item.caja2}</td>
                          {/*   <td><button className="btn btn-warning btn-sm float-right mx-2" type="submit"
                            onClick={(e, item) => seleccionarRegistro(item, "Editar")}><i className="fas fa-edit"></i></button>
                            </td>
 */}
                          {admin ?
                            <td><button className="btn btn-danger btn-sm float-right mx-2" type="submit"
                              onClick={() => eliminar(item.id)}>
                              <i className="fas fa-trash"></i></button></td>

                            : null
                          }

                        </tr>
                      ))
                    )
                  }
                </tbody>
              </table>

            </div>

            <Modal open={modalEliminar} onClose={abrirModalEliminar}>{bodyEliminar}</Modal>
            <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>{bodyEditar}</Modal>
          </Paper>
        </section>
      </div>
    </div>
  )
}
export default Financiamiento;