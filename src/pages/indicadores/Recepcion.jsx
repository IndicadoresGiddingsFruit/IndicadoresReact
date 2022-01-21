import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import Contenedor from "../Contenedor.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getListRecepcionAction
} from "../../redux/Recepcion/RecepcionD";

import {
  getListRegionesAction
} from "../../redux/Catalogos/RegionesD";

import {
  getListZonasAction
} from "../../redux/Catalogos/ZonasD";

import {
  getListAsesoresAction
} from "../../redux/Catalogos/AgentesD";

import "../../css/Productividad.css";
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
  modal: {
    position: "absolute",
    width: 800,
    padding: theme.spacing(2, 4, 3),
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
    textAlign: "center",
    marginTop: "1%"
  },
}));

function searchD(search) {
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

const Recepcion = () => {
  const styles = useStyles();
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/recepcion";
  //const url="https://localhost:44344/api/recepcion";

  const cookies = new Cookies();
  const dispatch = useDispatch();

  const data = useSelector((r) => r.recepcion.arrayRecepcion);
  console.log(data);

  const [admin, setAdmin] = useState(false);
  const [semana, setSemana] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const regiones = useSelector((v) => v.regiones.arrayRegiones);
  const zonas = useSelector((v) => v.zonas.arrayZonas);
  const asesores = useSelector((v) => v.agentes.arrayAsesores);

  const getdata = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 8000)

    await axios
      .get(url)
      .then((res) => {
        for (const x of res.data) {
          setSemana(x.semana);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    dispatch(getListRecepcionAction(cookies.get("IdAgen")));
  };

  const borrarFiltros = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (cookies.get("IdAgen") === "1" || cookies.get("IdAgen") === "5" || cookies.get("IdAgen") === "50") {
      setAdmin(true);
      dispatch(getListRegionesAction());
      dispatch(getListZonasAction());
      dispatch(getListAsesoresAction("P"));
    } else {
      setAdmin(false);
    }
    getdata();
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
                variant="h5"
                id="tableTitle"
                component="div"
              >
                COMPARATIVA DE RENDIMIENTO PROYECTADO VS ENTREGADO
              </Typography>

              {admin ? (
                <>
                  <Paper className={styles.paper}>
                    <div className="row">
                      <div className="col-12">
                        <Grid container spacing={1}>

                          <Grid item xs={12} md={12} lg={2}>
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

                          <Grid item xs={12} md={12} lg={2}>
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

                          <Grid item xs={12} md={12} lg={4}>
                            Asesores:
                            <select
                              name="idAgen"
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

                          <Grid item xs={12} md={12} lg={3}>
                            <button
                              className="btn btn-sm btn-danger shadow-lg mt-4"
                              type="submit" onClick={() => borrarFiltros()}
                            >
                              Borrar filtros
                            </button>
                          </Grid>

                          {/*  <Grid item xs={12} md={12} lg={5}>
                            <input
                              type="text"
                              placeholder="Buscar..."
                              onChange={(e) => setSearch(e.target.value)}
                              className="form-control mt-3"
                              name="searchText"
                            />
                          </Grid> */}

                        </Grid>
                      </div>

                      <div className="col-12 mt-2">
                        <div className="table-admin table-responsive table-condensed table-sm tabla">
                          {data.length > 0 ? (
                            <table
                              className="table table-hover table-sm table-striped"
                              style={{ fontSize: 11 }}
                              id="tblVisitas"
                            >
                              <thead className="table-secondary">
                                <tr>
                                  <th colSpan={6}></th>
                                  <th className="table-primary"
                                    style={{
                                      textAlign: "center",
                                    }}
                                    colSpan={3}
                                  >
                                    Acumulado Actual
                                  </th>
                                  <th
                                    className="table-info"                                    
                                    colSpan={3}
                                  >
                                    Semana Actual: {semana}
                                  </th>
                                </tr>
                                <tr>
                                  <th>Asesor</th>
                                  <th>Saldo Actual</th>
                                  <th>Financiamiento otorgado</th>
                                  <th>Financiamiento recuperado</th>
                                  <th>Pronostico Total</th>
                                  <th>Entregado Total</th>
                                  <th className="table-primary">
                                    Entregado
                                  </th>
                                  <th className="table-primary">
                                    Pronostico
                                  </th>
                                  <th className="table-primary">
                                    Diferencia
                                  </th>
                                  <th className="table-info">
                                    Entregado
                                  </th>
                                  <th className="table-info">
                                    Pronostico
                                  </th>
                                  <th
                                    className="table-info"
                                  >
                                    Diferencia
                                  </th>
                                </tr>
                              </thead>
                              <tbody style={{ backgroundColor: "white" }}>
                                {data.filter(searchD(search)).map((item) => (
                                  <React.Fragment key={item.asesor}>
                                    <tr>
                                      <td>{item.asesor}</td>
                                      <td>
                                        ${new Intl.NumberFormat("en-US").format(
                                          item.saldoFinal
                                        )}
                                      </td>
                                      <td>
                                        ${new Intl.NumberFormat("en-US").format(
                                          item.cargo
                                        )}
                                      </td>
                                      <td>
                                        ${new Intl.NumberFormat("en-US").format(
                                          item.abono
                                        )}
                                      </td>
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.pronostico
                                        )}
                                      </td>

                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.entregadoTotal
                                        )}
                                      </td>
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.entregado
                                        )}
                                      </td>
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.pronosticoAA
                                        )}
                                      </td>
                                      {item.diferenciaAA < 0 ? (
                                        <>
                                          <td bgcolor="Tomato" align="center">
                                            {new Intl.NumberFormat("en-US").format(
                                              item.diferenciaAA
                                            )}{" "}
                                            %
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          {item.diferenciaAA > 0 &&
                                            item.diferenciaAA < 60 ? (
                                            <>
                                              <td align="center" bgcolor="yellow">
                                                {new Intl.NumberFormat("en-US").format(
                                                  item.diferenciaAA
                                                )}{" "}
                                                %
                                              </td>
                                            </>
                                          ) : (
                                            <>
                                              {item.diferenciaAA > 60 ? (
                                                <>
                                                  <td
                                                    align="center"
                                                    bgcolor="LightGreen"
                                                  >
                                                    {new Intl.NumberFormat(
                                                      "en-US"
                                                    ).format(item.diferenciaAA)}{" "}
                                                    %
                                                  </td>
                                                </>
                                              ) : (
                                                <>
                                                  {item.pronosticoAA === 0 &&
                                                    item.entregado > 0 ? (
                                                    <>
                                                      <td
                                                        align="center"
                                                        bgcolor="LightGreen"
                                                      >
                                                        100%
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {item.pronosticoAA > 0 &&
                                                        item.entregado === 0 ? (
                                                        <>
                                                          <td
                                                            align="center"
                                                            bgcolor="Tomato"
                                                          >
                                                            0%
                                                          </td>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <td align="center">
                                                            {new Intl.NumberFormat(
                                                              "en-US"
                                                            ).format(
                                                              item.diferenciaAA
                                                            )}{" "}
                                                            %
                                                          </td>
                                                        </>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.entregadoSA
                                        )}
                                      </td>
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.pronosticoSA
                                        )}
                                      </td>
                                      {item.diferenciaSA < 0 ? (
                                        <>
                                          <td bgcolor="Tomato" align="center">
                                            {new Intl.NumberFormat("en-US").format(
                                              item.diferenciaSA
                                            )}{" "}
                                            %
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          {item.diferenciaSA > 0 &&
                                            item.diferenciaSA < 60 ? (
                                            <>
                                              <td align="center" bgcolor="yellow">
                                                {new Intl.NumberFormat("en-US").format(
                                                  item.diferenciaSA
                                                )}{" "}
                                                %
                                              </td>
                                            </>
                                          ) : (
                                            <>
                                              {item.diferenciaSA > 60 ? (
                                                <>
                                                  <td
                                                    align="center"
                                                    bgcolor="LightGreen"
                                                  >
                                                    {new Intl.NumberFormat(
                                                      "en-US"
                                                    ).format(item.diferenciaSA)}{" "}
                                                    %
                                                  </td>
                                                </>
                                              ) : (
                                                <>
                                                  {item.pronosticoSA === 0 &&
                                                    item.entregadoSA > 0 ? (
                                                    <>
                                                      <td
                                                        align="center"
                                                        bgcolor="LightGreen"
                                                      >
                                                        100%
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {item.pronosticoSA > 0 &&
                                                        item.entregadoSA === 0 ? (
                                                        <>
                                                          <td
                                                            align="center"
                                                            bgcolor="Tomato"
                                                          >
                                                            0%
                                                          </td>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <td align="center">
                                                            {new Intl.NumberFormat(
                                                              "en-US"
                                                            ).format(
                                                              item.diferenciaSA
                                                            )}{" "}
                                                            %
                                                          </td>
                                                        </>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </tr>
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <>
                              <div className="alert alert-danger" role="alert">
                                Cargando...
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Paper>
                </>
              ) : (
                <>
                  <Paper className={styles.paper}>
                    <div className="row">
                      <div className="col-6">
                      </div>

                      <div className="col-6">
                        <input
                          type="text"
                          placeholder="Buscar..."
                          onChange={(e) => setSearch(e.target.value)}
                          className="form-control mb-2"
                          name="searchText"
                        />
                      </div>

                      <div className="col-12">
                        <div className="table table-responsive table-condensed table-sm">

                          {data.length > 0 ? (
                            <table
                              className="table table-hover"
                              style={{ fontSize: 11 }}
                            >
                              <thead className="table-secondary">
                                <tr>
                                  <th colSpan={6}></th>
                                  <th className="table-primary"
                                    style={{
                                      textAlign: "center",
                                    }}
                                    colSpan={3}
                                  >
                                    Acumulado Actual
                                  </th>
                                  <th
                                    className="table-info"
                                    style={{
                                      textAlign: "center",
                                    }}
                                    colSpan={3}
                                  >
                                    Semana Actual: {semana}
                                  </th>
                                </tr>
                                <tr>
                                  <th>Código</th>
                                  <th>Productor</th>
                                  <th>Saldo Actual</th>
                                  <th>Financiamiento otorgado</th>
                                  <th>Financiamiento recuperado</th>
                                  <th>Pronostico Total</th>
                                  <th className="table-primary">
                                    Entregado
                                  </th>
                                  <th className="table-primary">
                                    Pronostico
                                  </th>
                                  <th className="table-primary">
                                    Diferencia
                                  </th>
                                  <th className="table-info">
                                    Entregado
                                  </th>
                                  <th className="table-info">
                                    Pronostico
                                  </th>
                                  <th className="table-info">
                                    Diferencia
                                  </th>
                                </tr>
                              </thead>
                              <tbody style={{ backgroundColor: "white" }}>
                                {data.filter(searchData(search)).map((item) => (
                                  <React.Fragment key={item.mes}>
                                    <tr>
                                      <td>{item.cod_Prod}</td>
                                      <td>{item.productor}</td>
                                      <td>
                                        ${" "}
                                        {new Intl.NumberFormat("en-US").format(
                                          item.saldoFinal
                                        )}
                                      </td>
                                      <td>
                                        ${" "}
                                        {new Intl.NumberFormat("en-US").format(
                                          item.cargo
                                        )}
                                      </td>
                                      <td>
                                        ${" "}
                                        {new Intl.NumberFormat("en-US").format(
                                          item.abono
                                        )}
                                      </td>

                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.pronostico
                                        )}
                                      </td>
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.entregado
                                        )}
                                      </td>
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.pronosticoAA
                                        )}
                                      </td>

                                      {item.diferenciaAA < 0 ? (
                                        <>
                                          <td bgcolor="Tomato" align="center">
                                            {new Intl.NumberFormat("en-US").format(
                                              item.diferenciaAA
                                            )}{" "}
                                            %
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          {item.diferenciaAA > 0 &&
                                            item.diferenciaAA < 60 ? (
                                            <>
                                              <td align="center" bgcolor="yellow">
                                                {new Intl.NumberFormat("en-US").format(
                                                  item.diferenciaAA
                                                )}{" "}
                                                %
                                              </td>
                                            </>
                                          ) : (
                                            <>
                                              {item.diferenciaAA > 60 ? (
                                                <>
                                                  <td align="center" bgcolor="LightGreen">
                                                    {new Intl.NumberFormat(
                                                      "en-US"
                                                    ).format(item.diferenciaAA)}{" "}
                                                    %
                                                  </td>
                                                </>
                                              ) : (
                                                <>
                                                  {item.pronosticoAA === 0 &&
                                                    item.entregado > 0 ? (
                                                    <>
                                                      <td
                                                        align="center"
                                                        bgcolor="LightGreen"
                                                      >
                                                        100%
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {item.pronosticoAA > 0 &&
                                                        item.entregado === 0 ? (
                                                        <>
                                                          <td
                                                            align="center"
                                                            bgcolor="Tomato"
                                                          >
                                                            0%
                                                          </td>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <td align="center">
                                                            {new Intl.NumberFormat(
                                                              "en-US"
                                                            ).format(
                                                              item.diferenciaAA
                                                            )}{" "}
                                                            %
                                                          </td>
                                                        </>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.entregadoSA
                                        )}
                                      </td>
                                      <td align="center">
                                        {new Intl.NumberFormat("en-US").format(
                                          item.pronosticoSA
                                        )}
                                      </td>

                                      {item.diferenciaSA < 0 ? (
                                        <>
                                          <td bgcolor="Tomato" align="center">
                                            {new Intl.NumberFormat("en-US").format(
                                              item.diferenciaAA
                                            )}{" "}
                                            %
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          {item.diferenciaSA > 0 &&
                                            item.diferenciaSA < 60 ? (
                                            <>
                                              <td align="center" bgcolor="yellow">
                                                {new Intl.NumberFormat("en-US").format(
                                                  item.diferenciaSA
                                                )}{" "}
                                                %
                                              </td>
                                            </>
                                          ) : (
                                            <>
                                              {item.diferenciaSA > 60 ? (
                                                <>
                                                  <td align="center" bgcolor="LightGreen">
                                                    {new Intl.NumberFormat(
                                                      "en-US"
                                                    ).format(item.diferenciaSA)}{" "}
                                                    %
                                                  </td>
                                                </>
                                              ) : (
                                                <>
                                                  {item.pronosticoSA === 0 &&
                                                    item.entregadoSA > 0 ? (
                                                    <>
                                                      <td
                                                        align="center"
                                                        bgcolor="LightGreen"
                                                      >
                                                        100%
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {item.pronosticoSA > 0 &&
                                                        item.entregadoSA === 0 ? (
                                                        <>
                                                          <td
                                                            align="center"
                                                            bgcolor="Tomato"
                                                          >
                                                            0%
                                                          </td>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <td align="center">
                                                            {new Intl.NumberFormat(
                                                              "en-US"
                                                            ).format(
                                                              item.diferenciaSA
                                                            )}{" "}
                                                            %
                                                          </td>
                                                        </>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
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
              )}
            </section>
          </>
        }

      </div>
    </div>
  );
};
export default Recepcion;
