import React, { useEffect, useState } from "react";
import Contenedor from "../Contenedor.jsx";
import axios from "axios";
import Cookies from "universal-cookie";
import { Modal, Grid, Button, Tabs, Tab, Box, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";
import { withRouter, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getListZonasAction } from "../../redux/Catalogos/ZonasD";
import { getListAuditoriasAction } from "../../redux/Auditoria/AuditoriaD";
import DoneIcon from "@material-ui/icons/Done";
import moment from "moment";
import "../../css/index.css";
import "../../css/Table.css";
import { getListAsesoresAction } from "../../redux/Catalogos/AgentesD";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%-50%)",
  },
  icons: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
  ocultar: {
    display: "none",
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
    textAlign: "center",
  }
}));

function searchData(search) {
  return function (item) {
    return (
      item.cod_Prod.toLowerCase().includes(search.toLowerCase()) ||
      item.productor.toLowerCase().includes(search.toLowerCase()) ||
      item.asesor.toLowerCase().includes(search.toLowerCase()) ||
      item.zona.toLowerCase().includes(search.toLowerCase())
    );
  };
}

const Nueva = (props) => {
  const styles = useStyles();
  const url_auditoria = "https://giddingsfruit.mx/ApiIndicadores/api/auditoria";
  const url_campos = "https://giddingsfruit.mx/ApiIndicadores/api/campos";
  const url_reporte = "https://giddingsfruit.mx/ApiIndicadores/api/reportes";

  //const url_reporte = "https://localhost:44344/api/reportes";
  //const url = "https://localhost:44344/api/auditoria";

  var cod_Campo;
  const [search, setSearch] = useState("");
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const zonas = useSelector((v) => v.zonas.arrayZonas);

  const auditorias = useSelector((v) => v.auditoria.arrayAuditorias);
  const asesores = useSelector((v) => v.agentes.arrayAsesores);
  const [value, setValue] = React.useState("2");

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const [nom_p, setNom_p] = useState("");
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [auditoria, setAuditoria] = useState({
    idAgen: parseInt(cookies.get("IdAgen")),
    cod_Prod: "",
    idZona: parseInt(),
    idNorma: parseInt(),
  });

  const handleChange = (e) => {
    cod_Campo = e.target.value;
    console.log(cod_Campo);

    const { name, value } = e.target;
    setAuditoria((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const guardar = async (e) => {
    e.preventDefault();

    swal({
      title: "¿Está seguro de continuar?",
      icon: "info",
      buttons: ["No", "Si"],
    }).then((value) => {
      if (value) {
        peticionPost();
      }
    });
  };

  const peticionPost = async () => {
    setLoading(true);

    await axios
      .post(url_auditoria, auditoria)
      .then((response) => {
        console.log(response.data.id);
        props.history.push(`auditoria/${response.data.id}`);
      })
      .catch((error) => {
        swal({
          title: "error",
          text: error.request.response,
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      });
    setLoading(false);
  };

  useEffect(() => {
    //HMTORRES || GXICOHTENCATL
    if (cookies.get("IdAgen") === "281" || cookies.get("IdAgen") === "326" || cookies.get("IdAgen") === "204" || cookies.get("IdAgen") === "298" || cookies.get("IdAgen") === "322") {
      setAdmin(true);
      dispatch(getListAsesoresAction('I'));

    } else {
      setAdmin(false);
    }

    dispatch(getListZonasAction());
    dispatch(getListAuditoriasAction(cookies.get("IdAgen"), 0));
  }, []);

  const downloadExcelCompleto = async (idProdAuditoria) => {
    axios({
      url: url_reporte + `/${cookies.get("IdAgen")}/${idProdAuditoria}/todo`,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte de Acciones Correctivas ' + idProdAuditoria + '.xlsx');
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

  const downloadExcel = async (idProdAuditoria) => {
    axios({
      url: url_reporte + `/${cookies.get("IdAgen")}/${idProdAuditoria}/excel`,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte de Acciones Correctivas ' + idProdAuditoria + '.xlsx');
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

  const downloadWord = async (idProdAuditoria) => {
    axios({
      url: url_reporte + `/${cookies.get("IdAgen")}/${idProdAuditoria}/word`,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte de Acciones Correctivas ' + idProdAuditoria + '.docx');
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

  const cargarInfo = function () {
    axios.get(url_campos + `/${auditoria.cod_Prod}/${0}`).then((res) => {
      for (const dataObj of res.data) {
        setNom_p(dataObj.productor);
      }
    });
  };

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}> </div>
        <section className="content">

          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChangeTab}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="1" label="Nueva" />
              <Tab value="2" label="Todas" />
            </Tabs>
          </Box>

          {value === "1" ? (
            <>
              <Paper className={styles.paper}>
                <form onSubmit={guardar}>
                  <div className="card-header">
                    <h6 className="font-weight-bold text-secondary">
                      AUDITORÍA INTERNA GFSI
                    </h6>
                  </div>
                  <div className="card-body font-weight-bold text-secondary">
                    <div className="row d-flex justify-content-center">
                      <div className="col-lg-8 col-md-12 col-sm-12">
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={12} lg={4}>
                            Codigo:
                            <input
                              type="text"
                              required
                              onBlur={cargarInfo}
                              className="form-control"
                              name="cod_Prod"
                              maxLength={5}
                              minLength={5}
                              variant="outlined"
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </Grid>

                          <Grid item xs={12} md={12} lg={8}>
                            Nombre:
                            <input
                              type="text"
                              disabled
                              className="form-control"
                              name="productor"
                              value={nom_p}
                            />
                          </Grid>

                          <Grid item xs={12} md={12} lg={6}>
                            Zona:
                            <select
                              name="idZona" required
                              className="form-control"
                              onChange={handleChange}
                            >
                              <option value={0}> - Seleccione - </option>
                              {zonas.map((item) => (
                                <option key={item.idZona} value={item.idZona}>
                                  {item.descZona}
                                </option>
                              ))}
                            </select>
                          </Grid>
                          <Grid item xs={12} md={12} lg={6}>
                            Norma:
                            <select
                              name="idNorma" required
                              className="form-control"
                              onChange={handleChange}
                            >
                              <option value={0}> - Seleccione - </option>
                              <option value={1}>AUDITORIA INTERNA GFSI</option>
                            </select>
                          </Grid>
                        </Grid>
                      </div>

                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      disabled={loading ? true : false}
                      className="btn btn-primary active float-right"
                      type="submit"
                    >
                      {loading ? "Espere..." : "Continuar"}
                    </button>
                  </div>
                </form>
              </Paper>
            </>
          ) : null}

          {value === "2" ? (
            <>
              <Paper className={styles.paper}>
                <div className="card-header">
                  <h6 className="font-weight-bold text-secondary">
                    Auditorías creadas
                  </h6>
                </div>
                <div className="row mt-2">
                  {admin ?
                    <>
                      <div className="col-lg-6 col-md12 col-sm-12">
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={12} lg={7}>
                            Auditores:
                            <select
                              name="idAgen"
                              className="form-control"
                              onChange={(e) => setSearch(e.target.value)}
                            >
                              <option value={0}>Seleccione</option>
                              {asesores.map((item) => (
                                <option key={item.idAgen} value={item.asesor}>
                                  {item.asesor}
                                </option>
                              ))}
                            </select>
                          </Grid>

                          <Grid item xs={12} md={12} lg={5}>
                            Zona:
                            <select
                              name="idZona"
                              className="form-control"
                              onChange={(e) => setSearch(e.target.value)}
                            >
                              <option value={0}>Seleccione una zona</option>
                              {zonas.map((item) => (
                                <option key={item.idZona} value={item.descZona}>
                                  {item.descZona}
                                </option>
                              ))}
                            </select>
                          </Grid>
                        </Grid>
                      </div>
                    </>
                    :
                    null
                  }
                  <div className="col-lg-6 col-md12 col-sm-12">
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6} lg={12}>
                        <input
                          type="text"
                          placeholder="Buscar código..."
                          onChange={(e) => setSearch(e.target.value)}
                          className="form-control mt-3"
                          name="searchText"
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className="col-12">
                    <div className="table-auditorias mt-2 table-responsive table-condensed table-sm tabla">
                      {auditorias.length > 0 ? (
                        <table
                          className="table table-hover table-sm table-striped"
                          style={{ fontSize: 11 }}>
                          <thead>
                            <tr className="table-secondary">
                              {admin ?
                                <>
                                  <th colSpan={8}></th>
                                </>
                                :
                                <th colSpan={5}></th>
                              }
                              <th colSpan={3}>Descargar Reportes</th>
                            </tr>
                            <tr className="table-primary">
                              {admin ?
                                <>
                                  <th>Zona</th>
                                  <th>Auditor</th>
                                </>
                                :
                                null
                              }
                              <th>Cod_Prod</th>
                              <th>Productor</th>
                              <th>Campo(s)</th>
                              <th>Fecha</th>
                              <th>Auditoría terminada</th>
                              <th>Continuar</th>
                              <th>Acciones Correctivas</th>
                              <th>Reporte completo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {auditorias.filter(searchData(search)).map((item) => (
                              <React.Fragment key={item.id}>
                                <tr>
                                  {admin ?
                                    <>
                                      <td>{item.zona}</td>
                                      <td>{item.asesor}</td>
                                    </>
                                    :
                                    null
                                  }
                                  <td>{item.cod_Prod}</td>
                                  <td>{item.productor}</td>
                                  <td>{item.cod_Campo}</td>
                                  <td>{moment(item.fecha).format("L")}</td>
                                  {item.finalizada === null ?
                                    <>
                                      {item.dias !== null ?
                                        <>
                                          {item.dias >= 28 ?
                                            <td bgcolor="tomato">
                                              Tiempo terminado para subir acciones correctivas
                                            </td>
                                            :
                                            <>
                                              {item.dias < 28 && item.dias >= 20 ?
                                                <td bgcolor="pink">
                                                  Quedan {28 - item.dias} dias para subir acciones correctivas
                                                </td>
                                                :
                                                <>
                                                  {item.dias < 20 && item.dias >= 10 ?
                                                    <td bgcolor="yellow">
                                                      Quedan {28 - item.dias} dias para subir acciones correctivas
                                                    </td>
                                                    :
                                                    <>
                                                      {item.dias < 10 && item.dias >= 0 ?
                                                        <td bgcolor="LightGreen">
                                                          Quedan {28 - item.dias} dias para subir acciones correctivas
                                                        </td>
                                                        :
                                                        <>
                                                          <td>
                                                          </td>
                                                        </>
                                                      }
                                                    </>
                                                  }
                                                </>
                                              }
                                            </>
                                          }
                                        </>
                                        :
                                        <td>
                                        </td>
                                      }
                                    </>
                                    :
                                    <>
                                      <td bgcolor="LightGreen">
                                        <DoneIcon />
                                      </td>
                                    </>
                                  }
                                  <td>
                                    <Link
                                      to={`/auditoria/${item.id}`}
                                      className="btn btn-warning btn-sm"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </Link>
                                  </td>
                                  <td>
                                    <button className="btn btn-primary btn-sm mr-2" type="submit"
                                      onClick={() => downloadWord(item.id)}
                                    ><i className="fas fa-file-word"></i></button>

                                    <button className="btn btn-success btn-sm" type="submit"
                                      onClick={() => downloadExcel(item.id)}
                                    ><i className="fas fa-file-excel"></i></button>
                                  </td>
                                  <td>
                                    <button className="btn btn-success btn-sm" type="submit"
                                      onClick={() => downloadExcelCompleto(item.id)}
                                    ><i className="fas fa-file-excel"></i></button>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <>
                          <div className="alert alert-danger" role="alert">
                            No hay datos
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Paper>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default withRouter(Nueva);
