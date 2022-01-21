import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { makeStyles, Modal, Grid, Paper, Typography } from '@material-ui/core'
import Contenedor from '../Contenedor.jsx';
import swal from 'sweetalert';
import GetAppIcon from '@material-ui/icons/GetApp';
import ExportExcel from 'react-export-excel';
import { useDispatch, useSelector } from "react-redux";
import {
  getListZonasAction
} from "../../redux/Catalogos/ZonasD";
import {
  getListAnalisisAction
} from "../../redux/Analisis/AnalisisD";
import Loading from './../Loading.js';

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelColumn;

const useStyles = makeStyles((theme) => ({
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
    width: 800,
    padding: theme.spacing(2, 4, 3),
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

function searchData(search) {
  return function (item) {
    return (
      item.cod_Prod.toLowerCase().includes(search.toLowerCase()) ||
      item.descEstatus.toLowerCase().includes(search.toLowerCase())
    );
  };
}

const Resultados = () => {
  const styles = useStyles();
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/analisis";
  //const url="https://localhost:44344/api/analisis";
  var cod_Prod;
  const cookies = new Cookies();
  const dispatch = useDispatch();
  //const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [estatus, setEstatus] = useState(null);
  const [admin, setAdmin] = useState(false);
  //const [zonas, setzonas] = useState([]);
  const [codZona, setcodZona] = useState([null]);//cod de zonas
  const [liberacionUSA, setLiberacionUSA] = useState(0);
  const [liberacionEU, setLiberacionEU] = useState(0);
  const [filaSeleccionada, setfilaSeleccionada] = useState({});
  const [search, setSearch] = useState("");
  var idAnalisis;

  const [filaEditada, setfilaEditada] = useState({
    codZona: "",
    fecha_envio: "",
    fecha_entrega: "",
    estatus: "",
    laboratorio: "",
    comentarios: "",
    idAgen: parseInt(cookies.get('IdAgen')),
    liberacionUSA: "",
    liberacionEU: "",
    folio: "",
    traza: "",
    organico: "",
    parteMuestreada: ""
  })

  //  const zonas = useSelector((v) => v.zonas.arrayZonas);
  const data = useSelector((v) => v.analisis.arrayAnalisis);
  console.log(data);

  const getdata = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (cookies.get('Depto') !== 'null') {
        dispatch(getListAnalisisAction(cookies.get('IdAgen'), null, cookies.get('Depto'), 0, null));
      }
      else {
        dispatch(getListAnalisisAction(cookies.get('Id'), cookies.get('Tipo'), null, 0, null));
      }
    }, 3000)

    
  }

  const getPDF = async () => {
    axios({
      url: url + `/${idAnalisis}`,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Informe de Resultado de Analisis ' + cod_Prod + '.pdf');
      document.body.appendChild(link);
      link.click();

    }).catch(error => {

      if (error.message === "Request failed with status code 400") {
        swal({
          title: "No se encontró el archivo",
          icon: "warning",
          button: "Cerrar",
        });
      }

      console.log(error.response.data);
      console.log(error.request);
      console.log(error.message);
    })
  }

  useEffect(() => {
    if (cookies.get('IdAgen') === '205' || cookies.get('IdAgen') === '216') {
      setAdmin(true);
    }
    else {
      setAdmin(false);
    }
    getdata();
  })

  const cargarZonas = async () => {
    dispatch(getListZonasAction());
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setfilaEditada(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleChangeEstatus = e => {
    setEstatus(e.target.value);

    const { name, value } = e.target;
    setfilaEditada(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const abrirModalEliminar = () => {
    if (admin) {
      swal({
        title: "¿Está seguro de eliminar esta información?",
        icon: "info",
        buttons: ["No", "Si"],
      }).then((value) => {
        if (value) {
          borrar();
        }
      });

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
    if (admin) {
      setModalEditar(!modalEditar);
    }
    else {
      swal({
        title: "No disponible",
        icon: "warning",
        button: "Cerrar",
      });
    }
  }

  const seleccionarRegistro = (registro, opcion) => {
    setfilaSeleccionada(registro);
    idAnalisis = registro.id;
    cod_Prod = registro.cod_Prod;

    if (opcion === "Editar") {
      abrirCerrarModalEditar()
    }
    if (opcion === "Pdf") {
      if (cookies.get('IdAgen') === '205' || cookies.get('IdAgen') === '216') {
        getPDF();
      }
      else {
        swal({
          title: "No disponible",
          icon: "info",
          button: "ok",
        });
      }
    }
    else {
      abrirModalEliminar()
    }
  }

  const borrar = async () => {
    /*   await axios.delete(url+"/"+idAnalisis)
      .then(response=>{        
       
       const arrFiltrado=data.filter(item=> item.id!==filaSeleccionada.id)
       setData(arrFiltrado);
   
       swal({
         title: "Registro eliminado correctamente",
         icon: "success",
         button: "ok",
       });
       
       }).catch(error=>{
        swal({
          title: error.response.data,
          text: "Favor de verificar la información",
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message); 
      })   */
  }

  const editar = (e) => {
    e.preventDefault();
    setLoading(true);
    //guardar();
  }

  /*  const guardar = async () => {
     await axios.put(url + "/" + filaSeleccionada.id + "/" + liberacionUSA + "/" + liberacionEU, filaEditada)
       .then(response => {
         setModalEditar(false);
         var res_analisis, res_traza, res_organico;
 
         if (response.data.estatus === "L") {
           res_analisis = "LIBERADO";
         }
         if (response.data.estatus === "R") {
           res_analisis = "CON RESIDUOS";
         }
         if (response.data.estatus === "P") {
           res_analisis = "EN PROCESO";
         }
         if (response.data.estatus === "F") {
           res_analisis = "FUERA DE LIMITE";
         }
         if (response.data.traza === "1") {
           res_traza = "SI";
         }
         else {
           res_traza = "";
         }
         if (response.data.organico === "1") {
           res_organico = "SI";
         }
         else {
           res_organico = "";
         }
 
         const arrayEditado = data.map(item => (
           item.id === filaSeleccionada.id ?
             {
               id: filaSeleccionada.id,
               cod_Prod: filaSeleccionada.cod_Prod,
               cod_Campo: filaSeleccionada.cod_Campo,
               sector: item.sector,
               productor: item.productor,
               tipo: item.tipo,
               producto: item.producto,
               zona: item.zona,
               fecha_envio: filaSeleccionada.fecha_envio,
               fecha_entrega: filaSeleccionada.fecha_entrega,
               descEstatus: res_analisis,
               num_analisis: item.num_analisis,
               laboratorio: filaSeleccionada.laboratorio,
               liberacionUSA: response.data.liberacionUSA,
               liberacionEU: response.data.liberacionEU,
               parteMuestreada: response.data.parteMuestreada,
               comentarios: filaSeleccionada.comentarios,
               traza: res_traza,
               organico: res_organico,
               fecha: response.data.fecha,
               temporada: item.temporada,
 
             } : item
         ))
         setData(arrayEditado);
 
         swal({
           title: "Datos actualizados correctamente",
           icon: "success",
           button: "ok",
         });
 
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
     setLoading(false);
   }
  */

  const bodyEditar = (
    <div className={styles.modal}>
      <div className="row">
        <form onSubmit={editar}>
          <div className="modal-header">
            <h6>Modificar registro</h6>
          </div>
          <div className="modal-body">

            <div className="row">
              <div className="col-md-6">
                <div className="form-group-sm">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={4}>
                      Codigo:
                      <input
                        type="text" disabled
                        className="form-control" name="cod_Prod"
                        value={filaSeleccionada && filaSeleccionada.cod_Prod}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      Campo:
                      <input
                        type="text" disabled
                        className="form-control" name="cod_Campo"
                        value={filaSeleccionada && filaSeleccionada.cod_Campo}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      Sector (es):
                      <input
                        type="text" disabled
                        className="form-control"
                        name="sector"
                        value={filaSeleccionada && filaSeleccionada.sector}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      Cultivo:
                      <input
                        type="text" disabled
                        className="form-control"
                        name="tipo"
                        value={filaSeleccionada && filaSeleccionada.tipo}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      Variedad:
                      <input
                        type="text" disabled
                        className="form-control"
                        name="producto"
                        value={filaSeleccionada && filaSeleccionada.producto}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      Folio:
                      <input
                        type="text" className={styles.input}
                        className="form-control"
                        name="folio"
                        onChange={handleChange} autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      Zona:
                      {/*  <select name="codZona" className="form-control" onChange={handleChange} onClick={cargarZonas}>
                        <option value={0}>Seleccione</option>
                        {
                          zonas.map(item => (
                            <option key={item.codigo} value={item.codigo}>{item.descZona}</option>
                          )
                          )}
                      </select> */}
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      Fecha de envio:
                      <input
                        type="date"
                        className="form-control"
                        name="fecha_envio"
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      Fecha de entrega:
                      <input
                        type="date"
                        className="form-control"
                        name="fecha_entrega"
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-sm">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={6}>
                      Estatus:
                      <select name="estatus" className="form-control" onChange={handleChangeEstatus}>
                        <option value={0}>Seleccione</option>
                        <option value={'R'}>CON RESIDUOS</option>
                        <option value={'P'}>EN PROCESO</option>
                        <option value={'F'}>FUERA DE LIMITE</option>
                        <option value={'L'}>LIBERADO</option>
                      </select>
                    </Grid>

                    <Grid item xs={12} md={12} lg={6}>
                      Laboratorio:
                      <select name="laboratorio" className="form-control" onChange={handleChange}>
                        <option value={0}>Seleccione</option>
                        <option value={'AGQ'}>AGQ</option>
                        <option value={'AGROLAB'}>AGROLAB</option>
                        <option value={'PRIMUSLAB'}>PRIMUSLAB</option>
                      </select>
                    </Grid>

                    {estatus === "F" &&
                      <>
                        <Grid item xs={12} md={12} lg={12}>
                          <Grid container spacing={3}>
                            <Grid item xs={6} md={6} lg={6}>
                              Liberación USA (dias):
                              <input type="text" autoComplete="off"
                                className="form-control" name="liberacionUSA" value={liberacionUSA} onChange={e => setLiberacionUSA(e.target.value)}
                              />
                            </Grid>

                            <Grid item xs={6} md={6} lg={6}>
                              Liberación EU (dias):
                              <input type="text" autoComplete="off"
                                className="form-control" name="liberacionEU" value={liberacionEU} onChange={e => setLiberacionEU(e.target.value)}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    }

                    <Grid item xs={12} md={12} lg={6}>
                      Parte Muestreada:
                      <select name="parteMuestreada" className="form-control" onChange={handleChange}
                      >
                        <option value={0}>Seleccione</option>
                        <option value={'J'}>FOLLAJE</option>
                        <option value={'F'}>FRUTA</option>
                        <option value={'S'}>SUELO</option>
                      </select>
                    </Grid>

                    <Grid item xs={12} md={12} lg={6}>
                      Número de análisis:
                      <input
                        type="text" disabled
                        className="form-control"
                        name="num_analisis"
                        autoComplete="off"
                        value={filaSeleccionada && filaSeleccionada.num_analisis}
                      />
                    </Grid>

                    <Grid item xs={12} md={12} lg={6}>
                      <input type="checkbox" name="traza"
                        defaultChecked={false} className="mt-4"
                        onChange={handleChange}
                      /> Traza
                    </Grid>

                    <Grid item xs={12} md={12} lg={6}>
                      <input type="checkbox" name="organico"
                        defaultChecked={false} className="mt-4"
                        onChange={handleChange}
                      /> Organico
                    </Grid>

                    <Grid item xs={12} md={12} lg={12}>
                      Comentarios:
                      <textarea
                        className="form-control"
                        id="comentarios"
                        rows="3"
                        name="comentarios"
                        onChange={handleChange} autoComplete="off"
                      />
                    </Grid>

                  </Grid>
                </div>
              </div>
            </div>

          </div>
          <div className="modal-footer">
            <button disabled={loading ? true : false}
              className="btn btn-primary active float-right" type="submit">
              {loading ? "Espere..." : "Guardar"}</button>
            <button className="btn btn-secondary active float-right" onClick={() => abrirCerrarModalEditar()}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}></div>
        

        <section className="content font-weight-bold text-secondary">
          <Paper className={styles.paper}>
            <Typography
              variant="h6"
              id="tableTitle"
              component="div"
            >
              RESULTADOS DE ANÁLISIS DE RESIDUOS DE PLAGUICIDAS
            </Typography>

            <div className="row mt-2">
              <div className="col-12">
                <Grid item xs={12} md={12} lg={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={2}>
                      <ExcelFile element={<button className="btn btn-success" type="submit">
                        <GetAppIcon /> Exportar a Excel</button>} filename="ANALISIS DE RESIDUOS DE PLAGUICIDAS">
                        <ExcelSheet data={data} name="ANALISIS DE RESIDUOS DE PLAGUICIDAS">
                          <ExcelColumn label="Código" value="cod_Prod" />
                          <ExcelColumn label="Campo" value="cod_Campo" />
                          <ExcelColumn label="Sector" value="sector" />
                          <ExcelColumn label="Productor" value="productor" />
                          <ExcelColumn label="Tipo" value="tipo" />
                          <ExcelColumn label="Producto" value="producto" />
                          <ExcelColumn label="Zona" value="zona" />
                          <ExcelColumn label="Fecha/envío" value="fecha_envio" />
                          <ExcelColumn label="Fecha/entrega" value="fecha_entrega" />
                          <ExcelColumn label="Estatus" value="descEstatus" />
                          <ExcelColumn label="Num/análisis" value="num_analisis" />
                          <ExcelColumn label="Laboratorio" value="laboratorio" />
                          <ExcelColumn label="LiberaciónUSA" value="liberacionUSA" />
                          <ExcelColumn label="LiberaciónEU" value="liberacionEU" />
                          <ExcelColumn label="Parte/Muestreada" value="parteMuestreada" />
                          <ExcelColumn label="Comentarios" value="comentarios" />
                          <ExcelColumn label="Traza" value="traza" />
                          <ExcelColumn label="Orgánico" value="organico" />
                          <ExcelColumn label="Fecha" value="fecha" />
                          <ExcelColumn label="Temporada" value="temporada" />
                        </ExcelSheet>
                      </ExcelFile>
                    </Grid>

                    <Grid item xs={12} md={6} lg={10}>
                      <input
                        type="text"
                        placeholder="Buscar código o estatus..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control mb-2"
                        name="searchText"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </div>

              <div className="col-12 mt-2">
                <div className="table-responsive table-condensed table-sm">
                  {data.length > 0 ? (
                    <table
                      className="table table-hover table-sm table-striped"
                      style={{ fontSize: 11, textAlign: "center" }}
                    >
                      <thead className="table-primary">
                        <tr>
                          <th>Código</th>
                          <th>Campo</th>
                          <th>Sector(es)</th>
                          <th>Tipo</th>
                          <th>Producto</th>
                          <th>Zona</th>
                          <th>Fecha/envío</th>
                          <th>Fecha/entrega</th>
                          <th>Estatus</th>
                          <th>Num/análisis</th>
                          <th>Laboratorio</th>
                          <th>LiberaciónUSA</th>
                          <th>LiberaciónEU</th>
                          <th>ParteMuestreada</th>
                          <th>Comentarios</th>
                          <th>Traza</th>
                          <th>Orgánico</th>
                          <th>Fecha</th>
                          <th>Temporada</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.filter(searchData(search)).map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.cod_Prod}</td>
                            <td>{item.cod_Campo}</td>
                            <td>{item.sector}</td>
                            <td>{item.tipo}</td>
                            <td>{item.producto}</td>
                            <td>{item.zona}</td>
                            <td>{item.fecha_envio}</td>
                            <td>{item.fecha_entrega}</td>
                            {item.descEstatus === "LIBERADO" ?
                              <>
                                <td align="center" bgcolor="LightGreen">{item.descEstatus}</td>
                              </>
                              :
                              <>
                                {item.descEstatus === "FUERA DEL LIMITE" ?
                                  <>
                                    <td align="center" bgcolor="yellow">{item.descEstatus}</td>
                                  </>
                                  :
                                  <>
                                    {item.descEstatus === "CON RESIDUOS" ?
                                      <>
                                        <td align="center" bgcolor="red">{item.descEstatus}</td>
                                      </>
                                      :
                                      <>
                                        {item.descEstatus === "EN PROCESO" ?
                                          <>
                                            <td align="center" bgcolor="Gainsboro">{item.descEstatus}</td>
                                          </>
                                          : null}
                                      </>
                                    }
                                  </>
                                }
                              </>
                            }
                            <td>{item.num_analisis}</td>
                            <td>{item.laboratorio}</td>
                            <td>{item.liberacionUSA}</td>
                            <td>{item.liberacionEU}</td>
                            <td>{item.parteMuestreada}</td>
                            <td>{item.comentarios}</td>
                            <td>{item.traza}</td>
                            <td>{item.organico}</td>
                            <td>{item.fecha}</td>
                            <td>{item.temporada}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <>                     
                    </>
                  )}
                </div>
              </div>
            </div>
          </Paper>
          <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>{bodyEditar}</Modal>

        </section>
      </div>
    </div>
  )
}
export default Resultados;