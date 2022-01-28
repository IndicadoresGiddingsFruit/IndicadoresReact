import React, { useEffect, useState } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import Contenedor from "../Contenedor.jsx";
import Cookies from "universal-cookie";
import { Grid, Tabs, Tab, Box, Modal, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from "@material-ui/icons/Done";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getListCamposAction } from "../../redux/Catalogos/CamposD";
import { getListAuditoriasAction, getLogPuntosNOAction } from "../../redux/Auditoria/AuditoriaD";
import { getListLocalidadesAction } from "../../redux/Catalogos/LocalidadesD";
import "../../css/index.css";
import "../../css/Table.css";

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
    width: 500,
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  modal_lg: {
    position: "absolute",
    width: 1000,
    height: 500,
    /*   backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5], */
    padding: theme.spacing(2, 4, 3),
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

function searchData(search) {
  return function (item) {
    return (
      item.noPuntoDesc.toLowerCase().includes(search.toLowerCase()) ||
      item.puntoControlDesc.toLowerCase().includes(search.toLowerCase())
    );
  };
}

function searchDataNO(search) {
  return function (item) {
    return (
      item.nivel.toLowerCase().includes(search.toLowerCase()) ||
      item.noPuntoDesc.toLowerCase().includes(search.toLowerCase()) ||
      item.puntoControlDesc.toLowerCase().includes(search.toLowerCase())
    );
  };
}

const Auditoria = (props) => {
  const url_post = "https://giddingsfruit.mx/ApiIndicadores/api/prodLogAuditoria";
  //const url_post = "https://localhost:44344/api/prodLogAuditoria";

  const url = "https://giddingsfruit.mx/ApiIndicadores/api/prodLogAuditoria";
  //const url = "https://localhost:44344/api/prodLogAuditoria";

  const url_puntos = "https://giddingsfruit.mx/ApiIndicadores/api/puntoscontrol";
  //const url_puntos = "https://localhost:44344/api/puntoscontrol";

  const url_file = "https://giddingsfruit.mx/ApiIndicadores/api/prodLogAuditoriaFoto";
  //const url_file = "https://localhost:44344/api/prodLogAuditoriaFoto";

  const url_auditoriaCampos = "https://giddingsfruit.mx/ApiIndicadores/api/ProdAudInocCampos";
  //const url_auditoriaCampos = "https://localhost:44344/api/ProdAudInocCampos";

  const url_auditoria = "https://giddingsfruit.mx/ApiIndicadores/api/auditoria";
  //const url_auditoria = "https://localhost:44344/api/auditoria";

  const url_reporte = "https://giddingsfruit.mx/ApiIndicadores/api/reportes";
  //const url_reporte = "https://localhost:44344/api/reportes";

  const url_campos = "https://giddingsfruit.mx/ApiIndicadores/api/campos";
  //const url_campos = "https://localhost:44344/api/campos";

  const styles = useStyles();
  const { idAuditoria } = useParams();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const [search, setSearch] = useState("");
  const [searchNO, setSearchNO] = useState("");

  const [value, setValue] = React.useState("2");
  const [value1, setValue1] = React.useState("1");

  const [modal, setModal] = useState(false);
  const [modalFoto, setModalFoto] = useState(false);
  const [modalGetFoto, setModalGetFoto] = useState(false);
  const [modalCampo, setModalCampo] = useState(false);

  const [modalFotoNO, setModalFotoNO] = useState(false);
  const [modalGetFotoNO, setModalGetFotoNO] = useState(false);
  const [modalAnalisis, setModalAnalisis] = useState(false);

  const [detailsopen, setdetailsopen] = useState([]);
  const [open, setOpen] = useState(false);
  const [cod_Campo, setCod_Campo] = useState(false);

  const [data, setData] = useState([]);
  const [camposAuditoria, setcamposAuditoria] = useState([]);
  const [puntosControl, setPuntosControl] = useState([]);
  const [filaSeleccionada, setfilaSeleccionada] = useState({});
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [rutaFile, setRutaFile] = useState(null);

  //datos de la auditoria
  const auditoria = useSelector((v) => v.auditoria.arrayAuditorias);

  //Campos agregados
  const campos = useSelector((v) => v.campos.arrayCampos);

  //Acciones correctivas
  const puntosControlNO = useSelector((v) => v.auditoria.arrayLogNO);

  const [idVarios, setIdVarios] = useState([]);
  const [errorFoto, setErrorFoto] = useState(null);

  //Guardar nueva foto
  const [nvaFoto, setNvaFoto] = useState({
    descripcion: "",
    idProdAuditoria: parseInt(idAuditoria),
    idProdAuditoriaCampo: "",
    idLogAC: parseInt(filaSeleccionada.idLogAC)
  });

  //Guardar nuevo campo
  const [auditoriaCampos, setAuditoriaCampos] = useState({
    IdProdAuditoria: parseInt(idAuditoria),
    cod_Campo: parseInt()
  });

  const [errorOption, setErrorOption] = useState(null);

  //Editar punto de control respondido
  const [registroEdita, setRegistroEdita] = useState({
    opcion: "",
    justificacion: ""
  });

  const [pdfsAnalisis, setpdfsAnalisis] = useState([]);
  const [errorAnalisis, setErrorAnalisis] = useState(null);

  //subir anaisis pdf
  const [nvoAnalisis, setNvoAnalisis] = useState({
    descripcion: "",
    idProdAuditoria: parseInt(idAuditoria),
    idProdAuditoriaCampo: "",
  });

  //Actualizar datos de los campos
  const [upCampo, setUpCampo] = useState({
    ubicacion: "",
    codLocalidad: "",
    gps_Latitude: "",
    gps_Longitude: ""
  });

  //Actualizar datos de la auditoria
  const [upAuditoriaCampo, setupAuditoriaCampo] = useState({
    proyeccion: parseInt(),
    tipoCertificacion: ""
  });

  const onChangeRegistroEdita = (e) => {
    const { name, value } = e.target;
    setRegistroEdita((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNvaFoto((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeTab1 = (event, newValue) => {
    setValue1(newValue);
  };

  useEffect(() => {
    dispatch(getListAuditoriasAction(cookies.get("IdAgen"), idAuditoria));
    getPuntosControl();

    getFotosAuditoria();
    dispatch(getLogPuntosNOAction(idAuditoria));
    getCamposAdded();
    getPDFsAnalisis();
    getListLocalidadesAction();
  }, []);

  //campos
  const handleChangeCampos = (e) => {
    const { name, value } = e.target;
    setAuditoriaCampos((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getCampos = async () => {
    for (const dataObj of auditoria) {
      console.log(dataObj.cod_Prod)
      dispatch(getListCamposAction(dataObj.cod_Prod, 0));
    }
  };

  const getCamposAdded = async () => {
    await axios.get(url_auditoriaCampos + "/" + idAuditoria)
      .then(res => {
        setcamposAuditoria(res.data);
      })
  }

  const guardarCampo = async (e) => {
    e.preventDefault();
    swal({
      title: "¿Está seguro de continuar?",
      icon: "info",
      buttons: ["No", "Si"],
    }).then((value) => {
      if (value) {
        peticionPostCampo();
      }
    });
  };

  const peticionPostCampo = async () => {
    setLoading(true);
    await axios
      .post(url_auditoriaCampos, auditoriaCampos)
      .then((response) => {
        setcamposAuditoria(camposAuditoria.concat(response.data))
        //window.location.reload();
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

  const eliminarCampo = async (id) => {
    await axios.delete(url_auditoriaCampos + "/" + id)
      .then(response => {
        setData(data.concat(response.data));
        const arrFiltrado = camposAuditoria.filter(item => item.id !== id);
        setcamposAuditoria(arrFiltrado);
      }).catch(error => {
        swal({
          title: "error",
          text: error.request.response,
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      })
  }

  //campos
  const seleccionarRegistro = (registro, caso) => {
    if (caso === "Respuestas") {
      setfilaSeleccionada(registro);
      setModal(true);
    }
    if (caso === "Foto") {
      setRutaFile(null);
      setfilaSeleccionada(registro);
      openClose_ModalGetFoto();
      getFoto(registro.id);
    }
    if (caso === "FotoAC") {
      setfilaSeleccionada(registro);
      openClose_ModalFotoNO();
    }
    if (caso === "EditarCampo") {
      setfilaSeleccionada(registro);
      openClose_ModalCampo();
    }
  };

  const openClose_Modal = () => {
    setModal(!modal);
  };

  const openClose_ModalFoto = () => {
    setModalFoto(!modalFoto);
  };

  const openClose_ModalGetFoto = () => {
    setModalGetFoto(!modalGetFoto);
  };

  const openClose_ModalFotoNO = () => {
    setModalFotoNO(!modalFotoNO);
  };

  const openClose_ModalGetFotoNO = () => {
    setModalGetFotoNO(!modalGetFotoNO);
  };

  const openClose_ModalAnalisis = () => {
    setModalAnalisis(!modalAnalisis);
  };

  //cargar puntos control
  const getPuntosControl = async () => {
    await axios.get(url_puntos + "/" + cookies.get('IdAgen') + "/" + idAuditoria)
      .then(res => {
        setPuntosControl(res.data);
      })
  }

  const editar = async (e) => {
    e.preventDefault();

    if (!registroEdita.opcion.trim() || registroEdita.opcion === 0) {
      setErrorOption('Debe seleccionar una opción!')
      return
    }
    else {
      setErrorOption(null);
      peticionPut();
    }
  };

  const peticionPut = async () => {
    setLoading(true);
    await axios
      .put(url + "/" + filaSeleccionada.respondida, registroEdita)
      .then((response) => {
        console.log(response.data);

        const arrayEditado = puntosControl.map((item) =>
          item.respondida === filaSeleccionada.respondida ?
            {
              id: item.id,
              consecutivo: item.consecutivo,
              noPunto: item.noPunto,
              noPuntoDesc: item.noPuntoDesc,
              puntoControl: item.puntoControl,
              puntoControlDesc: item.puntoControlDesc,
              respondida: item.respondida,
              opcion: response.data.opcion,
              justificacion: response.data.justificacion
            }
            : item
        );

        setPuntosControl(arrayEditado);

        swal({
          title: "Guardado correctamente!",
          icon: "success",
          button: "ok",
        }).then((value) => {
          if (value) {
            //openClose_Modal();
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        swal({
          title: "error",
          text: error.request.data,
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      });
    setLoading(false);
  };

  const ver_respuestas = (
    <div className={styles.modal}>
      <div className="card card-default">
        <div className="card-header">
          {filaSeleccionada && filaSeleccionada.noPuntoDesc} - {filaSeleccionada && filaSeleccionada.puntoControlDesc}
        </div>
        <form onSubmit={editar}>
          <div className="card-body">
            <div className="form-group-sm">
              <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={12}>
                  Opción seleccionada: {filaSeleccionada && filaSeleccionada.opcion}
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  Justificacion: {filaSeleccionada && filaSeleccionada.justificacion}
                </Grid>

                {filaSeleccionada && filaSeleccionada.fecha_termino === null ?
                  <>
                    <Grid item xs={12} md={12} lg={12}>
                      {
                        errorOption ? <span className="text-danger">{errorOption}</span> : null
                      }
                      <div className="text-primary">Opción:</div>
                      <select
                        name="opcion"
                        className="form-control"
                        onChange={onChangeRegistroEdita}
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
                      <textarea
                        required
                        className="form-control"
                        rows="3"
                        name="justificacion"
                        autoComplete="off"
                        onChange={onChangeRegistroEdita}
                      />
                    </Grid>
                  </>
                  : null}
              </Grid>
            </div>
          </div>
          <div className="card-footer">
            {filaSeleccionada && filaSeleccionada.fecha_termino === null ?
              <>
                <button
                  disabled={loading ? true : false}
                  className="btn btn-primary btn-sm active float-right"
                  type="submit"
                >
                  {loading ? "Espere..." : "Guardar"}
                </button>
              </>
              : null}
            <button
              className="btn btn-secondary btn-sm active float-right"
              type="submit"
              onClick={() => openClose_Modal()}
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  //Fotos
  const getFotosAuditoria = async () => {
    await axios.get(url_file + "/" + idAuditoria)
      .then(res => {
        setFotos(res.data);
      })
  }

  const guardarFoto = async (e) => {
    e.preventDefault();

    if (nvaFoto.idProdAuditoriaCampo === "" || nvaFoto.idProdAuditoriaCampo === 0) {
      setErrorFoto('Debe seleccionar un campo!')
      return
    }

    if (nvaFoto.descripcion === "") {
      setErrorFoto('Debe seleccionar una opción!')
      return
    }

    else {
      setErrorFoto(null);
      peticionPost();
    }
  };

  const peticionPost = async () => {
    setLoading(true);
    await axios
      .post(url_file, nvaFoto)
      .then((response) => {
        console.log(response.data);
        patchsubirImagen(response.data.id);
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

  const subirFile = (e) => {
    setFile(e);
    console.log(e)
  };

  const patchsubirImagen = async (id) => {
    const i = new FormData();

    for (let index = 0; index <= file.length; index++) {
      i.append("file", file[index]);
    }
    await axios
      .patch(url_file + `/${idAuditoria}/${id}`, i)
      .then((response) => {
        console.log(response);
        swal({
          title: "Guardado correctamente!",
          icon: "success",
          button: "ok",
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      });
    setLoading(false);
  };

  const getFoto = async (id) => {
    await axios.get(url_file + "/" + idAuditoria + "/" + id)
      .then(res => {
        if (res.data === 'No hay foto') {
          setRutaFile(null);
        }
        else {
          setRutaFile(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      });
  };

  const toggleShownCampos = id => {
    setCod_Campo(id);
    const shownState = detailsopen.slice();
    const index = shownState.indexOf(id);

    if (index >= 0) {
      shownState.splice(index, 1);
      setdetailsopen(shownState);
    }
    else {
      shownState.push(id);
      setdetailsopen(shownState);
      setOpen(true);
    }
  }

  const toggleShown = i => {
    setRutaFile(null);
    let auxArray = fotos.map(e => {
      (e.id === i) ? e.isOpen = true : e.isOpen = false;
      return e;
    });
    setFotos(auxArray);
    getFoto(i);
  }

  const toggleShownAC = i => {
    setRutaFile(null);
    let auxArray = fotos.map(e => {
      (e.idLogAC === i) ?
        e.isOpen = true : e.isOpen = false;
      return e;
    });
    setFotos(auxArray);
    getFoto(i);
  }

  const subir_foto = (
    <div className={styles.modal}>
      <div className="card card-default">
        <form onSubmit={guardarFoto}>
          <div className="card-header">
            <h6 className="font-weight-bold text-secondary">
              Subir fotografía
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              {
                errorFoto ? <span className="m-2 text-danger">{errorFoto}</span> : null
              }
              <div className="col-12">
                Campos:
                <select
                  name="idProdAuditoriaCampo"
                  className="form-control"
                  onChange={handleChange}
                >
                  <option value={0}>Seleccione un campo</option>
                  {camposAuditoria.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.cod_Campo} -  {item.campo}
                    </option>
                  ))}
                </select>

                Foto
                <select
                  name="descripcion"
                  className="form-control"
                  onChange={handleChange}
                >
                  <option value={""}> - Seleccione - </option>
                  <option value={"Almacén de combustibles"}>Almacén de combustibles</option>
                  <option value={"Almacén de empaque"}>Almacén de empaque</option>
                  <option value={"Almacén de fertilizantes"}>Almacén de fertilizantes</option>
                  <option value={"Almacén de fertilizantes orgánicos"}>Almacén de fertilizantes orgánicos</option>
                  <option value={"Almacén de herramientas"}>Almacén de herramientas</option>
                  <option value={"Almacén de plaguicidas"}>Almacén de plaguicidas</option>
                  <option value={"Área de empaque"}>Área de empaque</option>
                  <option value={"Área de fertirriego"}>Área de fertirriego</option>
                  <option value={"Botiquín"}>Botiquín</option>
                  <option value={"Buzón de quejas"}>Buzón de quejas</option>
                  <option value={"Caldos sobrantes"}>Caldos sobrantes</option>
                  <option value={"Comedor"}>Comedor</option>
                  <option value={"Envases vacíos"}>Envases vacíos</option>
                  <option value={"Equipo de aplicación"}>Equipo de aplicación</option>
                  <option value={"Equipo de protección personal"}>Equipo de protección personal</option>
                  <option value={"Etiqueta de trazabilidad del día de corte"}>Etiqueta de trazabilidad del día de corte</option>
                  <option value={"Lavamanos"}>Lavamanos</option>
                  <option value={"Olla de agua"}>Olla de agua</option>
                  <option value={"Política de inocuidad"}>Política de inocuidad</option>
                  <option value={"Preparación mezclas (letreros, material)"}>Preparación mezclas (letreros, material)</option>
                  <option value={"Procedimiento de Accidentes"}>Procedimiento de Accidentes</option>
                  <option value={"Sanitarios"}>Sanitarios</option>
                </select>

                <input
                  type="file" required
                  name="file"
                  className="m-2"
                  onChange={(e) => subirFile(e.target.files)}
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              disabled={loading ? true : false}
              className="btn btn-primary btn-sm active float-right"
              type="submit"
            >
              {loading ? "Espere..." : "Guardar"}
            </button>
            <button
              className="btn btn-secondary btn-sm active float-right mr-2"
              onClick={() => openClose_ModalFoto()}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const get_foto = (
    <div className={styles.modal}>
      <div className="card card-default">
        <div className="card-header">
          <h6 className="font-weight-bold text-secondary">
            {filaSeleccionada && filaSeleccionada.descripcion}
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <img style={{ width: '100%', height: '100%' }}
                id="foto"
                src={rutaFile}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button
            className="btn btn-secondary btn-sm active float-right mr-2"
            onClick={() => openClose_ModalGetFoto()}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  const guardarFotoAC = async (e) => {
    e.preventDefault();
    console.log(filaSeleccionada.idLogAC);

    /*  setNvaFoto((prevState) => ({
       ...prevState,
       idLogAC: filaSeleccionada.idLogAC,
       idProdAuditoria: parseInt(idAuditoria)
     })); */

    setNvaFoto({
      idLogAC: filaSeleccionada.idLogAC
    });

    console.log(nvaFoto);
    peticionPost();
  };

  const subir_fotoNO = (
    <div className={styles.modal}>
      <div className="card card-default">
        <form onSubmit={guardarFotoAC}>
          <div className="card-header">
            <h6 className="font-weight text-secondary">
              Subir fotografía
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <input
                  type="file"
                  name="file"
                  className="m-2"
                  onChange={(e) => subirFile(e.target.files)}
                />
              </div>

              <div className="col-12">
                <input type="checkbox"
                  name="idLogAC"
                  className="form-control-sm mb-2"
                  onChange={handleChange}
                  required
                  value={filaSeleccionada && filaSeleccionada.idLogAC} style={{ float: 'left' }} />

                <h6 className="mt-2" style={{ float: 'left' }}>Corregido
                </h6>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              disabled={loading ? true : false}
              className="btn btn-primary btn-sm active float-right"
              type="submit"
            >
              {loading ? "Espere..." : "Guardar"}
            </button>
            <button
              className="btn btn-secondary btn-sm active float-right mr-2"
              onClick={() => openClose_ModalFotoNO()}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  //guardar Varios 
  const onClickCheck = (id) => {
    setIdVarios([
      ...idVarios,
      {
        IdProdAuditoria: idAuditoria,
        IdCatAuditoria: id
      }
    ]);
  };

  function borrarRepetidos() {
    const valoresRepetidos = [];
    const arrayOrdenado = idVarios.sort((a, b) => a.IdCatAuditoria - b.IdCatAuditoria, 0); //Ordeno el array por IdCatAuditoria (Por las dudas que no siempre esté ordenado)

    // Recorro todos los elementos de array ordenado iniciando en 1
    for (let i = 1; i < arrayOrdenado.length; i++) {
      //Verifico si la posición i-1 = i
      if (arrayOrdenado[i - 1].IdCatAuditoria === arrayOrdenado[i].IdCatAuditoria && //Si hay 2 numeros consecutivos iguales
        arrayOrdenado[i].IdCatAuditoria !== // Y el último de ellos no es igual al último subido al valoresRepetidos
        valoresRepetidos[valoresRepetidos.length - 1]
      ) {
        //Entonces agrego a valoresRpetidos
        valoresRepetidos.push(arrayOrdenado[i].IdCatAuditoria);
      }
    }
    //Recorro el array original y borro el objeto cuyo IdCatalogo esté presente en valoresRepetidos
    for (let i = 0; i < idVarios.length; i++) {
      if (valoresRepetidos.includes(idVarios[i].IdCatAuditoria)) {
        delete idVarios[i];
      }
    }
  }

  const guardarVarios = async (opcion) => {
    if (idVarios.length > 0) {
      borrarRepetidos();

      await axios
        .post(url_post + "/" + opcion, idVarios)
        .then((response) => {
          swal({
            title: "Guardado correctamente!",
            icon: "success",
            button: "ok",
          });
          window.location.reload();
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
    }
    else {
      swal({
        title: "¡No ha seleccionado nada!",
        text: "Debe seleccionar al menos un punto de control para responder",
        icon: "warning",
        button: "Cerrar",
      });
      return
    }
  };

  //Finalizar reporte
  const finishReport = async (e) => {
    e.preventDefault();
    if (puntosControl.filter((x) => x.respondida === null).length === 0) {
      closeReport();
    }
    else {
      swal({
        title: "¡No se puede finalizar la auditoría!",
        text: "Aún tiene puntos de control pendientes para responder",
        icon: "warning",
        button: "Cerrar",
      });
    }
  };

  const closeReport = async () => {
    await axios
      .put(url_auditoria + "/" + idAuditoria)
      .then((response) => {
        console.log(response);

        swal({
          title: "A partir de ahora tiene 28 días para subir acciones correctivas",
          icon: "success",
          button: "ok",
        }).then((value) => {
          if (value) {

            window.location.reload();
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
  };

  //PDF's 
  //cargar puntos control
  const getPDFsAnalisis = async () => {
    await axios.get(url_reporte + "/" + idAuditoria)
      .then(res => {
        setpdfsAnalisis(res.data);
      })
  }

  const handleChangePDF = (e) => {
    const { name, value } = e.target;
    setNvoAnalisis((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const subirPDF = (e) => {
    setPdf(e);
  };

  const guardarPDF = async (e) => {
    e.preventDefault();

    if (nvoAnalisis.idProdAuditoriaCampo === "" || nvoAnalisis.idProdAuditoriaCampo === 0) {
      setErrorAnalisis('Debe seleccionar un campo!')
      return
    }

    else if (nvoAnalisis.descripcion === "") {
      setErrorAnalisis('Debe seleccionar una opción!')
      return
    }

    else {
      setErrorAnalisis(null);
      peticionPostPDF();
    }
  };

  const peticionPostPDF = async () => {
    setLoading(true);
    await axios
      .post(url_file, nvoAnalisis)
      .then((response) => {
        console.log(response.data);
        patchsubirPDF(response.data.id);
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

  const patchsubirPDF = async (id) => {
    const i = new FormData();

    for (let index = 0; index <= pdf.length; index++) {
      i.append("file", pdf[index]);
    }
    await axios
      .patch(url_file + `/${idAuditoria}/${id}`, i)
      .then((response) => {
        console.log(response);
        swal({
          title: "Guardado correctamente!",
          icon: "success",
          button: "ok",
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      });
    setLoading(false);
  };

  const downloadPDF = async (descripcion, id) => {
    axios({
      url: url_file + "/" + idAuditoria + "/" + id,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', descripcion + '-' + id + '.pdf');
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

  const subir_PDF = (
    <div className={styles.modal}>
      <div className="card card-default">
        <form onSubmit={guardarPDF}>
          <div className="card-header">
            <h6 className="font-weight text-secondary">
              Subir Análisis
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              {
                errorAnalisis ? <span className="m-1 text-danger">{errorAnalisis}</span> : null
              }
              <div className="col-12 m-1">
                Campos:
                <select
                  name="idProdAuditoriaCampo"
                  className="form-control m-1"
                  onChange={handleChangePDF}
                >
                  <option value={0}>Seleccione un campo</option>
                  {camposAuditoria.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.cod_Campo} -  {item.campo}
                    </option>
                  ))}
                </select>

                Descripción
                <select
                  name="descripcion"
                  className="form-control m-1"
                  onChange={handleChangePDF}>
                  <option value={""}> - Seleccione - </option>
                  <option value={"Análisis de metales pesados y físico - químico"}>Análisis de metales pesados y físico - químico</option>
                  <option value={"Análisis de plaguicidas"}>Análisis de plaguicidas</option>
                  <option value={"Análisis Microbiológico"}>Análisis Microbiológico</option>
                </select>
              </div>
              <div className="col-12 m-1">
                PDF
                <input
                  type="file" accept="application/pdf"
                  name="pdf"
                  required multiple
                  onChange={(e) => subirPDF(e.target.files)}
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              disabled={loading ? true : false}
              className="btn btn-primary btn-sm active float-right"
              type="submit"
            >
              {loading ? "Espere..." : "Guardar"}
            </button>
            <button
              className="btn btn-secondary btn-sm active float-right mr-2"
              onClick={() => openClose_ModalAnalisis()}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  //editar datos de campos  
  const handleChangeCampo = (e) => {
    const { name, value } = e.target;
    setUpCampo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeAuditoriaC = (e) => {
    const { name, value } = e.target;
    setupAuditoriaCampo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const openClose_ModalCampo = () => {
    setModalCampo(!modalCampo);
  };

  const guardarDataProd = async (e) => {
    e.preventDefault();
    peticionPutDataCampo();
  };

  const peticionPutDataCampo = async () => {
    setLoading(true);
    await axios
      .put(url_campos + "/" + filaSeleccionada.cod_Prod + "/" + filaSeleccionada.cod_Campo, upCampo)
      .then((response) => {
        peticionPutAuditoria();
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

  const peticionPutAuditoria = async () => {
    setLoading(true);
    await axios
      .put(url_auditoriaCampos + "/" + filaSeleccionada.id, upAuditoriaCampo)
      .then((response) => {
        swal({
          title: "Datos guardados correctamente!",
          icon: "success",
          button: "ok",
        });
        window.location.reload();
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

  const editar_campo = (
    <div className={styles.modal}>
      <div className="card card-default">
        <div className="card-header">
          {filaSeleccionada && filaSeleccionada.cod_Campo} - {filaSeleccionada && filaSeleccionada.campo}
        </div>
        <form onSubmit={guardarDataProd}>
          <div className="card-body">
            <div className="form-group-sm">
              <Grid container spacing={1}>
                {/* <Grid item xs={12} md={12} lg={6}>
                  Entidad Legal:
                  <input
                    className="form-control"
                    name="rfc"
                    autoComplete="off"
                    onChange={handleChangeProd}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  Nombre del titular:
                  <input
                    className="form-control"
                    name="contacto"
                    autoComplete="off"
                    onChange={handleChangeProd}
                  />
                </Grid> */}

                <Grid item xs={12} md={12} lg={6}>
                  {
                    errorOption ? <span className="text-danger">{errorOption}</span> : null
                  }
                  Tipo/Certificación:
                  <select
                    name="tipoCertificacion"
                    className="form-control"
                    onChange={handleChangeAuditoriaC}
                  >
                    <option value={0}> - Seleccione - </option>
                    <option value={"RENOVACIÓN"}>RENOVACIÓN</option>
                    <option value={"CERT. INICIAL"}>CERT. INICIAL</option>
                  </select>
                </Grid>

                {/*   <Grid item xs={12} md={12} lg={4}>
                  Teléfono:
                  <input
                    type="text"
                    className="form-control"
                    name="telefono"
                    maxLength={10}
                    minLength={10}
                    variant="outlined"
                    autoComplete="off"
                    onChange={handleChangeProd}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  Correo:
                  <input
                    className="form-control"
                    name="correo"
                    autoComplete="off"
                    onChange={handleChangeProd}
                  />
                </Grid> */}

                <Grid item xs={12} md={12} lg={6}>
                  Proyeccion:
                  <input
                    className="form-control"
                    name="proyeccion"
                    autoComplete="off"
                    onChange={handleChangeAuditoriaC}
                  />
                </Grid>

                <Grid item xs={12} md={12} lg={6}>
                  Latitud:
                  <input
                    className="form-control"
                    name="gps_Latitude"
                    autoComplete="off"
                    onChange={handleChangeCampo}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  Longitud:
                  <input
                    className="form-control"
                    name="gps_Longitude"
                    autoComplete="off"
                    onChange={handleChangeCampo}
                  />
                </Grid>

                {/*   <Grid item xs={12} md={12} lg={8}>
                  Localidad:
                  <select
                    name="codLocalidad"
                    className="form-control" 
                  >
                    <option value={0}>Seleccione</option>
                    {localidades.map((item) => (
                      <option
                        key={item.codLocalidad}
                        value={item.codLocalidad}
                      >
                        {item.completo}
                      </option>
                    ))}
                  </select>
                </Grid> */}
                <Grid item xs={12} md={12} lg={12}>
                  Ubicacion:
                  <input
                    className="form-control"
                    name="ubicacion"
                    autoComplete="off"
                    onChange={handleChangeCampo}
                  />
                </Grid>

              </Grid>
            </div>
          </div>
          <div className="card-footer">
            <button
              disabled={loading ? true : false}
              className="btn btn-primary btn-sm active float-right"
              type="submit"
            >
              {loading ? "Espere..." : "Guardar"}
            </button>
            <button
              className="btn btn-secondary btn-sm active float-right"
              type="submit"
              onClick={() => openClose_ModalCampo()}>
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      <Contenedor />
      <div className={styles.content}>
        <div className={styles.toolbar}> </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card card-default">
              <div className="card-header font-weight-bold text-secondary">
                {auditoria.map((item) => (
                  <>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12} lg={6}>
                        Productor: {item.cod_Prod} - {item.productor}
                      </Grid>
                      <Grid item xs={12} md={12} lg={3}>
                        Campo(s): {item.cod_Campo}
                      </Grid>
                      <Grid item xs={12} md={12} lg={3}>
                        Zona: {item.zona}
                      </Grid>
                    </Grid>
                  </>
                ))}
              </div>

              {auditoria.map((item) => (
                <>
                  {item.dias === null ?
                    <>
                      <form className="col-12 d-flex justify-content-end" onSubmit={finishReport}>
                        <button
                          className="btn btn-primary m-2"
                          type="submit"
                        >Finalizar Auditoría
                        </button>
                      </form>
                    </>
                    :
                    <div className="alert alert-primary" role="alert">
                      Auditoria finalizada
                    </div>
                  }
                </>
              ))}

              <div className="col-12 d-flex justify-content-center">
                <Box>
                  <Tabs
                    value={value}
                    onChange={handleChangeTab}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value="1" label="Agregar campos" />
                    <Tab value="2" label="CheckList" />
                    <Tab value="3" label="Acciones correctivas" />
                  </Tabs>
                </Box>
              </div>

              {value === "1" ?
                <>
                  <div className="card-body font-weight-bold">
                    <div className="row d-flex justify-content-center">
                      <div className="col-lg-6 col-md-12 col-sm-12">
                        <form onSubmit={guardarCampo}>
                          Campos:
                          <select
                            name="cod_Campo"
                            className="form-control"
                            onChange={handleChangeCampos}
                            onClick={getCampos}
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

                          <div className="card-footer">
                            <button
                              className="btn btn-primary active float-right"
                              type="submit"
                            >Agregar
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                        <div className="mt-2 table-responsive table-condensed table-sm tabla">
                          {camposAuditoria.length > 0 ?
                            <>
                              <table
                                className="table-campos table-hover table-sm table-striped">
                                <thead>
                                  <tr className="table-secondary">
                                    <th colSpan={14}>Campos agregados</th>
                                  </tr>
                                  <tr className="table-primary font-tabla">
                                    <th>Campo</th>
                                    <th>Cultivo</th>
                                    <th>Tipo/Certificación</th>
                                    <th>Entidad Legal</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Dirección del campo</th>
                                    <th>Longitud</th>
                                    <th>Latitud</th>
                                    <th>Proyección</th>
                                    <th>Nombre del titular</th>
                                    <th>Editar</th>
                                    <th>Borrar</th>
                                  </tr>
                                </thead>
                                <tbody className="font-tabla">
                                  {camposAuditoria.map((item) => (
                                    <tr key={item.id}>
                                      <td>{item.cod_Campo}- {item.campo}</td>
                                      <td>{item.tipo}- {item.producto}</td>
                                      <td>{item.tipoCertificacion}</td>
                                      <td>{item.rfc}</td>
                                      <td>{item.telefono}</td>
                                      <td>{item.email}</td>
                                      <td>{item.ubicacion}, {item.localidad}, {item.municipio}, {item.estado}</td>
                                      <td>{item.gps_Longitude}</td>
                                      <td>{item.gps_Latitude}</td>
                                      <td>{item.proyeccion}</td>
                                      <td>{item.titular}</td>
                                      <td>
                                        <button className="btn btn-warning btn-sm" type="submit" onClick={() =>
                                          seleccionarRegistro(
                                            item, "EditarCampo"
                                          )
                                        }>
                                          <i className="fas fa-edit"></i></button>  </td>
                                      <td><button className="btn btn-danger btn-sm" type="submit" onClick={() => eliminarCampo(item.id)}>
                                        <i className="fas fa-times-circle"></i></button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              <Modal open={modalCampo} onClose={openClose_ModalCampo}>
                                {editar_campo}
                              </Modal>

                            </>
                            :
                            <>
                              <div className="alert alert-danger" role="alert">
                                Ningún campo agregado!
                              </div>
                            </>
                          }
                        </div>
                      </div>

                    </div>
                  </div>
                </>
                : null}

              {value === "2" ? (
                <>
                  <div className="card-body font-weight-bold">
                    <div className="row">
                      <div className="col-12">
                        <Box sx={{ width: "100%" }}>
                          <Tabs
                            value={value1}
                            onChange={handleChangeTab1}
                            textColor="primary"
                            indicatorColor="primary"
                            aria-label="primary tabs example">
                            <Tab value="1" label="Pendientes" />
                            <Tab value="2" label="Respondidas" />
                            <Tab value="3" label="Fotografías" />
                            <Tab value="4" label="Análisis" />
                          </Tabs>
                        </Box>
                      </div>

                      <div className="col-12 mt-2 float-rigth">
                        <input
                          type="text" style={{ display: value1 === "3" || value1 === "4" ? 'none' : 'block' }}
                          placeholder="Buscar punto de control..."
                          onChange={(e) => setSearch(e.target.value)}
                          className="form-control mb-2"
                          name="searchText"
                        />
                      </div>

                      {value1 === "1" ?
                        <>
                          <div className="col-12">
                            {puntosControl.filter(x => x.respondida === null).length > 0 ?
                              <>
                                <div className="table-responsive table-condensed table-sm">
                                  <button
                                    className="btn btn-info m-2"
                                    type="submit" onClick={() => guardarVarios("SI")}
                                  >Marcar como: SI
                                  </button>

                                  <button
                                    className="btn btn-secondary m-2"
                                    type="submit" onClick={() => guardarVarios("NA")}
                                  >Marcar como: N/A
                                  </button>

                                  <table
                                    className="table-auditoria table-hover table-sm table-striped"
                                    style={{ fontSize: 11, textAlign: "center" }}>
                                    <thead>
                                      <tr className="table-secondary">
                                        <th colSpan={4}> Selecione un Punto de Control para comenzar</th>
                                      </tr>
                                      <tr className="table-primary">
                                        <th>Nivel</th>
                                        <th>Punto Control</th>
                                        <th>Responder</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {puntosControl.filter(x => x.respondida === null).filter(searchData(search)).map((item) => (
                                        <>
                                          <tr key={item.id}>
                                            <td>{item.nivel}</td>
                                            <td style={{ textAlign: 'left' }}>{item.noPuntoDesc} - {item.puntoControlDesc}</td>

                                            {item.fecha_termino === null ?
                                              <>
                                                <td>
                                                  <Link
                                                    to={`/prellenado/${idAuditoria}/${item.id}`}
                                                    className="btn btn-warning btn-sm float-right">
                                                    Responder
                                                  </Link>
                                                </td>
                                              </>
                                              : <td align="center" bgcolor="LightGreen">
                                                <DoneIcon />
                                              </td>}

                                            <td>
                                              <input
                                                type="checkbox"
                                                type="checkbox"
                                                className="form-control-sm"
                                                onClick={() => onClickCheck(item.id)}
                                              />
                                            </td>
                                          </tr>
                                        </>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </>
                              :
                              <>
                                <div className="alert alert-info" role="alert">
                                  Todo ha sido respondido correctamente
                                </div>
                              </>
                            }
                          </div>
                        </>
                        :
                        null}

                      {value1 === "2" ?
                        <>
                          <div className="col-12">
                            <div className="table-auditoria table-responsive table-condensed table-sm">
                              <table
                                className="table-auditoria table-hover table-sm table-striped"
                                style={{ fontSize: 11 }}>
                                <thead>
                                  <tr className="table-primary">
                                    <th>Nivel</th>
                                    <th>Punto Control</th>
                                    <th>Respuesta</th>
                                    <th>Ver Respuesta</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {puntosControl.filter(x => x.respondida !== null).filter(searchData(search)).map((item) => (
                                    <>
                                      <tr key={item.id}>
                                        <td>{item.nivel}</td>
                                        <td>{item.noPuntoDesc} - {item.puntoControlDesc}</td>
                                        <td>{item.opcion}</td>
                                        <td>
                                          <button className="btn btn-warning btn-sm" type="submit"
                                            onClick={() =>
                                              seleccionarRegistro(
                                                item, "Respuestas"
                                              )
                                            }
                                          ><i className="fas fa-edit"></i></button>
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <Modal open={modal} onClose={openClose_Modal}>
                              {ver_respuestas}
                            </Modal>

                          </div>
                        </>
                        :
                        null}

                      {value1 === "3" ?
                        <>
                          <div className="card-body font-weight-bold">
                            <div className="row">
                              <div className="col-12 mb-2 d-flex justify-content-right">
                                <button type="button" className="btn btn-primary"
                                  onClick={openClose_ModalFoto}>
                                  Subir fotografías
                                </button>
                              </div>

                              <div className="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-center">
                                <div className="table-responsive table-condensed table-sm">
                                  {camposAuditoria.length > 0 ?
                                    <>
                                      <table
                                        className="table table-hover table-sm table-striped">
                                        <thead>
                                          <tr className="table-primary font-tabla">
                                            <th>Fotos</th>
                                            <th>Cod_Campo</th>
                                            <th>Nombre</th>
                                          </tr>
                                        </thead>
                                        <tbody className="font-tabla">
                                          {camposAuditoria.map((item) => (
                                            <>
                                              <tr key={item.id}>
                                                <td>
                                                  <IconButton aria-label="expand row" size="small"
                                                    onClick={() => toggleShownCampos(item.cod_Campo)}>
                                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                  </IconButton>
                                                </td>
                                                <td>{item.cod_Campo}</td>
                                                <td>{item.campo}</td>
                                              </tr>
                                              <tr>
                                                <>
                                                  {cod_Campo === item.cod_Campo ?
                                                    <>
                                                      {fotos.filter(x => x.extension !== "pdf  ").map((subitem) => (
                                                        <>
                                                          {item.cod_Campo === subitem.cod_Campo ?
                                                            <>
                                                              <tr key={subitem.id}>
                                                                <td>
                                                                  <IconButton aria-label="expand row" size="small"
                                                                    onClick={() => toggleShown(subitem.id)}>
                                                                    {subitem.isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                  </IconButton>
                                                                </td>
                                                                <td>
                                                                  {subitem.descripcion}
                                                                </td>
                                                              </tr>
                                                              <tr>
                                                                <td colSpan={4}>
                                                                  <Collapse in={subitem.isOpen} timeout="auto" unmountOnExit>
                                                                    <Box margin={1}>
                                                                      <table size="medium">
                                                                        <tbody>
                                                                          {rutaFile ? <img style={{ width: '350%', height: '350%' }}
                                                                            id="foto"
                                                                            src={rutaFile}
                                                                            alt=""
                                                                          /> : null}
                                                                        </tbody>
                                                                      </table>
                                                                    </Box>
                                                                  </Collapse>
                                                                </td>
                                                              </tr>
                                                            </>
                                                            : null
                                                          }
                                                        </>
                                                      ))}
                                                    </>
                                                    : null}
                                                </>
                                              </tr>
                                            </>
                                          ))}
                                        </tbody>
                                      </table>
                                    </>
                                    :
                                    <>
                                      <div className="alert alert-danger" role="alert">
                                        Ningún campo agregado!
                                      </div>
                                    </>
                                  }
                                </div>
                              </div>

                              <Modal open={modalFoto} onClose={openClose_ModalFoto}>
                                {subir_foto}
                              </Modal>

                              <Modal open={modalGetFoto} onClose={openClose_ModalGetFoto}>
                                {get_foto}
                              </Modal>

                            </div>
                          </div>
                        </>
                        : null}

                      {value1 === "4" ?
                        <>
                          <div className="card-body font-weight-bold">
                            <div className="row">
                              <div className="col-12 mb-2 d-flex justify-content-right">
                                <button type="button" className="btn btn-primary"
                                  onClick={openClose_ModalAnalisis}>
                                  Subir Análisis
                                </button>
                              </div>
                              <div className="col-lg-8 col-md-12 col-sm-12 d-flex justify-content-center">
                                <div className="table-responsive table-condensed table-sm">
                                  {camposAuditoria.length > 0 ?
                                    <>
                                      <table
                                        className="table table-hover table-sm table-striped">
                                        <thead>
                                          <tr className="table-primary font-tabla">
                                            <th>PDF</th>
                                            <th>Cod_Campo</th>
                                            <th>Nombre</th>
                                          </tr>
                                        </thead>
                                        <tbody className="font-tabla">
                                          {camposAuditoria.map((item) => (
                                            <>
                                              <tr key={item.id}>
                                                <td>
                                                  <IconButton aria-label="expand row" size="large"
                                                    onClick={() => toggleShownCampos(item.cod_Campo)}>
                                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                  </IconButton>
                                                </td>
                                                <td>{item.cod_Campo}</td>
                                                <td>{item.campo}</td>
                                              </tr>
                                              <tr>
                                                <>
                                                  {cod_Campo === item.cod_Campo ?
                                                    <>

                                                      {pdfsAnalisis.map((subitem) => (
                                                        <>
                                                          {item.id === subitem.idProdAuditoriaCampo ?
                                                            <>
                                                              <tr key={subitem.id}>
                                                                <td>
                                                                  {subitem.descripcion}
                                                                </td>
                                                                <td><button className="btn btn-danger btn-sm" type="submit"
                                                                  onClick={() => downloadPDF(subitem.descripcion, subitem.id)}
                                                                ><i className="fas fa-file-pdf"></i></button></td>
                                                              </tr>
                                                            </>
                                                            :
                                                            null
                                                          }
                                                        </>
                                                      ))}
                                                    </>
                                                    : null}
                                                </>
                                              </tr>
                                            </>
                                          ))}
                                        </tbody>
                                      </table>
                                    </>
                                    :
                                    <>
                                      <div className="alert alert-danger" role="alert">
                                        Ningún campo agregado!
                                      </div>
                                    </>
                                  }
                                </div>
                              </div>

                              <Modal open={modalAnalisis} onClose={openClose_ModalAnalisis}>
                                {subir_PDF}
                              </Modal>

                            </div>
                          </div>
                        </>
                        : null}
                    </div>
                  </div>
                </>
              ) : null}

              {value === "3" ? (
                <>
                  <div className="card-body font-weight-bold">
                    <div className="row">
                      {puntosControlNO.length > 0 ?
                        <>
                          <div className="col-12 mt-2 float-rigth">
                            <input
                              type="text"
                              placeholder="Buscar punto de control..."
                              onChange={(e) => setSearchNO(e.target.value)}
                              className="form-control mb-2"
                              name="searchText"
                            />
                          </div>
                          <div className="col-12">
                            <div className="table-auditoria table-responsive table-condensed table-sm">

                              <table
                                className="table-auditoria table-hover table-sm table-striped"
                                style={{ fontSize: 11 }}>
                                <thead>
                                  <tr className="table-secondary">
                                    <th colSpan={5}>Selecione un Punto de Control para comenzar</th>
                                  </tr>
                                  <tr className="table-primary">
                                    <th>Nivel</th>
                                    <th>Punto Control</th>
                                    <th>Foto</th>
                                    <th>Corregir</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {puntosControlNO.filter(searchDataNO(searchNO)).map((item) => (
                                    <>
                                      <tr key={item.idLog}>
                                        <td>{item.nivel}</td>
                                        <td>{item.noPuntoDesc} - {item.puntoControlDesc}</td>
                                        {item.fotoAC !== null && item.fotoAC !== 0 ?
                                          <>
                                            <td>
                                              <IconButton aria-label="expand row" size="small"
                                                onClick={() => toggleShownAC(item.idLogAC)}>
                                                {item.isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                              </IconButton>
                                            </td>
                                          </>
                                          :
                                          <>
                                            {item.dias <= 28 ?
                                              <>
                                                <td>
                                                  <button type="button" className="btn btn-info btn-sm"
                                                    onClick={() =>
                                                      seleccionarRegistro(
                                                        item, "FotoAC"
                                                      )
                                                    }
                                                  > <i className="fas fa-plus-circle"></i>
                                                  </button>
                                                </td>
                                              </>
                                              : <>
                                                <td align="center" bgcolor="Tomato">
                                                  <i className="fas fa-times"></i>
                                                </td>
                                              </>
                                            }
                                          </>
                                        }
                                        {item.opcion === "NO" ?
                                          <>
                                            {item.dias <= 28 ?
                                              <td>
                                                <Link to={`/accionCorrectiva/${idAuditoria}/${item.idCatAuditoria}`}
                                                  className="btn btn-danger btn-sm">
                                                  Corregir
                                                </Link>
                                              </td>
                                              :
                                              <>
                                                <td align="center" bgcolor="Tomato">
                                                  <i className="fas fa-times"></i>
                                                </td>
                                              </>
                                            }
                                          </>
                                          :
                                          <td align="center" bgcolor="LightGreen">
                                            <DoneIcon />
                                          </td>
                                        }

                                      </tr>
                                      <tr>
                                        {fotos.map((subitem) => (
                                          <>
                                            {item.idLogAC === subitem.idLogAC ?
                                              <>
                                                <td colSpan={4} style={{ padding: 0, margin: 0 }}>
                                                  <Collapse in={subitem.isOpen} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                      <table size="medium">
                                                        <tbody>
                                                          {rutaFile !== null ?
                                                            <>
                                                              <img style={{ width: '100%', height: '100%' }}
                                                                id="foto"
                                                                src={rutaFile}
                                                                alt=""
                                                              />
                                                            </>
                                                            : null
                                                          }
                                                        </tbody>
                                                      </table>
                                                    </Box>
                                                  </Collapse>
                                                </td>
                                              </>
                                              :
                                              null}
                                          </>
                                        ))}
                                      </tr>
                                    </>
                                  ))}
                                </tbody>
                              </table>

                            </div>
                          </div>
                        </>
                        :
                        <>
                          <div className="alert alert-danger" role="alert">
                            Ninguna acción por corregir
                          </div>
                        </>
                      }
                      <Modal open={modalFotoNO} onClose={openClose_ModalFotoNO}>
                        {subir_fotoNO}
                      </Modal>

                      <Modal open={modalGetFotoNO} onClose={openClose_ModalGetFotoNO}>
                        {get_foto}
                      </Modal>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </div >
    </div >
  );
};

export default withRouter(Auditoria);