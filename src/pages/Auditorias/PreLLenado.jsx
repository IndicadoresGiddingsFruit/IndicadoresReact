import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Contenedor from "../Contenedor.jsx";
import Cookies from "universal-cookie";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { getListAuditoriasAction, getPuntoAction } from "../../redux/Auditoria/AuditoriaD";
import "../../css/index.css";

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
}));

const PreLLenado = (props) => {
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/prodLogAuditoria";
  //const url = "https://localhost:44344/api/prodLogAuditoria";

  const styles = useStyles();
  const { idAuditoria } = useParams();
  const { idPunto } = useParams();

  const dispatch = useDispatch();
  const cookies = new Cookies();

  const auditoria = useSelector((v) => v.auditoria.arrayAuditorias);
  const data = useSelector((v) => v.auditoria.objPunto);
  const [loading, setLoading] = useState(false);
  const [errorOption, setErrorOption] = useState(null);
  const [registro, setRegistro] = useState({
    idProdAuditoria: parseInt(idAuditoria), //registro
    idCatAuditoria: parseInt(idPunto), //catalogo
    opcion: "",
    justificacion: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistro((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    dispatch(getListAuditoriasAction(cookies.get("IdAgen"), idAuditoria));
    dispatch(getPuntoAction(idPunto)); 
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    if (!registro.opcion.trim() || registro.opcion === 0) {
      setErrorOption('Debe seleccionar una opción!')
      return
    }
    else {
      setErrorOption(null);
      peticionPost();
    }
  };

  const peticionPost = async () => {
    setLoading(true);
    await axios
      .post(url, registro)
      .then((response) => {
        swal({
          title: "Guardado correctamente!",
          icon: "success",
          button: "ok",
        }).then((value) => {
          if (value) {
            props.history.goBack();
          }
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
    setLoading(false);
  };

  const onChange = (e) => {
    const html = e.target.innerHTML;

    setRegistro((prevState) => ({
      ...prevState,
      justificacion: html
    }));

  };

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}> </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card card-default">
              <div className="card-header">
                {auditoria.map((item) => (
                  <>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12} lg={4}>
                        Productor: {item.cod_Prod} - {item.productor}
                      </Grid>
                      <Grid item xs={12} md={12} lg={4}>
                        Campo: {item.cod_Campo} - {item.campo}
                      </Grid>
                      <Grid item xs={12} md={12} lg={4}>
                        Zona: {item.zona}
                      </Grid>
                    </Grid>
                  </>
                ))}
              </div>
              <form onSubmit={guardar}>
                <div className="card-body font-weight-bold">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group-sm">
                      {/*   {data.map((item) => ( */}
                          <Grid container spacing={1}>
                            <Grid item xs={12} md={12} lg={12}>
                              {data.noPunto} - {data.puntoControl}
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                              <div className="text-primary">Nº:</div>
                              {data.noPuntoDesc}
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                              <div className="text-primary">
                                Punto de Control:
                              </div>
                              <p className="textos">{data.puntoControlDesc}</p>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                              <div className="text-primary">
                                Criterios de Cumplimiento:
                              </div>
                              <p className="textos">{data.criterio}</p>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                              <div className="text-primary">Nivel:</div>
                              <p className="textos">{data.nivel}</p>
                            </Grid>

                            <Grid item xs={12} md={12} lg={3}>
                              {
                                errorOption ? <span className="text-danger">{errorOption}</span> : null
                              }
                              <div className="text-primary">Opción:</div>
                              <select
                                name="opcion"
                                className="form-control"
                                onChange={handleChange}
                                required
                              >
                                <option value={0}> - Seleccione - </option>
                                <option value={"SI"}>SI</option>
                                <option value={"NO"}>NO</option>
                                <option value={"NA"}>N/A</option>
                              </select>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                              <div className="text-primary">
                                Justificación:
                              </div>
                              {registro.opcion === 'NO' ?
                                <>
                                  <textarea
                                    required
                                    className="form-control"
                                    rows="3"
                                    name="justificacion"
                                    autoComplete="off"
                                    onChange={handleChange}
                                  />
                                </>
                                :
                                <>
                                  <div onInput={onChange} contentEditable>
                                    {data.justificacion}
                                  </div>
                                  {/*  <textarea className="textos form-control"
                                    rows="3"
                                    name="justificacion"
                                    value={item.justificacion}
                                    onChange={handleChange} /> */}
                                  {/* <p className="textos">{item.justificacion}</p> */}
                                </>
                              }
                            </Grid>
                          </Grid>
                       {/*  ))} */}
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
            </div>
          </div>
        </section >
      </div >
    </div >
  );
};
export default withRouter(PreLLenado);