import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Contenedor from "../Contenedor.jsx";
import { makeStyles, Grid, Tabs, Tab, Box, Paper, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  getListVisitasAction
} from "../../redux/Visitas/VisitasD";

import {
  getListAsesoresAction
} from "../../redux/Catalogos/AgentesD";

import {
  getListRegionesAction
} from "../../redux/Catalogos/RegionesD";

import {
  getListZonasAction
} from "../../redux/Catalogos/ZonasD";
import '../../css/index.css';
import '../../css/Visitas.css';
import Loading from './../Loading.js';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
    textAlign: "center",
  }
}));

function searchDataT(search) {
  return function (item) {
    return (
      item.region.toLowerCase().includes(search.toLowerCase()) ||
      item.zona.toLowerCase().includes(search.toLowerCase())
    );
  };
}

function searchDataM(search) {
  console.log(search)
  return function (item) {
    return (
      item.noMes.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
      item.asesor.toLowerCase().includes(search.toLowerCase())
    );
  };
}

const Visitas = () => {
  const styles = useStyles();

  const cookies = new Cookies();
  const dispatch = useDispatch();

  let auxtotales = [],
    auxmeses = [];

  const [adminP, setAdminP] = useState(false);
  const [adminC, setAdminC] = useState(false);

  const [asesorP, setAsesorP] = useState(false);
  const [asesorC, setAsesorC] = useState(false);

  const [search, setSearch] = useState("");
  const [searchM, setSearchM] = useState("");

  const visitas = useSelector((v) => v.visitas.arrayVisitas);

  const regiones = useSelector((v) => v.regiones.arrayRegiones);
  const zonas = useSelector((v) => v.zonas.arrayZonas);
  const asesores = useSelector((v) => v.agentes.arrayAsesores);
  const [loading, setLoading] = useState(false);

  const chart_data = {
    labels: auxmeses,
    datasets: [
      {
        label: "Visitas",
        data: auxtotales,
        lineTension: 0,
        fill: false,
        borderColor: "rgba(222, 27, 27)",
        backgroundColor: "rgba(222, 27, 27)",
        pointBorderColor: "rgba(222, 27, 27)",
        pointBackgroundColor: "rgba(234, 237, 24)",
        pointRadius: 5,
        pointHoverRadius: 10,
        pointHitRadius: 30,
        pointBorderWidth: 2,
        pointStyle: "rectRounded",
      },
    ],
  };

  const [value, setValue] = React.useState("1");

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const borrarFiltros = () => {
    window.location.reload();
  };

  const getData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000)
    dispatch(getListVisitasAction(cookies.get("IdAgen")));
  };

  useEffect(() => {
    if (cookies.get("IdAgen") === "50" || cookies.get("IdAgen") === "1" || cookies.get("IdAgen") === "196" || cookies.get("IdAgen") === "2" || cookies.get("IdAgen") === "115" || cookies.get("IdAgen") === "2" || cookies.get("IdAgen") === "259") {
      if (cookies.get("Depto") === "P" || cookies.get("IdAgen") === "50") 
      {
        setAdminP(true);
        dispatch(getListAsesoresAction("P"));
      }
      else if (cookies.get("Depto") === "C") {
        setAdminC(true);
        dispatch(getListAsesoresAction("C"));
      }

      dispatch(getListRegionesAction());
      dispatch(getListZonasAction());
    }

    else {
      if (cookies.get("Depto") === "P") {
        setAdminP(false);
        setAdminC(false);
        setAsesorP(true);
        setAsesorC(false);
      }
      else if (cookies.get("Depto") === "C") {
        setAdminP(false);
        setAdminC(false);
        setAsesorP(false);
        setAsesorC(true);
      }
    }
    getData();
  }, []);

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}></div>
        {loading ?
          <Loading />
          :
          <>
            <section className="content font-weight-bold text-secondary">
              <Typography
                variant="h6"
                id="tableTitle"
                component="div"
              > REPORTE DE VISITAS A PRODUCTORES
              </Typography>

              {/* Produccion */}
              {adminP ? (
                <>
                  <Box sx={{ width: "100%" }}>
                    <Tabs
                      value={value}
                      onChange={handleChangeTab}
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="secondary tabs example"
                    >
                      <Tab value="1" label="Todas" />
                      <Tab value="2" label="Detalle por Mes" />
                    </Tabs>
                  </Box>
                  {visitas.length != 0 ?
                    <>
                      {value === "1" ?
                        <>
                          <Paper className={styles.paper}>
                            <div className="row mt-2">
                              <div className="col-12">
                                <Grid container spacing={1}>
                                  <Grid item xs={12} md={12} lg={3}>
                                    Región:
                                    <select
                                      name="idRegion"
                                      className="form-control"
                                      onChange={(e) => setSearch(e.target.value)}
                                    >
                                      <option value={0}>--Seleccione--</option>
                                      {regiones.map((item) => (
                                        <option key={item.codZona} value={item.descripcion}>
                                          {item.descripcion}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>

                                  <Grid item xs={12} md={12} lg={3}>
                                    Zona:
                                    <select
                                      name="idZona"
                                      className="form-control"
                                      onChange={(e) => setSearch(e.target.value)}
                                    >
                                      <option value={0}>--Seleccione--</option>
                                      {zonas.map((item) => (
                                        <option key={item.idZona} value={item.descZona}>
                                          {item.descZona}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>

                                  <Grid item xs={12} md={12} lg={6}>
                                    <button
                                      className="btn btn-sm btn-danger shadow-lg mt-4"
                                      type="submit"
                                      onClick={() => borrarFiltros()}
                                    >
                                      Borrar filtros
                                    </button>
                                  </Grid>

                                </Grid>
                              </div>
                              <div className="col-12">                                
                                  <>
                                    <div className="mt-2 table-responsive table-condensed table-sm tabla">
                                      {visitas.item1.length > 0 ? (
                                        <table
                                          className="table-totales table-hover table-sm table-striped"
                                          style={{ fontSize: 11 }}
                                        >
                                          <thead className="table-secondary">
                                            <tr>
                                              <th colSpan={8}></th>
                                              <th className="table-primary" colSpan={3}>Promedio (hrs)</th>
                                            </tr>
                                            <tr>
                                              <th>Region</th>
                                              <th>Zona</th>
                                              <th>Asesor</th>
                                              <th>Total Campos</th>
                                              <th>Campos Visitados</th>
                                              <th className="eficiencia"></th>
                                              <th className="efectividad"></th>
                                              <th>Promedio</th>
                                              <th className="table-primary">Primer_visita</th>
                                              <th className="table-primary">Ultima_visita</th>
                                              <th className="table-primary">VisitasDiarias</th>
                                            </tr>
                                          </thead>
                                          <tbody style={{ backgroundColor: "white" }}>
                                            {visitas.item1.filter(searchDataT(search)).map((item) => (
                                              <React.Fragment key={item.mes}>
                                                <tr>
                                                  <th>{item.region}</th>
                                                  <th>{item.zona}</th>
                                                  <td>{item.asesor}</td>
                                                  <td>{item.totalCampos}</td>
                                                  <td>{item.totalCamposVisit}</td>
                                                  <td>{item.eficiencia}</td>
                                                  <td>{item.efectividad}</td>
                                                  <td>{item.promedio}</td>
                                                  <td>{item.primer_visita}</td>
                                                  <td>{item.ultima_visita}</td>
                                                  <td>{item.visitasDiarias !== null ?
                                                    item.visitasDiarias + ' Hrs'
                                                    :
                                                    null
                                                  }
                                                  </td>
                                                </tr>
                                              </React.Fragment>
                                            ))}
                                          </tbody>
                                        </table>
                                      ) : (
                                        <>
                                          {/*  <div className="alert alert-danger" role="alert">
                                        No hay datos
                                      </div> */}
                                        </>
                                      )}
                                    </div>
                                  </>                                 
                              </div>
                            </div>
                          </Paper>
                        </>
                        : null
                      }


                      {value === "2" ?
                        <>
                          <Paper className={styles.paper}>
                            <div className="row mt-2">
                              <div className="col-12">
                                <Grid container spacing={1}>
                                  <Grid item xs={12} md={12} lg={3}>
                                    Mes:
                                    <select
                                      name="mes"
                                      className="form-control"
                                      onChange={(e) => setSearchM(e.target.value)}
                                    >
                                      <option value={""}> - Seleccione - </option>
                                      <option value={"7"}>JULIO</option>
                                      <option value={"8"}>AGOSTO</option>
                                      <option value={"9"}>SEPTIEMBRE</option>
                                      <option value={"10"}>OCTUBRE</option>
                                      <option value={"11"}>NOVIEMBRE</option>
                                      <option value={"12"}>DICIEMBRE</option>
                                      <option value={"1"}>ENERO</option>
                                      <option value={"2"}>FEBRERO</option>
                                      <option value={"3"}>MARZO</option>
                                      <option value={"4"}>ABRIL</option>
                                      <option value={"5"}>MAYO</option>
                                      <option value={"6"}>JUNIO</option>
                                    </select>
                                  </Grid>

                                  <Grid item xs={12} md={12} lg={4}>
                                    Asesores:
                                    <select
                                      name="idAgen"
                                      className="form-control"
                                      onChange={(e) => setSearchM(e.target.value)}
                                    >
                                      <option value={0}>--Seleccione--</option>
                                      {asesores.map((item) => (
                                        <option key={item.idAgen} value={item.asesor}>
                                          {item.asesor}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>
                                </Grid>
                              </div>

                              <div className="col-12">
                                <div className="mt-2 table-responsive table-condensed table-sm tabla">
                                  {visitas.item2.length > 0 ? (
                                    <table
                                      className="table-mes table-hover table-sm table-striped"
                                      style={{ fontSize: 11, textAlign: "center" }}
                                    >
                                      <thead className="table-secondary">
                                        <tr>
                                          <th colSpan={9}></th>
                                          <th className="table-primary" colSpan={3}>Promedio (hrs)</th>
                                        </tr>
                                        <tr>
                                          <th>Mes</th>
                                          <th>Region</th>
                                          <th>Zona</th>
                                          <th>Asesor</th>
                                          <th>Total Campos</th>
                                          <th>Campos Visitados</th>
                                          <th className="eficiencia"></th>
                                          <th className="efectividad"></th>
                                          <th>Promedio</th>
                                          <th className="table-primary">Primer_visita</th>
                                          <th className="table-primary">Ultima_visita</th>
                                          <th className="table-primary">VisitasDiarias</th>
                                        </tr>
                                      </thead>
                                      <tbody style={{ backgroundColor: "white" }}>
                                        {visitas.item2.filter(searchDataM(searchM)).map((item, index) => (
                                          <React.Fragment key={item.index}>
                                            <tr>
                                              <th>{item.mes}</th>
                                              <th>{item.region}</th>
                                              <th>{item.zona}</th>
                                              <td>{item.asesor}</td>
                                              <td>{item.totalCampos}</td>
                                              <td>{item.totalCamposVisit}</td>
                                              <td>{item.eficiencia}</td>
                                              <td>{item.efectividad}</td>
                                              <td>{item.promedio}</td>
                                              <td>{item.primer_visita}</td>
                                              <td>{item.ultima_visita}</td>
                                              <td>{item.visitasDiarias !== null ?
                                                item.visitasDiarias + ' Hrs'
                                                :
                                                null
                                              }
                                              </td>
                                            </tr>
                                          </React.Fragment>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <>
                                      {/*  <div className="alert alert-danger" role="alert">
                                        No hay datos
                                      </div> */}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Paper>
                        </>
                        : null
                      }

                    </>
                    :
                    <div className="alert alert-danger" role="alert">
                      {/*  No hay datos */}
                    </div>
                  }
                </>
              ) : (
                <>
                  {asesorP ?
                    <>
                      <Paper className={styles.paper}>
                        <div className="row">
                          <div className="mt-2">
                            {visitas.length > 0 ? (
                              <table
                                className="table table-hover table-sm table-striped"
                                style={{ fontSize: 11, textAlign: "center" }}
                              >
                                <thead className="table-secondary">
                                  <tr>
                                    <th colspan={6}></th>
                                    <th className="table-primary" colspan={3}>Promedio (hrs)</th>
                                    <th colspan={31}></th>
                                  </tr>
                                  <tr>
                                    <th>Mes</th>
                                    <th>Total Campos</th>
                                    <th>Campos Visitados</th>
                                    <th className="eficiencia"></th>
                                    <th className="efectividad"></th>
                                    <th>Promedio</th>
                                    <th className="table-primary">Primer_visita</th>
                                    <th className="table-primary">Ultima_visita</th>
                                    <th className="table-primary">Visitas_Diarias</th>
                                    <th>1</th>
                                    <th>2</th>
                                    <th>3</th>
                                    <th>4</th>
                                    <th>5</th>
                                    <th>6</th>
                                    <th>7</th>
                                    <th>8</th>
                                    <th>9</th>
                                    <th>10</th>
                                    <th>11</th>
                                    <th>12</th>
                                    <th>13</th>
                                    <th>14</th>
                                    <th>15</th>
                                    <th>16</th>
                                    <th>17</th>
                                    <th>18</th>
                                    <th>19</th>
                                    <th>20</th>
                                    <th>21</th>
                                    <th>22</th>
                                    <th>23</th>
                                    <th>24</th>
                                    <th>25</th>
                                    <th>26</th>
                                    <th>27</th>
                                    <th>28</th>
                                    <th>29</th>
                                    <th>30</th>
                                    <th>31</th>
                                  </tr>
                                </thead>
                                <tbody style={{ backgroundColor: "white" }}>
                                  {visitas.map((item) => (
                                    <React.Fragment key={item.mes}>
                                      <tr>
                                        <td>{item.mes}</td>
                                        <td>{item.totalCampos}</td>
                                        <td>{item.totalCamposVisit}</td>
                                        <td>{item.eficiencia}</td>
                                        <td>{item.efectividad}</td>
                                        <td>{item.promedio}</td>
                                        <td>{item.primer_visita}</td>
                                        <td>{item.ultima_visita}</td>
                                        <td>
                                          {item.visitasDiarias !== null ?
                                            item.visitasDiarias + ' Hrs'
                                            :
                                            null
                                          }
                                        </td>
                                        <td>{item._1}</td>
                                        <td>{item._2}</td>
                                        <td>{item._3}</td>
                                        <td>{item._4}</td>
                                        <td>{item._5}</td>
                                        <td>{item._6}</td>
                                        <td>{item._7}</td>
                                        <td>{item._8}</td>
                                        <td>{item._9}</td>
                                        <td>{item._10}</td>
                                        <td>{item._11}</td>
                                        <td>{item._12}</td>
                                        <td>{item._13}</td>
                                        <td>{item._14}</td>
                                        <td>{item._15}</td>
                                        <td>{item._16}</td>
                                        <td>{item._17}</td>
                                        <td>{item._18}</td>
                                        <td>{item._19}</td>
                                        <td>{item._20}</td>
                                        <td>{item._21}</td>
                                        <td>{item._22}</td>
                                        <td>{item._23}</td>
                                        <td>{item._24}</td>
                                        <td>{item._25}</td>
                                        <td>{item._26}</td>
                                        <td>{item._27}</td>
                                        <td>{item._28}</td>
                                        <td>{item._29}</td>
                                        <td>{item._30}</td>
                                        <td>{item._31}</td>
                                      </tr>
                                    </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <>
                                {/*  <div className="alert alert-danger" role="alert">
                                  No hay datos
                                </div> */}
                              </>
                            )}
                          </div>
                        </div>
                      </Paper>
                    </>
                    : null}

                </>
              )}

              {/* Calidad */}
              {adminC ? (
                <>
                  <Box sx={{ width: "100%" }}>
                    <Tabs
                      value={value}
                      onChange={handleChangeTab}
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="secondary tabs example"
                    >
                      <Tab value="1" label="Todas" />
                      <Tab value="2" label="Detalle por Mes" />
                    </Tabs>
                  </Box>
                  {visitas.length != 0 ?
                    <>
                      {value === "1" ?
                        <>
                          <Paper className={styles.paper}>
                            <div className="row mt-2">
                              <div className="col-12">
                                <Grid container spacing={1}>
                                  <Grid item xs={12} md={12} lg={3}>
                                    Región:
                                    <select
                                      name="idRegion"
                                      className="form-control"
                                      onChange={(e) => setSearch(e.target.value)}
                                    >
                                      <option value={0}>--Seleccione--</option>
                                      {regiones.map((item) => (
                                        <option key={item.codZona} value={item.descripcion}>
                                          {item.descripcion}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>

                                  <Grid item xs={12} md={12} lg={3}>
                                    Zona:
                                    <select
                                      name="idZona"
                                      className="form-control"
                                      onChange={(e) => setSearch(e.target.value)}
                                    >
                                      <option value={0}>--Seleccione--</option>
                                      {zonas.map((item) => (
                                        <option key={item.idZona} value={item.descZona}>
                                          {item.descZona}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>

                                  <Grid item xs={12} md={12} lg={6}>
                                    <button
                                      className="btn btn-sm btn-danger shadow-lg mt-4"
                                      type="submit"
                                      onClick={() => borrarFiltros()}
                                    >
                                      Borrar filtros
                                    </button>
                                  </Grid>

                                </Grid>
                              </div>
                              <div className="col-12">
                                <div className="mt-2 table-responsive table-condensed table-sm tabla">
                                  {visitas.item1.length > 0 ? (
                                    <table
                                      className="table table-hover table-sm table-striped"
                                      style={{ fontSize: 11, textAlign: "center" }}
                                    >
                                      <thead className="table-secondary">
                                        <tr>
                                          <th colSpan={8}></th>
                                          <th className="table-primary" colSpan={3}>Promedio (hrs)</th>
                                        </tr>
                                        <tr>
                                          <th>Region</th>
                                          <th>Zona</th>
                                          <th>Asesor</th>
                                          <th>Total Campos</th>
                                          <th>Campos Visitados</th>
                                          <th className="eficiencia"></th>
                                          <th className="efectividad"></th>
                                          <th>Promedio</th>
                                          <th className="table-primary">Primer_visita</th>
                                          <th className="table-primary">Ultima_visita</th>
                                          <th className="table-primary">VisitasDiarias</th>
                                        </tr>
                                      </thead>
                                      <tbody style={{ backgroundColor: "white" }}>
                                        {visitas.item1.filter(searchDataT(search)).map((item) => (
                                          <React.Fragment key={item.mes}>
                                            <tr>
                                              <th>{item.region}</th>
                                              <th>{item.zona}</th>
                                              <td>{item.asesor}</td>
                                              <td>{item.totalCampos}</td>
                                              <td>{item.totalCamposVisit}</td>
                                              <td>{item.eficiencia}</td>
                                              <td>{item.efectividad}</td>
                                              <td>{item.promedio}</td>
                                              <td>{item.primer_visita}</td>
                                              <td>{item.ultima_visita}</td>
                                              <td>{item.visitasDiarias !== null ?
                                                item.visitasDiarias + ' Hrs'
                                                :
                                                null
                                              }
                                              </td>
                                            </tr>
                                          </React.Fragment>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <>
                                      {/*  <div className="alert alert-danger" role="alert">
                                        No hay datos
                                      </div> */}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Paper>
                        </>
                        : null
                      }


                      {value === "2" ?
                        <>
                          <Paper className={styles.paper}>
                            <div className="row mt-2">
                              <div className="col-12">
                                <Grid container spacing={1}>
                                  <Grid item xs={12} md={12} lg={3}>
                                    Mes:
                                    <select
                                      name="mes"
                                      className="form-control"
                                      onChange={(e) => setSearchM(e.target.value)}
                                    >
                                      <option value={""}> - Seleccione - </option>
                                      <option value={"7"}>JULIO</option>
                                      <option value={"8"}>AGOSTO</option>
                                      <option value={"9"}>SEPTIEMBRE</option>
                                      <option value={"10"}>OCTUBRE</option>
                                      <option value={"11"}>NOVIEMBRE</option>
                                      <option value={"12"}>DICIEMBRE</option>
                                      <option value={"1"}>ENERO</option>
                                      <option value={"2"}>FEBRERO</option>
                                      <option value={"3"}>MARZO</option>
                                      <option value={"4"}>ABRIL</option>
                                      <option value={"5"}>MAYO</option>
                                      <option value={"6"}>JUNIO</option>
                                    </select>
                                  </Grid>

                                  <Grid item xs={12} md={12} lg={4}>
                                    Asesores:
                                    <select
                                      name="idAgen"
                                      className="form-control"
                                      onChange={(e) => setSearchM(e.target.value)}
                                    >
                                      <option value={0}>--Seleccione--</option>
                                      {asesores.map((item) => (
                                        <option key={item.idAgen} value={item.asesor}>
                                          {item.asesor}
                                        </option>
                                      ))}
                                    </select>
                                  </Grid>
                                </Grid>
                              </div>

                              <div className="col-12">
                                <div className="mt-2 table-responsive table-condensed table-sm tabla">
                                  {visitas.item2.length > 0 ? (
                                    <table
                                      className="table table-hover table-sm table-striped"
                                      style={{ fontSize: 11, textAlign: "center" }}
                                    >
                                      <thead className="table-secondary">
                                        <tr>
                                          <th colSpan={9}></th>
                                          <th className="table-primary" colSpan={3}>Promedio (hrs)</th>
                                        </tr>
                                        <tr>
                                          <th>Mes</th>
                                          <th>Region</th>
                                          <th>Zona</th>
                                          <th>Asesor</th>
                                          <th>Total Campos</th>
                                          <th>Campos Visitados</th>
                                          <th className="eficiencia"></th>
                                          <th className="efectividad"></th>
                                          <th>Promedio</th>
                                          <th className="table-primary">Primer_visita</th>
                                          <th className="table-primary">Ultima_visita</th>
                                          <th className="table-primary">VisitasDiarias</th>
                                        </tr>
                                      </thead>
                                      <tbody style={{ backgroundColor: "white" }}>
                                        {visitas.item2.filter(searchDataM(searchM)).map((item, index) => (
                                          <React.Fragment key={item.index}>
                                            <tr>
                                              <th>{item.mes}</th>
                                              <th>{item.region}</th>
                                              <th>{item.zona}</th>
                                              <td>{item.asesor}</td>
                                              <td>{item.totalCampos}</td>
                                              <td>{item.totalCamposVisit}</td>
                                              <td>{item.eficiencia}</td>
                                              <td>{item.efectividad}</td>
                                              <td>{item.promedio}</td>
                                              <td>{item.primer_visita}</td>
                                              <td>{item.ultima_visita}</td>
                                              <td>{item.visitasDiarias !== null ?
                                                item.visitasDiarias + ' Hrs'
                                                :
                                                null
                                              }
                                              </td>
                                            </tr>
                                          </React.Fragment>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <>
                                      {/*  <div className="alert alert-danger" role="alert">
                                        No hay datos
                                      </div> */}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Paper>
                        </>
                        : null
                      }

                    </>
                    :
                    <div className="alert alert-danger" role="alert">
                      {/*  No hay datos */}
                    </div>
                  }
                </>
              ) : (
                <>
                  {asesorC ?
                    <>
                      <Paper className={styles.paper}>
                        <div className="row">
                          <div className="mt-2">
                            {visitas.length > 0 ? (
                              <table
                                className="table table-hover table-sm table-striped"
                                style={{ fontSize: 11, textAlign: "center" }}
                              >
                                <thead className="table-secondary">
                                  <tr>
                                    <th colspan={6}></th>
                                    <th className="table-primary" colspan={3}>Promedio (hrs)</th>
                                    <th colspan={31}></th>
                                  </tr>
                                  <tr>
                                    <th>Mes</th>
                                    <th>Total Campos</th>
                                    <th>Campos Visitados</th>
                                    <th className="eficiencia"></th>
                                    <th className="efectividad"></th>
                                    <th>Promedio</th>
                                    <th className="table-primary">Primer_visita</th>
                                    <th className="table-primary">Ultima_visita</th>
                                    <th className="table-primary">Visitas_Diarias</th>
                                    <th>1</th>
                                    <th>2</th>
                                    <th>3</th>
                                    <th>4</th>
                                    <th>5</th>
                                    <th>6</th>
                                    <th>7</th>
                                    <th>8</th>
                                    <th>9</th>
                                    <th>10</th>
                                    <th>11</th>
                                    <th>12</th>
                                    <th>13</th>
                                    <th>14</th>
                                    <th>15</th>
                                    <th>16</th>
                                    <th>17</th>
                                    <th>18</th>
                                    <th>19</th>
                                    <th>20</th>
                                    <th>21</th>
                                    <th>22</th>
                                    <th>23</th>
                                    <th>24</th>
                                    <th>25</th>
                                    <th>26</th>
                                    <th>27</th>
                                    <th>28</th>
                                    <th>29</th>
                                    <th>30</th>
                                    <th>31</th>
                                  </tr>
                                </thead>
                                <tbody style={{ backgroundColor: "white" }}>
                                  {visitas.map((item) => (
                                    <React.Fragment key={item.mes}>
                                      <tr>
                                        <td>{item.mes}</td>
                                        <td>{item.totalCampos}</td>
                                        <td>{item.totalCamposVisit}</td>
                                        <td>{item.eficiencia}</td>
                                        <td>{item.efectividad}</td>
                                        <td>{item.promedio}</td>
                                        <td>{item.primer_visita}</td>
                                        <td>{item.ultima_visita}</td>
                                        <td>
                                          {item.visitasDiarias !== null ?
                                            item.visitasDiarias + ' Hrs'
                                            :
                                            null
                                          }
                                        </td>
                                        <td>{item._1}</td>
                                        <td>{item._2}</td>
                                        <td>{item._3}</td>
                                        <td>{item._4}</td>
                                        <td>{item._5}</td>
                                        <td>{item._6}</td>
                                        <td>{item._7}</td>
                                        <td>{item._8}</td>
                                        <td>{item._9}</td>
                                        <td>{item._10}</td>
                                        <td>{item._11}</td>
                                        <td>{item._12}</td>
                                        <td>{item._13}</td>
                                        <td>{item._14}</td>
                                        <td>{item._15}</td>
                                        <td>{item._16}</td>
                                        <td>{item._17}</td>
                                        <td>{item._18}</td>
                                        <td>{item._19}</td>
                                        <td>{item._20}</td>
                                        <td>{item._21}</td>
                                        <td>{item._22}</td>
                                        <td>{item._23}</td>
                                        <td>{item._24}</td>
                                        <td>{item._25}</td>
                                        <td>{item._26}</td>
                                        <td>{item._27}</td>
                                        <td>{item._28}</td>
                                        <td>{item._29}</td>
                                        <td>{item._30}</td>
                                        <td>{item._31}</td>
                                      </tr>
                                    </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <>
                                {/*   <div className="alert alert-danger" role="alert">
                                  No hay datos
                                </div> */}
                              </>
                            )}
                          </div>
                        </div>
                      </Paper>
                    </>
                    : null}

                </>
              )}
            </section>
          </>
        }
      </div>
    </div>
  );
};
export default Visitas;
