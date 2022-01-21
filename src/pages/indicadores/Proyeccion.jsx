import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Contenedor from "../Contenedor.jsx";
import { makeStyles, Grid, Box, Collapse } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  getListProyeccionAction
} from "../../redux/Proyeccion/ProyeccionD";
import {
  getListRegionesAction
} from "../../redux/Catalogos/RegionesD";
import {
  getListZonasAction
} from "../../redux/Catalogos/ZonasD"; 
import {
  getListAsesoresAction
} from "../../redux/Catalogos/AgentesD"; 

import '../../css/index.css';
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
}));

function searchRegionZonaAsesor(search) {
  return function (item) {
    return (
      item.region.toLowerCase().includes(search.toLowerCase()) ||
      item.zona.toLowerCase().includes(search.toLowerCase()) ||
      item.asesor.toLowerCase().includes(search.toLowerCase())
    );
  };
}

function searchData(search) {
  return function (item) {
    return (
      item.cod_Prod.toLowerCase().includes(search.toLowerCase()) ||
      item.productor.toLowerCase().includes(search.toLowerCase())
    );
  };
}

const Proyeccion = () => {
  const styles = useStyles();
  const cookies = new Cookies();
  const [admin, setAdmin] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState(""); 
  const [loading, setLoading] = useState(false);

  //catalogos
  const regiones = useSelector((v) => v.regiones.arrayRegiones);
  const zonas = useSelector((v) => v.zonas.arrayZonas); 
  const asesores = useSelector((v) => v.asesores.arrayAsesores); 

  //datos
  const proyeccion = useSelector((v) => v.proyeccion.arrayProyeccion);

  const [data, setData] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [pronostico, setPronostico] = useState([]);

  const [detailsopen, setdetailsopen] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");   

  const toggleShown = id => {
    setId(id);
    const shownState = detailsopen.slice();
    const index = shownState.indexOf(id);
    if (index >= 0) {
      shownState.splice(index, 1);
      setdetailsopen(shownState);
    }
    else {
      shownState.push(id);
      setdetailsopen(shownState);
      setOpen(true)
    }
  }

  const validaJson = () => {
    //datos del asesor
    console.log(proyeccion.item1);

    if (proyeccion.item1 !== undefined) {
      let auxData = [];
      for (const x of proyeccion.item1) {
        auxData.push({
          idAgen: x.idAgen,
          asesor: x.asesor,
          idRegion: x.idRegion,
          region: x.region,
          idZona: x.idZona,
          zona: x.zona,
          camposCurva: x.camposCurva
        });
      }

      var hash = {};
      auxData = auxData.filter(function (current) {
        var exists = !hash[current.idAgen];
        hash[current.idAgen] = true;
        return exists;
      });

      setData(auxData);
      console.log(auxData);

      //fechas de actualizaciones
      getFechas();

      //Pronosticos
      let auxPronostico = [];
      for (const x of proyeccion.item1) {
        auxPronostico.push({
          idAgen: x.idAgen,
          pronostico: x.pronostico
        });
      }
      setPronostico(auxPronostico);
      console.log(auxPronostico);
    }
  }

  const getFechas = () => {
    console.log(proyeccion);
    console.log(proyeccion.item1);

    if (proyeccion.item1 !== undefined) {
      let auxFechas = [];
      for (const x of proyeccion.item1) {
        auxFechas.push({
          idAgen: x.idAgen,
          fecha: x.fecha
        });
      }

      var hash = {};
      auxFechas = auxFechas.filter(function (current) {
        var exists = !hash[current.fecha];
        hash[current.fecha] = true;
        return exists;
      });

      setFechas(auxFechas);
      console.log(auxFechas);
    }
  };
  
  const getData = () => {/* 
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
    },3000) */
    dispatch(getListProyeccionAction(cookies.get("IdAgen")));
};

  const borrarFiltros = () => {
    window.location.reload();
  };

  useEffect(() => {
    getData();

    if (cookies.get("IdAgen") === "1" || cookies.get("IdAgen") === "5" || cookies.get("IdAgen") === "50") {
      setAdmin(true);

      dispatch(getListRegionesAction());
      dispatch(getListZonasAction());
      dispatch(getListAsesoresAction('P'));

      validaJson();
    } else {
      setAdmin(false);
      getFechas();
    }
  }, [proyeccion]);

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}></div>

        {loading ?
          <Loading />
          : null
        }

        <section className="content">
          <div className="row">
            <h5 className="text-primary MX-2">REGISTRO DE ACTUALIZACIÓN DE CURVA</h5>
          </div>
          {admin ? (
            <>
              <div className="row">
                <div className="col-12">
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={12} lg={3}>
                      Asesor:
                      <select
                        name="asesor"
                        className="form-control"
                        onChange={(e) => setSearch(e.target.value)}
                      > <option value={0}>--Seleccione--</option>
                        {asesores.map((item) => (
                          <option key={item.idAgen} value={item.asesor}>
                            {item.asesor}
                          </option>
                        ))}
                      </select>
                    </Grid>

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

                    <Grid item xs={12} md={12} lg={3}>
                      <button
                        className="btn btn-sm btn-danger shadow-lg mt-4"
                        type="submit" onClick={() => borrarFiltros()}
                      >
                        Borrar filtros
                      </button>
                    </Grid>
                    
                  </Grid>
                </div>
              </div>

              {proyeccion.length !== 0 ?
                <>
                  <div className="row">
                    <div className="col-12 mt-2 table-responsive table table-sm">
                      {data.length > 0 ? (
                        <table
                          className="table table-hover table-sm table-striped"
                          style={{ fontSize: 11, textAlign: "center" }}
                        >
                          <thead className="table-secondary">
                            <tr>
                              <th colSpan={5}></th>
                              <th className="table-primary"
                                colSpan={fechas.length}>Fechas de actualizaciones</th>
                              <th></th>
                            </tr>
                            <tr>
                              <th></th>
                              <th>Region</th>
                              <th>Zona</th>
                              <th>Asesor</th>
                              <th>Campos en Curva</th>
                              {fechas.length != 0 ? (
                                <>
                                  {fechas.map((item) => (
                                    <React.Fragment key={item.fecha}>
                                      <th className="table-primary">{item.fecha}</th>
                                    </React.Fragment>
                                  ))}
                                </>
                              ) :
                                <th className="table-primary"></th>
                              }
                              <th>Diferencia</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.filter(searchRegionZonaAsesor(search)).map((item) => (
                              <>
                                <tr key={item.idAgen}>
                                  <td>
                                    <IconButton aria-label="expand row" size="small" onClick={() => toggleShown(item.idAgen)}>
                                      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                  </td>
                                  <td>{item.region}</td>
                                  <td>{item.zona}</td>
                                  <td>{item.asesor}</td>
                                  <td>{item.camposCurva}</td>
                                  {pronostico.length != 0 ?
                                    <>
                                      {pronostico.map((subitem) => (
                                        <>
                                          {item.idAgen === subitem.idAgen ?
                                            <>
                                              <td>{new Intl.NumberFormat("en-US").format(
                                                subitem.pronostico
                                              )}</td>
                                            </>
                                            :
                                            <td></td>
                                          }
                                        </>
                                      ))
                                      }
                                    </>
                                    :
                                    null
                                  }
                                  <td></td>
                                </tr>

                                {detailsopen.includes(item.idAgen) && (
                                  <tr key={item.idAgen}>
                                    <td colSpan={6}>
                                      <Collapse in={open} timeout="auto" unmountOnExit>
                                        <Box margin={1}>
                                          <table size="small" aria-label="purchases">
                                            <thead className="table-secondary">
                                              <tr>
                                                <th></th>
                                                <th>Mes</th>
                                                {fechas.length != 0 ? (
                                                  <>
                                                    {fechas.map((f) => (
                                                      <>
                                                        {id === f.idAgen ?
                                                          <React.Fragment key={f.idAgen}>
                                                            <th className="table-primary">{f.fecha}</th>
                                                          </React.Fragment>
                                                          : null
                                                        }
                                                      </>

                                                    ))}
                                                  </>
                                                ) :
                                                  <th className="table-primary"></th>
                                                }
                                                <th>Diferencia</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {
                                                proyeccion.item2.length === 0 ? (
                                                  <React.Fragment key={0}>
                                                    <tr>
                                                      <td>No hay datos</td>
                                                    </tr>
                                                  </React.Fragment>
                                                ) : (
                                                  <>
                                                    {proyeccion.item2.map(subitem => (
                                                      <>
                                                        {id === subitem.idAgen ?
                                                          <>
                                                            <tr key={subitem.idAgen}>
                                                              <td><IconButton aria-label="expand row" size="small" onClick={() => toggleShown(subitem.idAgen)}>
                                                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                              </IconButton>
                                                              </td>
                                                              <td>{subitem.mes}</td>
                                                              <td>{new Intl.NumberFormat("en-US").format(
                                                                subitem.pronostico
                                                              )}</td>
                                                              <td></td>
                                                            </tr>
                                                            {detailsopen.includes(subitem.idAgen) && (
                                                              <tr key={subitem.mes}>
                                                                <td colSpan={6}>
                                                                  <Collapse in={open} timeout="auto" unmountOnExit>
                                                                    <Box margin={1}>
                                                                      <table size="small" aria-label="purchases">
                                                                        <thead className="table-secondary">
                                                                          <tr>
                                                                            <th>Mes</th>
                                                                            <th>Semana</th>
                                                                            {fechas.length != 0 ? (
                                                                              <>
                                                                                {fechas.map((f) => (
                                                                                  <>
                                                                                    {id === f.idAgen ?
                                                                                      <React.Fragment key={f.idAgen}>
                                                                                        <th className="table-primary">{f.fecha}</th>
                                                                                      </React.Fragment>
                                                                                      : null
                                                                                    }
                                                                                  </>
                                                                                ))}
                                                                              </>
                                                                            ) :
                                                                              <th className="table-primary"></th>
                                                                            }
                                                                            <th>Diferencia</th>
                                                                          </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                          {
                                                                            proyeccion.item3.length === 0 ? (
                                                                              <React.Fragment key={0}>
                                                                                <tr>
                                                                                  <td>No hay datos</td>
                                                                                </tr>
                                                                              </React.Fragment>
                                                                            ) : (
                                                                              <>
                                                                                {proyeccion.item3.map(subsubitem => (
                                                                                  <>
                                                                                    {id === subsubitem.idAgen && subitem.mes === subsubitem.mes ?
                                                                                      <>
                                                                                        <tr key={subsubitem.idAgen}>
                                                                                          <td>{subsubitem.mes}</td>
                                                                                          <td>{subsubitem.semana}</td>
                                                                                          <td>{new Intl.NumberFormat("en-US").format(
                                                                                            subsubitem.pronostico
                                                                                          )}</td>
                                                                                          <td></td>
                                                                                        </tr>
                                                                                      </>
                                                                                      : null
                                                                                    }
                                                                                  </>
                                                                                ))}
                                                                              </>
                                                                            )
                                                                          }
                                                                        </tbody>
                                                                      </table>
                                                                    </Box>
                                                                  </Collapse>
                                                                </td>
                                                              </tr>
                                                            )}
                                                          </>
                                                          : null
                                                        }
                                                      </>
                                                    ))}
                                                  </>
                                                )
                                              }
                                            </tbody>
                                          </table>
                                        </Box>
                                      </Collapse>
                                    </td>
                                  </tr>
                                )}
                              </>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <>
                          <div className="alert alert-danger" role="alert">
                            No hay datos...
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
                :
                null
              }
            </>
          ) : (
            <>
              <div className="row">
                <div className="mt-2 table-responsive table-condensed table-sm">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control mb-2"
                    name="searchText"
                  />

                  {proyeccion.length !== 0 ? (
                    <>
                      {proyeccion.item1.length > 0 ?
                        <>
                          <table
                            className="table table-hover table-sm table-striped"
                            style={{ fontSize: 11, textAlign: "center" }}
                          >
                            <thead className="table-secondary">
                              <tr>
                                <th colSpan={4}></th>
                                <th className="table-primary" colSpan={fechas.length}>Fechas de actualizaciones</th>
                              </tr>
                              <tr>
                                <th>Campos</th>
                                <th>Codigo</th>
                                <th>Productor</th>
                                <th># Cambios</th>
                                {fechas.length != 0 ? (
                                  <>
                                    {fechas.map((item) => (
                                      <React.Fragment key={item.fecha}>
                                        <th className="table-primary">{item.fecha}</th>
                                      </React.Fragment>
                                    ))}
                                  </>
                                ) :
                                  <th className="table-primary"></th>
                                }

                              </tr>
                            </thead>
                            <tbody style={{ backgroundColor: "white" }}>
                              {proyeccion.item1.filter(searchData(search)).map((item, index) => (
                                <>
                                  <tr key={index}>
                                    <td>
                                      <IconButton aria-label="expand row" size="small" onClick={() => toggleShown(item.cod_Prod)}>
                                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                      </IconButton>
                                    </td>
                                    <td>{item.cod_Prod}</td>
                                    <td>{item.productor}</td>
                                    <td>{item.cambios}</td>
                                    <td>{new Intl.NumberFormat("en-US").format(
                                      item.pronostico
                                    )}</td>
                                  </tr>
                                  {detailsopen.includes(item.cod_Prod) && (
                                    <tr key={item.cod_Prod}>
                                      <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={open} timeout="auto" unmountOnExit>
                                          <Box margin={1}>
                                            <table size="small" aria-label="purchases">
                                              <thead className="table-secondary">
                                                <tr>
                                                  <th>Cod_Prod</th>
                                                  <th>Cod_Campo</th>
                                                  <th>Campo</th>
                                                  <th>Cultivo</th>
                                                  <th>Variedad</th>
                                                  <th>Mes</th>
                                                  {fechas.length > 0 ? (
                                                    <>
                                                      {fechas.map((item) => (
                                                        <React.Fragment key={item.fecha}>
                                                          <th className="table-primary">{item.fecha}</th>
                                                        </React.Fragment>
                                                      ))}
                                                    </>
                                                  ) :
                                                    <th className="table-primary"></th>
                                                  }
                                                  <th>Diferencia</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {
                                                  proyeccion.item2.length === 0 ? (
                                                    <React.Fragment key={0}>
                                                      <tr>
                                                        <td colSpan={3}>No hay datos</td>
                                                      </tr>
                                                    </React.Fragment>
                                                  ) : (
                                                    <>
                                                      {proyeccion.item2.map(subitem => (
                                                        <>
                                                          {id === subitem.cod_Prod ?
                                                            <>
                                                              <tr key={subitem.cod_Campo}>
                                                                <td>{subitem.cod_Prod}</td>
                                                                <td>{subitem.cod_Campo}</td>
                                                                <td>{subitem.campo}</td>
                                                                <td>{subitem.tipo}</td>
                                                                <td>{subitem.producto}</td>
                                                                <td>{subitem.mes}</td>
                                                                <td>{new Intl.NumberFormat("en-US").format(
                                                                  subitem.pronostico
                                                                )}</td>
                                                                <td></td>
                                                              </tr>
                                                            </>
                                                            : null
                                                          }
                                                        </>
                                                      ))}
                                                    </>
                                                  )
                                                }
                                              </tbody>
                                            </table>
                                          </Box>
                                        </Collapse>
                                      </td>
                                    </tr>
                                  )}
                                </>
                              ))}
                            </tbody>
                          </table>
                        </>
                        :
                        <div className="alert alert-danger" role="alert">
                          Sin datos
                        </div>
                      }

                    </>

                  ) : (
                    <>
                      <div className="alert alert-danger" role="alert">
                        Sin datos
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div >
  );
};
export default Proyeccion;
