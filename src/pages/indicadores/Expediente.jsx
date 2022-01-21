import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from "universal-cookie";
import Contenedor from "../Contenedor.jsx";
import { makeStyles, Grid, Paper, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import GetAppIcon from '@material-ui/icons/GetApp';
import ExportExcel from 'react-export-excel';
import {
    getList
} from "../../redux/Expediente/ExpedienteD";

import {
    getListAsesoresAction
} from "../../redux/Catalogos/AgentesD";

import {
    getListRegionesAction
} from "../../redux/Catalogos/RegionesD";

import {
    getListZonasAction
} from "../../redux/Catalogos/ZonasD";
import Loading from './../Loading.js';
import '../../css/index.css';
import '../../css/Table.css';

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

function searchData(search) {
    return function (item) {
        return (
            item.temporada.toLowerCase() === search.toLowerCase() ||
            item.zona.toLowerCase() === search.toLowerCase() ||
            item.region.toLowerCase() === search.toLowerCase() ||
            item.asesor.toLowerCase() === search.toLowerCase()
        );
    };
} 

const Expediente = () => {
    const styles = useStyles();
    const url = "https://giddingsfruit.mx/ApiIndicadores/api/expediente";

    const cookies = new Cookies();
    const dispatch = useDispatch();

    const [admin, setAdmin] = useState(false);
    const [eficiencia, setEficiencia] = useState(false);
    const [efectividad, setEfectividad] = useState(false);
    const [asertividad, setAsertividad] = useState(false);
    const [recuperación, setRecuperacion] = useState(false);

    //const [data, setData] = useState(null);

    const [search, setSearch] = useState("");
    const data = useSelector((v) => v.expediente.arrayData);
    const regiones = useSelector((v) => v.regiones.arrayRegiones);
    const zonas = useSelector((v) => v.zonas.arrayZonas);
    const asesores = useSelector((v) => v.agentes.arrayAsesores);

    const [loading, setLoading] = useState(false);

    const borrarFiltros = () => {
        window.location.reload();
    };

    const getData = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 5000)
        dispatch(getList(cookies.get("IdAgen")));
    };

    /*  const getData = async () => {
         await axios
             .get(url + `/${cookies.get("IdAgen")}`)
             .then((res) => {
                 setData(res.data);
                 console.log(data);
             });
     };
  */

    useEffect(() => {
        if (cookies.get("IdAgen") === "1" || cookies.get("IdAgen") === "5" || cookies.get("IdAgen") === "50") {
            setAdmin(true);
            dispatch(getListRegionesAction());
            dispatch(getListZonasAction());
            dispatch(getListAsesoresAction("P"));
        } else {
            setAdmin(false);
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
                            > EXPEDIENTE
                            </Typography>

                            <Paper className={styles.paper}>
                                <div className="row mt-2">
                                    <div className="col-12 mb-3">
                                        <Grid container spacing={1}>

                                            <Grid item xs={12} md={12} lg={2}>
                                                Temporada:
                                                <select
                                                    name="mes"
                                                    className="form-control"
                                                    onChange={(e) => setSearch(e.target.value)}
                                                >
                                                    <option value={""}> - Seleccione - </option>
                                                    <option value={"2021"}>2021</option>
                                                    <option value={"2122"}>2122</option>
                                                </select>

                                            </Grid>
                                            {admin ?
                                                <>
                                                    <Grid item xs={12} md={12} lg={2}>
                                                        Región:
                                                        <select
                                                            name="region"
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

                                                    <Grid item xs={12} md={12} lg={2}>
                                                        Zona:
                                                        <select
                                                            name="zona"
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
                                                        Asesores:
                                                        <select
                                                            name="asesor"
                                                            className="form-control"
                                                            onChange={(e) => setSearch(e.target.value)}
                                                        >
                                                            <option value={0}>--Seleccione--</option>
                                                            {asesores.map((item) => (
                                                                <option key={item.idAgen} value={item.asesor}>
                                                                    {item.asesor}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} md={12} lg={2}>
                                                        <button
                                                            className="btn btn-sm btn-danger shadow-lg mt-4"
                                                            type="submit"
                                                            onClick={() => borrarFiltros()}
                                                        >
                                                            Borrar filtros
                                                        </button>
                                                    </Grid>
                                                </> : null}
                                        </Grid>
                                    </div>

                                    {data.length !== 0 ?
                                        <>
                                            <div className="col-lg-8 col-md-12 col-sm-12">
                                                <div className="mt-2 table-responsive table-condensed table-sm">
                                                    {data.item1.length > 0 ? (
                                                        <table
                                                            className="table table-hover table-sm table-striped tbl-expediente">
                                                            <thead>
                                                                <tr className="table-secondary">
                                                                    {admin ?
                                                                        <>
                                                                            <th colSpan={1}>Visitas</th>
                                                                            <th colSpan={6}></th>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <th colSpan={1}>Visitas</th>
                                                                            <th colSpan={2}></th>
                                                                        </>
                                                                    }
                                                                </tr>
                                                                <tr className="table-primary font-tabla">
                                                                    <th style={{ width: 120 }}>Temporada</th>
                                                                    {admin ?
                                                                        <>
                                                                            <th style={{ width: 150 }}>Region</th>
                                                                            <th style={{ width: 150 }}>Zona</th>
                                                                            <th style={{ width: 430 }}>Asesor</th>
                                                                            <th style={{ backgroundColor: '#D3D3D3' }}></th>
                                                                        </>
                                                                        :
                                                                        null
                                                                    }
                                                                    <th className="eficiencia"></th>
                                                                    <th className="efectividad"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="font-tabla">
                                                                {data.item1.filter(searchData(search)).map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{item.temporada}</td>
                                                                        {admin ?
                                                                            <>
                                                                                <td>{item.region}</td>
                                                                                <td>{item.zona}</td>
                                                                                <td>{item.asesor}</td>
                                                                                <td style={{ backgroundColor: '#D3D3D3' }}></td>
                                                                            </>
                                                                            :
                                                                            null
                                                                        }
                                                                        <td>{item.eficiencia}%</td>
                                                                        <td>{item.efectividad}%</td>
                                                                    </tr>
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

                                            <div className="col-lg-4 col-md-12 col-sm-12">
                                                <h5 className="font-weight-bold text-danger">
                                                    SCORE
                                                </h5>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="mt-2 table-responsive table-condensed table-sm tabla">
                                                    {data.item2.length > 0 ? (
                                                        <table
                                                            className="table table-hover table-sm table-striped">
                                                            <thead>
                                                                <tr className="table-secondary">
                                                                    {admin ?
                                                                        <>
                                                                            <th colSpan={1}>Productividad</th>
                                                                            <th colSpan={9}></th>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <th colSpan={1}>Productividad</th>
                                                                            <th colSpan={6}></th>
                                                                        </>
                                                                    }
                                                                </tr>
                                                                <tr className="table-primary font-tabla">
                                                                    <th>Temporada</th>
                                                                    {admin ?
                                                                        <>
                                                                            <th>Region</th>
                                                                            <th>Zona</th>
                                                                            <th style={{ width: 280 }}>Asesor</th>
                                                                            <th style={{ backgroundColor: '#D3D3D3' }}></th>
                                                                        </>
                                                                        :
                                                                        null
                                                                    }
                                                                    <th>Pronostico Total</th>
                                                                    <th>Entregado Total</th>
                                                                    <th style={{ width: 120 }}>Pronostico Acumulado</th>
                                                                    <th style={{ width: 120 }}>Entregado C/Curva</th>
                                                                    <th>Asertividad</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="font-tabla">
                                                                {data.item2.filter(searchData(search)).map((item) => (
                                                                    <React.Fragment key={item.idAgen}>
                                                                        <tr>
                                                                            <td>{item.temporada}</td>
                                                                            {admin ?
                                                                                <>
                                                                                    <td>{item.region}</td>
                                                                                    <td>{item.zona}</td>
                                                                                    <td>{item.asesor}</td>
                                                                                    <td style={{ backgroundColor: '#D3D3D3' }}></td>
                                                                                </>
                                                                                :
                                                                                null
                                                                            }
                                                                            <td>{new Intl.NumberFormat("en-US").format(
                                                                                item.pronostico
                                                                            )}</td>
                                                                            <td>{new Intl.NumberFormat("en-US").format(
                                                                                item.entregadoSC
                                                                            )}</td>
                                                                            <td>{new Intl.NumberFormat("en-US").format(
                                                                                item.pronosticoAA
                                                                            )}</td>
                                                                            <td>{new Intl.NumberFormat("en-US").format(
                                                                                item.entregadoCC
                                                                            )}</td>
                                                                            <td>{item.asertividad}%</td>
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

                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="mt-2 table-responsive table-condensed table-sm tabla">
                                                    {data.item3.length > 0 ? (
                                                        <table
                                                            className="table table-hover table-sm table-striped">
                                                            <thead>
                                                                <tr className="table-secondary">
                                                                    {admin ?
                                                                        <>
                                                                            <th colSpan={1}>Rendimiento</th>
                                                                            <th colSpan={9}></th>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <th colSpan={1}>Rendimiento</th>
                                                                            <th colSpan={6}></th>
                                                                        </>
                                                                    }
                                                                </tr>
                                                                <tr className="table-primary font-tabla">
                                                                    <th>Temporada</th>
                                                                    {admin ?
                                                                        <>
                                                                            <th>Region</th>
                                                                            <th>Zona</th>
                                                                            <th style={{ width: 260 }}>Asesor</th>
                                                                            <th style={{ backgroundColor: '#D3D3D3' }}></th>
                                                                        </>
                                                                        :
                                                                        null
                                                                    }
                                                                    <th>Cultivo</th>
                                                                    <th>Ha</th>
                                                                    <th>Entregado</th>
                                                                    <th>Rendimiento/Ha</th>
                                                                    <th>Rendimiento vs Temporada Anterior</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="font-tabla">
                                                                {data.item3.filter(searchData(search)).map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{item.temporada}</td>
                                                                        {admin ?
                                                                            <>
                                                                                <td>{item.region}</td>
                                                                                <td>{item.zona}</td>
                                                                                <td>{item.asesor}</td>
                                                                                <td style={{ backgroundColor: '#D3D3D3' }}></td>
                                                                            </>
                                                                            :
                                                                            null
                                                                        }
                                                                        <td>{item.descProducto}</td>
                                                                        <td>{new Intl.NumberFormat("en-US").format(
                                                                            item.ha
                                                                        )}</td>
                                                                        <td>{new Intl.NumberFormat("en-US").format(
                                                                            item.entregado
                                                                        )}</td>
                                                                        <td>{new Intl.NumberFormat("en-US").format(
                                                                            item.renxHa
                                                                        )}</td>
                                                                        <td>
                                                                            {item.rendvsTA === null ?
                                                                                <>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {new Intl.NumberFormat("en-US").format(
                                                                                        item.rendvsTA
                                                                                    )}%
                                                                                </>
                                                                            }</td>
                                                                    </tr>
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

                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="mt-2 table-responsive table-condensed table-sm tabla">
                                                    {data.item4.length > 0 ? (
                                                        <table
                                                            className="table table-hover table-sm table-striped">
                                                            <thead>
                                                                <tr className="table-secondary">
                                                                    {admin ?
                                                                        <>
                                                                            <th colSpan={1}>Financiamiento</th>
                                                                            <th colSpan={9}></th>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <th colSpan={1}>Financiamiento</th>
                                                                            <th colSpan={6}></th>
                                                                        </>
                                                                    }
                                                                </tr>
                                                                <tr className="table-primary font-tabla">
                                                                    <th>Temporada</th>
                                                                    {admin ?
                                                                        <>
                                                                            <th>Region</th>
                                                                            <th>Zona</th>
                                                                            <th>Asesor</th>
                                                                            <th style={{ backgroundColor: '#D3D3D3' }}></th>
                                                                        </>
                                                                        :
                                                                        null
                                                                    }
                                                                    <th>Cargo</th>
                                                                    <th>Abono</th>
                                                                    <th>Saldo</th>
                                                                    <th>Productores con deuda</th>
                                                                    <th>Recuperación</th>                                                                    
                                                                </tr>
                                                            </thead>
                                                            <tbody className="font-tabla">
                                                                {data.item4.filter(searchData(search)).map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{item.temporada}</td>
                                                                        {admin ?
                                                                            <>
                                                                                <td>{item.region}</td>
                                                                                <td>{item.zona}</td>
                                                                                <td>{item.asesor}</td>
                                                                                <td style={{ backgroundColor: '#D3D3D3' }}></td>
                                                                            </>
                                                                            :
                                                                            null
                                                                        }
                                                                        <td>${new Intl.NumberFormat("en-US").format(
                                                                            item.cargo
                                                                        )}</td>
                                                                        <td>${new Intl.NumberFormat("en-US").format(
                                                                            item.abono
                                                                        )}</td>
                                                                        <td>${new Intl.NumberFormat("en-US").format(
                                                                            item.saldoFinal
                                                                        )}</td>
                                                                        <td>{new Intl.NumberFormat("en-US").format(
                                                                            item.codigos
                                                                        )}</td>
                                                                        {item.abono > item.cargo ?
                                                                            <td bgcolor="LightGreen">
                                                                                100%
                                                                            </td>
                                                                            :
                                                                            <>
                                                                                {item.recuperacion >= 80 ?
                                                                                    <td bgcolor="LightGreen">
                                                                                        {new Intl.NumberFormat("en-US").format(
                                                                                            item.recuperacion
                                                                                        )}%
                                                                                    </td>
                                                                                    :
                                                                                    <>
                                                                                        {item.recuperacion <= 79 && item.recuperacion >= 60 ?
                                                                                            <td bgcolor="yellow">
                                                                                                {new Intl.NumberFormat("en-US").format(
                                                                                                    item.recuperacion
                                                                                                )}%
                                                                                            </td>
                                                                                            :
                                                                                            <>
                                                                                                {item.recuperacion <= 59 ?
                                                                                                    <td bgcolor="#F75A5A">
                                                                                                        {new Intl.NumberFormat("en-US").format(
                                                                                                            item.recuperacion
                                                                                                        )}%
                                                                                                    </td>
                                                                                                    :
                                                                                                    <>
                                                                                                    </>
                                                                                                }
                                                                                            </>
                                                                                        }
                                                                                    </>
                                                                                }
                                                                            </>
                                                                        }


                                                                    </tr>
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
                                        </>
                                        :
                                        null}
                                </div>
                            </Paper>
                        </section>
                    </>
                }
            </div>
        </div>
    );
};
export default Expediente;
