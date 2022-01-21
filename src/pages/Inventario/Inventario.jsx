import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";

import {
  makeStyles,
  TextField,
  Grid,
  Tabs,
  Tab,
  Box,
  Modal,
} from "@material-ui/core";
import Contenedor from "../Contenedor.jsx";
import swal from "sweetalert";
import GetAppIcon from "@material-ui/icons/GetApp";
import ExportExcel from "react-export-excel";
import Search from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  getListMovimientos,
  getListArticulosAction,
  getListUniMedAction,
  getListMovtos,
  getListEntradas,
} from "../../redux/Inventario/InventarioD";

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
}));

const Inventario = () => {
  const styles = useStyles();
  /* const url =
    "https://giddingsfruit.mx/ApiIndicadores/api/movimientosInventario"; */
  const urlEntradas = "https://giddingsfruit.mx/ApiIndicadores/api/entradas";
  const urlSalidas = "https://giddingsfruit.mx/ApiIndicadores/api/salidas";
  const cookies = new Cookies();
  const dispatch = useDispatch();

  /* const [data, setData] = useState([]); */
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);
  const [cod_Artic, setCod_Artic] = useState(null);
  const [cod_Mov, setCod_Mov] = useState(null);
  const [value, setValue] = React.useState("1");
  const [listEntradas, setlistEntradas] = useState([]);
  const [listSalidas, setlistSalidas] = useState([]);
  const [modalSalida, setmodalSalida] = useState(false);

  const [nvoArticulo, setNvoArticulo] = useState({
    idUsuario: parseInt(cookies.get("Id")),
    cod_Artic: parseInt(),
    codUniMed: parseInt(),
    cod_Mov: parseInt(),
    cantidad: parseInt(),
    observaciones: "",
  });

  const movimientosInventario = useSelector((s) => s.inventario.arrayMovimientos);

  const articulos = useSelector((s) => s.inventario.arrayArticulos);

  const uniMed = useSelector((s) => s.inventario.arrayUniMed);

  const movtos = useSelector((s) => s.inventario.arrayMovtos);

  const entradas = useSelector((s) => s.inventario.arrayEntradas);

  useEffect(() => {
    dispatch(getListArticulosAction());
    dispatch(getListUniMedAction());
    dispatch(getListMovtos("E"));
  }, []);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const onCod_ArticChange = (event, values) => {
    console.log(values);
    setNvoArticulo(
      (prevState) => ({
        ...prevState,
        cod_Artic: values.cod_Artic,
      }),
      () => {
        console.log(nvoArticulo);
      }
    );
  };

  const oncodUniMedChange = (event, values) => {
    console.log(values);
    setNvoArticulo(
      (prevState) => ({
        ...prevState,
        codUniMed: values.codigo,
      }),
      () => {
        console.log(nvoArticulo);
      }
    );
  };

  const oncod_MovChange = (event, values) => {
    console.log(values);
    setNvoArticulo(
      (prevState) => ({
        ...prevState,
        cod_Mov: values.cod_Mov,
      }),
      () => {
        console.log(nvoArticulo);
      }
    );
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setNvoArticulo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getdata = async (e) => {
    e.preventDefault();
    dispatch(getListMovimientos(fechaInicio,fechaFinal));
   /*  await axios
      .get(url + `/${fechaInicio}/${fechaFinal}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      }); */
  };

  //-------------------------------ENTRADAS
  const addEntrada = (e) => {
    e.preventDefault();
    console.log(nvoArticulo);
    setLoading(true);
    agregarEntrada();
    setLoading(false);
  };

  const agregarEntrada = async () => {
    await axios
      .post(urlEntradas, nvoArticulo)
      .then((response) => {
        swal({
          title: "Datos guardados correctamente",
          icon: "success",
          button: "ok",
        });
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
  };

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}></div>
        <section className="content">
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChangeTab}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="1" label="General" />
              <Tab value="2" label="Entradas" />
              <Tab value="3" label="Salidas" />
              <Tab value="4" label="Artículos" />
            </Tabs>
          </Box>

          <div>
            {value === "1" ? (
              <>
                <div>
                  <div className="row m-3">
                    <div className="col-md-12">
                      <form onSubmit={getdata}>
                        <div className="form-group-sm">
                          <Grid container spacing={1}>
                            <Grid item xs={12} md={12} lg={4}>
                              De
                              <input
                                type="date"
                                required
                                className="form-control"
                                name="fechaInicio"
                                variant="outlined"
                                onChange={(e) => setFechaInicio(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={12} md={12} lg={8}>
                              <Grid container spacing={1}>
                                <Grid item xs={12} md={12} lg={6}>
                                  Hasta
                                  <input
                                    type="date"
                                    required
                                    className="form-control"
                                    name="fechaFinal"
                                    variant="outlined"
                                    onChange={(e) =>
                                      setFechaFinal(e.target.value)
                                    }
                                  />
                                </Grid>
                                <button
                                  className="btn btn-danger btn-sm active float-right mt-4 rounded-circle"
                                  type="submit"
                                >
                                  <Search />
                                </button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="table-responsive table-condensed table-sm tabla">
                    <table
                      className="table table-hover"
                      style={{ fontSize: 11, textAlign: "center" }}
                      id="tblMovimientos"
                    >
                      <thead
                        style={{
                          backgroundColor: "#fc9688",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                      >
                        <tr>
                          <td>Código</td>
                          <td>Artículo</td>
                          <td>InventIni</td>
                          <td>Entradas</td>
                          <td>Salidas</td>
                          <td>CantidadFinal</td>
                          <td>CostoFinal</td>
                        </tr>
                      </thead>
                      <tbody>
                        {movimientosInventario.map((item) => (
                          <React.Fragment key={item.cod_Artic}>
                            <tr>
                              <td>{item.cod_Artic}</td>
                              <td>{item.descArt}</td>
                              <td>{item.inventIni}</td>
                              <td>{item.entradas}</td>
                              <td>{item.salidas}</td>
                              <td>{item.cantidadFinal}</td>
                              <td>{item.costoFinal}</td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div>
            {value === "2" ? (
              <>
                <form onSubmit={addEntrada}>
                  <div className="card-header d-flex justify-content-center">
                    <h6 className="font-weight-bold text-secondary">
                      Agregar Entradas de artículos
                    </h6>
                  </div>
                  <div className="card-body font-weight-bold text-secondary">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group-sm">
                          <Grid container spacing={1}>
                            <Grid item xs={12} md={12} lg={12}>
                              <h6 className="font-weight-bold text-secondary">
                                ALMACEN 19 EXPERIMENTAL-EL LLANO
                              </h6>
                            </Grid>

                            <Grid item xs={12} md={12} lg={8}>
                              Articulo
                              <Autocomplete
                                name="cod_Artic"
                                options={articulos}
                                getOptionSelected={(option, value) =>
                                  option.cod_Artic === value.cod_Artic
                                }
                                getOptionLabel={(option) =>
                                  option.descripcion || ""
                                }
                                onChange={onCod_ArticChange}
                                renderInput={(params) => (
                                  <TextField
                                    required
                                    type="text"
                                    {...params}
                                    variant="standard"
                                    placeholder="Buscar Articulo"
                                    margin="normal"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={12} lg={4}>
                              Unidad:
                              <Autocomplete
                                name="codigo"
                                options={uniMed}
                                getOptionSelected={(option, value) =>
                                  option.codigo === value.codigo
                                }
                                getOptionLabel={(option) =>
                                  option.descripcion || ""
                                }
                                onChange={oncodUniMedChange}
                                renderInput={(params) => (
                                  <TextField
                                    required
                                    type="text"
                                    {...params}
                                    variant="standard"
                                    placeholder="Buscar Unidad"
                                    margin="normal"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={12} lg={8}>
                              Movimiento
                              <Autocomplete
                                options={movtos}
                                getOptionSelected={(option, value) =>
                                  option.cod_mov === value.cod_mov
                                }
                                getOptionLabel={(option) =>
                                  option.descripcion || ""
                                }
                                onChange={oncod_MovChange}
                                renderInput={(params) => (
                                  <TextField
                                    required
                                    name="cod_Mov"
                                    type="text"
                                    {...params}
                                    variant="standard"
                                    placeholder="Buscar Movimiento"
                                    margin="normal"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={12} lg={4}>
                              Cantidad:
                              <TextField
                                required
                                type="text"
                                name="cantidad"
                                autoComplete="off"
                                variant="standard"
                                onChange={onChange}
                                margin="normal"
                                fullWidth
                              />
                            </Grid>

                            <Grid item xs={12} md={12} lg={6}>
                              Observaciones:
                              <textarea
                                type="text"
                                className="form-control"
                                name="observaciones"
                                variant="outlined"
                                onChange={onChange}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      disabled={loading ? true : false}
                      className="btn btn-primary active float-right"
                      type="submit"
                    >
                      {loading ? "Espere..." : "Guardar"}
                    </button>
                  </div>
                </form>
              </>
            ) : null}
          </div>

          <div>
            {value === "3" ? (
              <>
                <button
                  className="btn btn-primary mx-2 active float-right"
                  /*   onClick={() => openClose_ModalSalida()} */
                >
                  Nueva salida
                </button>
                <div className="table-responsive table-condensed table-sm mt-5">
                  {listSalidas.length > 0 ? (
                    <table
                      className="table table-hover"
                      style={{ fontSize: 11, textAlign: "center" }}
                    >
                      <thead className="thead-light">
                        <tr>
                          <th>Cod_Artic</th>
                          <th>Descripcion</th>
                          <th>Fecha</th>
                          <th>Cantidad</th>
                          <th>Comentarios</th>
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: "white" }}>
                        {/*  {listSalidas.map((item) => (
                          <React.Fragment key={item.idSalida}>
                            <tr>
                              <td>{item.cod_Artic}</td>
                              <td>{item.descripcion}</td>
                              <td>{item.fecha}</td>
                              <td>{item.cantidad}</td>
                              <td>{item.comentarios}</td>
                            </tr>
                          </React.Fragment>
                        ))} */}
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

                {/*      <Modal open={modalSalida} onClose={openClose_ModalSalida}>
                  {agregar_salida}
                </Modal> */}
              </>
            ) : null}
          </div>

          <div>
            {value === "4" ? (
              <>
                <div className="table-responsive table-condensed table-sm mt-2">
                  {entradas.length > 0 ? (
                    <table
                      className="table table-hover"
                      style={{ fontSize: 11, textAlign: "center" }}
                    >
                      <thead className="thead-light">
                        <tr>
                          <th>Cod_Artic</th>
                          <th>Descripcion</th>
                          <th>Existencia</th>
                          <th>Editar</th>
                          <th>Borrar</th>
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: "white" }}>
                        {entradas.map((item) => (
                          <React.Fragment key={item.idEntrada}>
                            <tr>
                              <td>{item.cod_Artic}</td>
                              <td>{item.descripcion}</td>
                              <td>{item.cantidad}</td>
                              <td>
                                <button className="btn btn-warning btn-sm float-right">
                                  <i className="fas fa-edit"></i>
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm float-right mx-2"
                                  type="submit"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
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
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Inventario;
