import React, { useState } from "react";
import Contenedor from "../Contenedor.jsx";
import axios from "axios";
import Cookies from "universal-cookie";
import { Checkbox, FormControlLabel, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";

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

const Index = () => {
  const styles = useStyles();
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/muestreo";
  //const url ="https://localhost:44344/api/muestreo";
  const url_campos = "https://giddingsfruit.mx/ApiIndicadores/api/campos";
  //const url_campos="https://localhost:44344/api/campos";

  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [campos, setCampos] = useState([]);
  const [nom_p, setNom_p] = useState(null);
  /*  const [compras_op, setCompras_op] = useState(false); */
  const [activo, setActivo] = useState(null);
  const [loading, setLoading] = useState(false);
  var cod_Campo;
  const [nuevomuestreo, setnuevomuestreo] = useState({
    idAgen: parseInt(cookies.get("IdAgen")),
    cod_Empresa: parseInt(2),
    cod_Prod: "",
    cod_Campo: parseInt(),
    telefono: "",
    inicio_cosecha: "",
    cajasEstimadas: "",
  });

  const handleChange = (e) => {
    cod_Campo=e.target.value;
    console.log(cod_Campo);

    const { name, value } = e.target;
    setnuevomuestreo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    cargarInfoCampo();
  };

  const enviarSolicitud = async (e) => {
    e.preventDefault();

    if (
      !nuevomuestreo.cod_Prod.trim() ||
      !nuevomuestreo.telefono.trim() ||
      !nuevomuestreo.inicio_cosecha.trim() ||
      !nuevomuestreo.cajasEstimadas.trim()
    ) {
      swal({
        title: "¡Complete todos los campos!",
        icon: "error",
        button: "Cerrar",
      });
      return;
    } else {
      swal({
        title: "¿Está seguro de enviar esta solicitud?",
        icon: "info",
        buttons: ["No", "Si"],
      }).then((value) => {
        if (value) {
          solicitudExiste();
        }
      });
    }
  };

  const solicitudExiste = async () => {
    setLoading(true);
    await axios
      .post(url + "/revisar", nuevomuestreo)
      .then((response) => {
        setData(data.concat(response.data));
        swal({
          title: "Solicitud enviada correctamente!",
          icon: "success",
          button: "ok",
        });
      })
      .catch((error) => {
        swal({
          title: error.request.response,
          text: "error",
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
        if (error.response.data === "La solicitud ya existe") {
          swal({
            title:
              "La solicitud ya existe, ¿desea enviar una segunda solicitud?",
            icon: "warning",
            buttons: ["No", "Si"],
          }).then((value) => {
            if (value) {
              peticionPost();
            }
          });
        }
      });
    setLoading(false);
  };

  const peticionPost = async () => {
    setLoading(true);
    await axios
      .post(url + "/null", nuevomuestreo)
      .then((response) => {
        setData(data.concat(response.data));
        swal({
          title: "Solicitud enviada correctamente!",
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
    setLoading(false);
  };

  const cargarInfo = function () {
    setCampos([]);
    setActivo(null);
    axios.get(url_campos + `/${nuevomuestreo.cod_Prod}/${0}`).then((res) => {
      setCampos(res.data);
      for (const dataObj of res.data) {
        setNom_p(dataObj.productor); 
      }
    });
  };

  const cargarInfoCampo = function () { 
    axios.get(url_campos + `/${nuevomuestreo.cod_Prod}/${cod_Campo}`).then((res) => { 
      for (const dataObj of res.data) { 
        if(dataObj.activo==="N"){
          setActivo(dataObj.activo);
        }
        else{
          setActivo(null);
        }
      }
    });
  };

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}> </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card card-default">
              <form onSubmit={enviarSolicitud}>
                <div className="card-header">
                  <h5 className="font-weight-bold text-secondary">
                    Solicitar muestreo
                  </h5>
                </div>
                <div className="card-body font-weight-bold text-secondary">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group-sm">
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

                          <Grid item xs={12} md={12} lg={9}>
                            Campo:
                            <select
                              name="cod_Campo"
                              className="form-control"
                              onChange={handleChange} 
                            >
                              <option value={0}>Seleccione un campo</option>
                              {campos.map((item) => (
                                <option
                                  key={item.cod_Campo}
                                  value={item.cod_Campo}
                                >
                                  {item.info}
                                </option>
                              ))}
                            </select>

                            {activo==='N' ? (
                              <>
                                <div
                                  className="alert alert-danger"
                                  role="alert"
                                >
                                  ¡Campo inactivo!  
                                </div>
                              </>
                            ) : null}

                          </Grid>

                          <Grid item xs={12} md={12} lg={3}>
                            Cajas estimadas:
                            <input
                              type="text"
                              required
                              className="form-control"
                              name="cajasEstimadas"
                              variant="outlined"
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </Grid>
                          
                        </Grid>
                      </div>
                    </div>

                    <div className="col-md-12 mt-3">
                      <div className="form-group-sm">
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} lg={6}>
                            Teléfono:
                            <input
                              type="text"
                              required
                              className="form-control"
                              name="telefono"
                              maxLength={10}
                              minLength={10}
                              variant="outlined"
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </Grid>

                          <Grid item xs={12} md={12} lg={6}>
                            Inicio de cosecha:
                            <input
                              type="date"
                              required
                              className="form-control"
                              name="inicio_cosecha"
                              variant="outlined"
                              onChange={handleChange}
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
                    {loading ? "Espere..." : "Enviar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
