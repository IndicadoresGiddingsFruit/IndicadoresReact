import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Modal, Grid, Button, Tabs, Tab, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import "moment/locale/es"; // Pasar a español
import swal from "sweetalert";
import Contenedor from "../Contenedor.jsx";
import AddBox from "@material-ui/icons/AddBox";
import Clear from "@material-ui/icons/Clear";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import TableContainer from "@material-ui/core/TableContainer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import DoneIcon from "@material-ui/icons/Done";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import { format } from "date-fns";

import '../../css/index.css';

function searchData(search) {
  return function (item) {
    return (
      item.cod_Prod.toLowerCase().includes(search.toLowerCase()) ||
      item.productor.toLowerCase().includes(search.toLowerCase())
    );
  };
}

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

  iconos: {
    cursor: "pointer",
  },

  paper: {
    width: "100%",
    padding: theme.spacing(2),
    textAlign: "center",
  },

  table: {
    minWidth: 650,
  },

  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },

  formControl: {
    minWidth: 210,
  },

  input: {
    width: "100%",
    textTransform: "uppercase",
  },
}));

const Muestreos = (props) => {
  const styles = useStyles();
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/muestreo";
  //const url="https://localhost:44344/api/muestreo";

  const url_calidad = "https://giddingsfruit.mx/ApiIndicadores/api/calidadmuestreo";

  const url_campos = "https://giddingsfruit.mx/ApiIndicadores/api/campos";

  const url_analisis = "https://giddingsfruit.mx/ApiIndicadores/api/analisis";
  //const url_analisis="https://localhost:44344/api/analisis";

  const url_sector = "https://giddingsfruit.mx/ApiIndicadores/api/muestreosector";
  //const url_sector="https://localhost:44344/api/muestreosector";

  const cookies = new Cookies();

  const [dataList, setDataList] = useState([]); 
  //todos
  const [tabledata, setTableData] = useState([]);
  //remuestreo
  const [tabledataRM, setTableDataRM] = useState([]);
  //pendiente de analisis
  const [tabledataP, setTableDataP] = useState([]);

  const [search, setSearch] = useState("");

  var user;
  var cod_zona;
  //cantidad de dias para Liberacion USA
  const [liberacionUSA, setLiberacionUSA] = useState(0);
  //cantidad de dias para Liberacion Europa
  const [liberacionEU, setLiberacionEU] = useState(0);

  const [f_envio, setf_envio] = useState(format(new Date(), "yyyy-MM-dd"));
  const [f_entrega, setf_entrega] = useState(format(new Date(), "yyyy-MM-dd")); 
  const [loading, setLoading] = useState(false);

  //usuarios que solo consultan datos pero no son asesores
  const [otros, setOtros] = useState(false);

  var [data, setData] = useState([]);

  //imagne de autorizar tarjeta
  const [file, setFile] = useState(null);
  const [rutaFile, setRutaFile] = useState(null);

  //estatus de analisis
  var [estatus, setEstatus] = useState(null);
  //zonas de rastreo
  const [zonas, setZonas] = useState([]);
  //listado de asesores
  const [asesores, setasesores] = useState([]);
  //listado de sectores
  const [sectores, setSectores] = useState([]);
  const [idagens, setidagens] = useState([null]);
  //asesor a reasignar
  const [asesorReasignado, setasesorReasignado] = useState(null);

  //Ventana emergente para editar solicitud
  const [modalEditar, setmodalEditar] = useState(false);
  const [actionEditar, setactionEditar] = useState(false);

   //Ventana emergente para agregar estatus de calidad
  const [modalCalidad, setmodalCalidad] = useState(false);
  const [actionCalidad, setactionCalidad] = useState(false);

   //Ventana emergente para agregar fecha de muestreo
  const [modalFecha_muestreo, setmodalFecha_muestreo] = useState(false);
  const [actionFecha_ejecucion, setactionFecha_ejecucion] = useState(false);

   //Ventana emergente para liberar solicitud
  const [modalLiberar, setmodalLiberar] = useState(false);
  const [actionLiberar, setactionLiberar] = useState(false);

   //Ventana emergente para agregar resultado de analisis
  const [modalAnalisis, setmodalAnalisis] = useState(false);
  const [actionAnalisis, setactionAnalisis] = useState(false);

   //Ventana emergente para reasignar codigo
  const [modalReasignar, setmodalReasignar] = useState(false);

   //Ventana emergente para autorizar tarjeta
  const [modalTarjeta, setmodalTarjeta] = useState(false);
  const [actionTarjeta, setactionTarjeta] = useState(false);

  const [campos, setcampos] = useState([]);

  const [filaSeleccionada, setfilaSeleccionada] = useState({
    sector: parseInt(),
    fecha_ejecucion: "",
    liberacion: "",
    estatus: "",
    incidencia: "",
    propuesta: "",
    num_analisis: parseInt(),
    analisis: "",
    tarjeta: "",
    liberar_Tarjeta: "",
    inicio_cosecha: "",
    telefono: "",
  });

  const [nvoanalisis, setNvoanalisis] = useState({
    codZona: "",
    fecha_envio: f_envio,
    fecha_entrega: f_entrega,
    estatus: "",
    laboratorio: "",
    comentarios: "",
    idAgen: parseInt(cookies.get("IdAgen")),
    folio: "",
    traza: "",
    parteMuestreada: "",
    organico: "",
    liberaDocumento: "",
  });

  const [value, setValue] = React.useState("1");
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (e) => {
    /*   console.log(e.target.value); */
    setasesorReasignado(e.target.value);

    const { name, value } = e.target;
    setfilaSeleccionada((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeEstatus = (e) => {
    setEstatus(e.target.value);

    const { name, value } = e.target;
    setNvoanalisis((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeAnalisis = (e) => {
    setf_envio(e.target.value);
    setf_entrega(e.target.value);

    const { name, value } = e.target;
    setNvoanalisis((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //Cargar zonas de rastreo
  const cargarZonas = function (e) {
    cod_zona = e.target.value;
    axios
      .get("https://giddingsfruit.mx/ApiIndicadores/api/prodzonasrastreo")
      .then((res) => {
        setZonas(res.data);
      });
  };

  //Cargar campos por codigo de productor
  const cargarCampos = function (e) {
    axios
      .get(
        "https://giddingsfruit.mx/ApiIndicadores/api/campos" +
        `/${filaSeleccionada.cod_Prod}/0`
      )
      .then((res) => {
        setcampos(res.data);
      });
  };

  //Editar solicitud
  const peticionPutEditar = async (e) => {
    e.preventDefault();

    await axios
      .put(
        url + `/${filaSeleccionada.idMuestreo}/${cookies.get("IdAgen")}/${0}`,
        filaSeleccionada
      )
      .then((response) => {
        var dataNueva = data;
        console.log(data);
        dataNueva.map((item) => {
          if (item.id === filaSeleccionada.idMuestreo) {
            item.cod_Campo = filaSeleccionada.cod_Campo;
            item.inicio_cosecha = filaSeleccionada.inicio_cosecha;
            item.telefono = filaSeleccionada.telefono;
          }
        });
        setData(dataNueva);
        swal({
          title: "Datos guardados correctamente!",
          icon: "success",
          button: "ok",
        });
        const arrayEditado = tabledata.map((item) =>
          item.idMuestreo === filaSeleccionada.idMuestreo
            ? {
              idMuestreo: item.idMuestreo,
              idAnalisis_Residuo: item.idAnalisis_Residuo,
              cod_Prod: item.cod_Prod,
              productor: item.productor,
              cod_Campo: filaSeleccionada.cod_Campo,
              campo: filaSeleccionada.campo,
              ha: filaSeleccionada.ha,
              ubicacion: filaSeleccionada.ubicacion,
              telefono: filaSeleccionada.telefono,
              liberacion: item.liberacion,
              estatus: item.estatus,
              tarjeta: item.tarjeta,
              sector: item.sector,
              fecha_solicitud: item.fecha_solicitud,
              fecha_ejecucion: item.fecha_ejecucion,
              idAgen: item.idAgen,
              asesor: item.asesor,
              idAgenC: item.idAgenC,
              asesorC: item.asesorC,
              asesorCS: item.asesorCS,
              idAgenI: item.idAgenI,
              fecha: item.fecha,
              inicio_cosecha: filaSeleccionada.inicio_cosecha,
              incidencia: item.incidencia,
              propuesta: item.propuesta,
              compras_oportunidad: filaSeleccionada.compras_oportunidad,
              analisis: item.analisis,
            }
            : item
        );
        setTableData(arrayEditado);
        openClose_ModalEditar();
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

  //Agregar fecha de muestreo y sectores
  const peticionPutFecha_Muestreo = async () => {
    await axios
      .put(
        url +
        `/${filaSeleccionada.idMuestreo}/${cookies.get("IdAgen")}/${filaSeleccionada.sector
        }`,
        filaSeleccionada
      )
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((item) => {
          if (item.id === filaSeleccionada.idMuestreo) {
            item.fecha_ejecucion = filaSeleccionada.fecha_ejecucion;
            item.idAgenI = filaSeleccionada.idAgenI;
          }
        });
        setData(dataNueva);
        swal({
          title: "Datos guardados correctamente!",
          icon: "success",
          button: "ok",
        });
        const arrayEditado = tabledata.map((item) =>
          item.idMuestreo === filaSeleccionada.idMuestreo
            ? {
              idMuestreo: item.idMuestreo,
              idAnalisis_Residuo: item.idAnalisis_Residuo,
              cod_Prod: item.cod_Prod,
              productor: item.productor,
              cod_Campo: item.cod_Campo,
              campo: item.campo,
              ha: item.ha,
              ubicacion: item.ubicacion,
              telefono: item.telefono,
              liberacion: item.liberacion,
              estatus: item.estatus,
              tarjeta: item.tarjeta,
              sector: filaSeleccionada.sector,
              fecha_solicitud: item.fecha_solicitud,
              fecha_ejecucion: filaSeleccionada.fecha_ejecucion,
              idAgen: item.idAgen,
              asesor: item.asesor,
              idRegion: item.idRegion,
              idAgenC: item.idAgenC,
              asesorC: item.asesorC,
              asesorCS: item.asesorCS,
              idAgenI: item.idAgenI,
              /* fecha:item.fecha, */
              inicio_cosecha: item.inicio_cosecha,
              incidencia: item.incidencia,
              propuesta: item.propuesta,
              compras_oportunidad: item.compras_oportunidad,
              /*  fecha_analisis:item.fecha_analisis, */
              analisis: item.analisis,
            }
            : item
        );
        setTableData(arrayEditado);
        openClose_ModalFecha_muestreo();
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

  //Agregar estatus de calidad
  const peticionPutCalidad = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .put(
        url_calidad +
        `/${filaSeleccionada.idMuestreo}/${cookies.get("IdAgen")}`,
        filaSeleccionada
      )
      .then((response) => {
        const arrayEditado = tabledata.map((item) =>
          item.idMuestreo === filaSeleccionada.idMuestreo
            ? {
              idMuestreo: item.idMuestreo,
              idAnalisis_Residuo: item.idAnalisis_Residuo,
              cod_Prod: item.cod_Prod,
              productor: item.productor,
              cod_Campo: item.cod_Campo,
              campo: item.campo,
              ha: item.ha,
              ubicacion: item.ubicacion,
              telefono: item.telefono,
              liberacion: item.liberacion,
              estatus: response.data.estatus,
              tarjeta: item.tarjeta,
              sector: item.sector,
              fecha_solicitud: item.fecha_solicitud,
              fecha_ejecucion: item.fecha_ejecucion,
              idAgen: item.idAgen,
              asesor: item.asesor,
              idRegion: item.idRegion,
              idAgenC: item.idAgenC,
              asesorC: item.asesorC,
              asesorCS: item.asesorCS,
              idAgenI: item.idAgenI,
              /* fecha:item.fecha, */
              inicio_cosecha: item.inicio_cosecha,
              incidencia: response.data.incidencia,
              propuesta: response.data.propuesta,
              compras_oportunidad: item.compras_oportunidad,
              /* fecha_analisis:item.fecha_analisis, */
              analisis: item.analisis,
            }
            : item
        );
        setTableData(arrayEditado);
        swal({
          title: "Datos guardados correctamente!",
          icon: "success",
          button: "ok",
        });
        openClose_ModalCalidad();
      })
      .catch((error) => {
        swal({
          title: "error",
          text: error.request.response,
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response);
        console.log(error.request);
        console.log(error.message);
      });

    setLoading(false);
  };

  //Liberar solicitud
  const peticionPatchLiberar = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .patch(
        url +
        `/${filaSeleccionada.idMuestreo}/${cookies.get(
          "IdAgen"
        )}/${"liberacion"}`,
        filaSeleccionada
      )
      .then((response) => {
        const arrayEditado = tabledata.map((item) =>
          item.idMuestreo === filaSeleccionada.idMuestreo
            ? {
              idMuestreo: item.idMuestreo,
              idAnalisis_Residuo: item.idAnalisis_Residuo,
              cod_Prod: item.cod_Prod,
              productor: item.productor,
              cod_Campo: item.cod_Campo,
              campo: item.campo,
              ha: item.ha,
              ubicacion: item.ubicacion,
              telefono: item.telefono,
              liberacion: "S",
              estatus: item.estatus,
              tarjeta: item.tarjeta,
              sector: item.sector,
              fecha_solicitud: item.fecha_solicitud,
              fecha_ejecucion: item.fecha_ejecucion,
              idAgen: item.idAgen,
              asesor: item.asesor,
              idRegion: item.idRegion,
              idAgenC: item.idAgenC,
              asesorC: item.asesorC,
              asesorCS: item.asesorCS,
              idAgenI: item.idAgenI,
              /* fecha:item.fecha, */
              inicio_cosecha: item.inicio_cosecha,
              incidencia: item.incidencia,
              propuesta: item.propuesta,
              compras_oportunidad: item.compras_oportunidad,
              /* fecha_analisis:item.fecha_analisis, */
              analisis: item.analisis,
            }
            : item
        );
        setTableData(arrayEditado);
        swal({
          title: "Datos guardados correctamente!",
          icon: "success",
          button: "ok",
        });
        openClose_ModalLiberar();
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

  //Autoriza tarjeta
  const peticionPatchTarjeta = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (cookies.get("IdAgen") === "null") {
      user = cookies.get("Id");
    } else {
      user = cookies.get("IdAgen");
    }

    await axios
      .patch(
        url + `/${filaSeleccionada.idMuestreo}/${user}/${"tarjeta"}`,
        filaSeleccionada
      )
      .then((response) => {
        const arrayEditado = tabledata.map((item) =>
          item.idMuestreo === filaSeleccionada.idMuestreo
            ? {
              idMuestreo: item.idMuestreo,
              idAnalisis_Residuo: item.idAnalisis_Residuo,
              cod_Prod: item.cod_Prod,
              productor: item.productor,
              cod_Campo: item.cod_Campo,
              campo: item.campo,
              ha: item.ha,
              ubicacion: item.ubicacion,
              telefono: item.telefono,
              liberacion: item.liberacion,
              estatus: item.estatus,
              tarjeta: "S",
              sector: item.sector,
              fecha_solicitud: item.fecha_solicitud,
              fecha_ejecucion: item.fecha_ejecucion,
              idAgen: item.idAgen,
              asesor: item.asesor,
              idRegion: item.idRegion,
              idAgenC: item.idAgenC,
              asesorC: item.asesorC,
              asesorCS: item.asesorCS,
              idAgenI: item.idAgenI,
              /* fecha:item.fecha, */
              /*  inicio_cosecha:item.inicio_cosecha, */
              incidencia: item.incidencia,
              propuesta: item.propuesta,
              compras_oportunidad: item.compras_oportunidad,
              /* fecha_analisis:item.fecha_analisis, */
              analisis: item.analisis,
            }
            : item
        );
        setTableData(arrayEditado);

        patchsubirImagen();

        swal({
          title: "Datos guardados correctamente!",
          icon: "success",
          button: "ok",
        });

        openClose_ModalTarjeta();
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
  };

  //Subir imagen de evidencia cuando se autoriza la tarjeta
  const patchsubirImagen = async () => {
    const i = new FormData();

    for (let index = 0; index <= file.length; index++) {
      i.append("imagen", file[index]);
    }
    await axios
      .patch(url + `/${filaSeleccionada.idMuestreo}`, i)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      });
    setLoading(false);
  };

  //cargar de evidencia cuando se autoriza la tarjeta
  const getCargarImagen = async () => {
    axios
      .get(url + `/${filaSeleccionada.idMuestreo}`)
      .then((res) => {
        setRutaFile(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      });
    setmodalTarjeta(true);
  };

  //Reasignar código
  const peticionPutReasignar = async () => {
    await axios
      .put(
        url_campos +
        `/${cookies.get("IdAgen")}/${asesorReasignado}/${cookies.get(
          "Depto"
        )}`,
        filaSeleccionada
      )
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((item) => {
          if (item.id === filaSeleccionada.idMuestreo) {
            item.cod_Prod = filaSeleccionada.cod_Prod;
            item.cod_Campo = filaSeleccionada.cod_Campo;
          }
        });
        setData(dataNueva);
        swal({
          title: "Datos guardados correctamente!",
          icon: "success",
          button: "ok",
        });
        openClose_ModalReasignar();
      })
      .catch((error) => {
        swal({
          title: "error",
          text: error.request.response,
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response);
        console.log(error.request);
        console.log(error.message);
      });
  };

  //Guardar análisis
  const enviarAnalisis = (e) => {
    e.preventDefault();

    swal({
      title: "¿Desea guardar esta información?",
      icon: "info",
      buttons: ["No", "Si"],
    }).then((value) => {
      if (value) {
        peticionPostAnalisis();
        window.location.reload();
      }
    });
  };

  const peticionPostAnalisis = async (e) => {
    setLoading(true);
    await axios
      .post(
        url_analisis +
        `/${filaSeleccionada.idMuestreo}/${liberacionUSA}/${liberacionEU}`,
        nvoanalisis
      )
      .then((response) => {
        patchsubirPDF(response.data.id);

        const arrayEditado = tabledata.map((item) =>
          item.cod_Prod === response.data.cod_Prod &&
            item.cod_Campo === response.data.cod_Campo
            ? {
              idMuestreo: item.idMuestreo,
              idAnalisis_Residuo: item.idAnalisis_Residuo,
              cod_Prod: item.cod_Prod,
              productor: item.productor,
              cod_Campo: item.cod_Campo,
              campo: item.campo,
              ha: item.ha,
              ubicacion: item.ubicacion,
              telefono: item.telefono,
              liberacion: item.liberacion,
              estatus: item.estatus,
              tarjeta: item.tarjeta,
              sector: item.sector,
              fecha_solicitud: item.fecha_solicitud,
              fecha_ejecucion: item.fecha_ejecucion,
              idAgen: item.idAgen,
              asesor: item.asesor,
              idRegion: item.idRegion,
              idAgenC: item.idAgenC,
              asesorC: item.asesorC,
              asesorCS: item.asesorCS,
              idAgenI: item.idAgenI,
              /*  fecha:item.fecha, */
              inicio_cosecha: item.inicio_cosecha,
              incidencia: item.incidencia,
              propuesta: item.propuesta,
              compras_oportunidad: item.compras_oportunidad,
              /*   fecha_analisis:item.fecha_analisis, */
              analisis: response.data.estatus,
            }
            : item
        );

        setTableData(arrayEditado);

        swal({
          title: "Datos guardados correctamente!",
          icon: "success",
          button: "ok",
        });

        openClose_ModalAnalisis();
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
    setNvoanalisis(null);
  };

  //Subir pdf de resultado de analsis
  const patchsubirPDF = async (idAnalisis) => {
    const f = new FormData();

    for (let index = 0; index <= file.length; index++) {
      f.append("file", file[index]);
    }

    await axios
      .patch(url_analisis + "/" + idAnalisis, f)
      .then((response) => {
        //console.log(response);
        //  window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      });
  };

  //Seleccionar registro al elegir una acción
  const seleccionarRegistro = (muestreo, caso) => {
    setfilaSeleccionada(muestreo);
    if (caso === "Calidad") {
      setmodalCalidad(true);
    }
    if (caso === "Fecha_muestreo") {
      handlerCargarSectores();
    }
    if (caso === "Liberar_muestreo") {
      setmodalLiberar(true);
    }
    if (caso === "Analisis_residuo") {
      setmodalAnalisis(true);
    }
    if (caso === "Reasignar") {
      setmodalReasignar(true);
    }
    if (caso === "Tarjeta") {
      setRutaFile(null);
      getCargarImagen();
    }
    if (caso === "Editar_muestreo") {
      setmodalEditar(true);
    }
  };

  //Cargar datos por usuario
  const peticionGet = async () => {

    //Asesores de Produccion, Calidad e Inocuidad
    if (cookies.get("Depto") !== "null") 
    {
      setOtros(false);
      await axios
        .get(url + `/${cookies.get("IdAgen")}/${null}/${cookies.get("Depto")}`)
        .then((res) => {
          setDataList(res.data);

          //Habilitar permiso para editar solicitudes
          setactionEditar(true);

          //Asesores de producción
          if (cookies.get("Depto") === "P") 
          {   
            setactionCalidad(false);
            setactionFecha_ejecucion(false); 

            //Solicitudes liberadas
            for (const dataObj of res.data) 
            {
              console.log(dataObj.liberacion);

              if (dataObj.liberacion === "S") 
              {
                setactionLiberar(true);
              } 
              else if (dataObj.liberacion === "") 
              {
                setactionLiberar(true);
              } else {
                setactionLiberar(true);
              }
            }
          } 
          
          //Asesores de Calidad
          else if (cookies.get("Depto") == "C") {
            setactionCalidad(true);
            setactionLiberar(false);
            setactionFecha_ejecucion(false);
          } 
          
          //Asesores de inocuidad
          else if (cookies.get("Depto") == "I") 
          {
            setactionFecha_ejecucion(true);
            setactionLiberar(false);

            //Asesores de Inocuidad con permisos de Calidad
            if (cookies.get("IdAgen") === "304" || cookies.get("IdAgen") === "328") {
              setactionCalidad(true);
            } else {
              setactionCalidad(false);
            }
          }

          //Asesores con permisos para autorizar tarjetas
          if (cookies.get("IdAgen") === "1" ||
            cookies.get("IdAgen") === "281" ||
            cookies.get("IdAgen") === "259" ||
            cookies.get("IdAgen") === "5" 
          ) {
            setactionTarjeta(true);
          } else {
            setactionTarjeta(false);
          }
          
          //Asesores con permisos para subir analisis de residuos
          if (
            cookies.get("IdAgen") === "205" ||
            cookies.get("IdAgen") === "216"
          ) {
            setactionAnalisis(true);
          }
        });
    } 
    
    //Usuarios para consultar informacion
    else {
      await axios
        .get(url + `/${cookies.get("Id")}/${cookies.get("Tipo")}/${null}`)
        .then((res) => {
          setDataList(res.data);

          //Permiso para autorizar tarjeta
          if (cookies.get("Id") === "352") {
            setactionTarjeta(true);
          }

          setactionAnalisis(false);
          setactionFecha_ejecucion(false);
          setactionCalidad(false);
          setactionLiberar(false);
          setactionEditar(false);
          setOtros(true);
        });
    }
  };

  //Primer metodo que se ejecuta
  useEffect(() => {
    if (dataList.length === 0) {
      peticionGet();
    }

    if (cookies.get("IdAgen") === "205") 
    {
      //Solicitudes del idagen 205
      setTableData(dataList.filter((x) => x.idAgenIS === 205));
      //Remuestreos
      setTableDataRM(dataList.filter((x) => x.idAnalisis_Residuo !== null && x.num_analisis !== 1));
       //pendientes de analisis
      setTableDataP(dataList.filter((x) => x.idAnalisis_Residuo === null));
    } 
    else 
    {
      //todos los muestreos
      setTableData(dataList);
      //Remuestreos
      setTableDataRM(dataList.filter((x) => x.num_analisis > 1));
      //pendientes de analisis
      setTableDataP(dataList.filter((x) => x.idAnalisis_Residuo === null));
    }
  }, [dataList]);

  //cargar asesores
  const cargarAsesores = function (e) {
    axios
      .get(
        "https://giddingsfruit.mx/ApiIndicadores/api/json" +
        `/${cookies.get("Depto")}`
      )
      .then((res) => {
        setasesores(res.data);
        for (const dataObj of res.data) {
          setidagens(dataObj.idAgen);
        }
      });
  };

  //cargar sectores
  const handlerCargarSectores = function (e) {
    axios.get(url_sector + `/${filaSeleccionada.idMuestreo}`).then((res) => {
      if (res.data !== "");
      {
        setSectores(res.data);
      }
      setmodalFecha_muestreo(true);
    });
  };

  //Eliminar sectores (uno por uno)
  const deleteSector = async (idSector) => {
    await axios
      .delete(url_sector + `/${idSector}`)
      .then((response) => {
        const arrFiltrado = sectores.filter((item) => item.id !== idSector);
        setSectores(arrFiltrado);
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

  //Abrir ventana para evaluar calidad
  const openClose_ModalCalidad = () => {
    setmodalCalidad(!modalCalidad);
  };

  //Abrir ventana para agregar fecha de solicitud
  const openClose_ModalFecha_muestreo = () => {
    setmodalFecha_muestreo(!modalFecha_muestreo);
  };

   //Abrir ventana para liberar solicitud
  const openClose_ModalLiberar = () => {
    setmodalLiberar(!modalLiberar);
  };

   //Abrir ventana para agregar análisis
  const openClose_ModalAnalisis = () => {
    setmodalAnalisis(!modalAnalisis);
  };

   //Abrir ventana para reasignar
  const openClose_ModalReasignar = () => {
    setmodalReasignar(!modalReasignar);
  };

   //Abrir ventana para autorizar tarjeta
  const openClose_ModalTarjeta = () => {
    setmodalTarjeta(!modalTarjeta);
  };

   //Abrir ventana para editar solicitud
  const openClose_ModalEditar = () => {
    setmodalEditar(!modalEditar);
  };

  const reasignar_codigo = (
    <div className={styles.modal}>
      <div className="card card-default">
        <div className="card-header">
          <div className="card-header">
            <h6 className="font-weight-bold text-secondary">
              Re-asignar a otro ingeniero
            </h6>
          </div>
          <div className="card-body">
            Codigo
            <input
              type="text"
              disabled
              className="form-control"
              id="cod_Prod"
              name="cod_Prod"
              value={filaSeleccionada && filaSeleccionada.cod_Prod}
            />
            Campo
            <input
              type="text"
              disabled
              className="form-control"
              id="cod_Campo"
              name="cod_Campo"
              value={filaSeleccionada && filaSeleccionada.cod_Campo}
            />
            <br />
            <h6>Asesor</h6>
            <select
              name="idAgen_Reasignado"
              className="form-control"
              onChange={handleChange}
              onClick={cargarAsesores}
            >
              <option value={0}>--Seleccione--</option>
              {asesores.map((item) => (
                <option key={item.idAgen} value={item.idAgen}>
                  {item.asesor}
                </option>
              ))}
            </select>
          </div>
          <div className="card-footer">
            <Button
              className="btn btn-primary btn-sm active float-right"
              onClick={() => peticionPutReasignar()}
            >
              Guardar
            </Button>
            <Button
              className="btn btn-secondary btn-sm active float-right"
              onClick={() => openClose_ModalReasignar()}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const editar_muestreo = (
    <div className={styles.modal}>
      <div className="card card-default">
        <form onSubmit={peticionPutEditar}>
          <div className="card-header">
            <h6 className="font-weight-bold text-secondary d-flex justify-content-center">
              Editar solicitud{" "}
            </h6>
            Asesor: {filaSeleccionada && filaSeleccionada.asesor}
            <br />
            Código: {filaSeleccionada && filaSeleccionada.cod_Prod} - Campo:{" "}
            {filaSeleccionada && filaSeleccionada.cod_Campo}
          </div>
          <div className="card-body">
            <div className="form-group-sm">
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  Campos:
                  <select
                    name="cod_Campo"
                    id="cod_Campo"
                    className="form-control"
                    onChange={handleChange}
                    onClick={cargarCampos}
                  >
                    <option value={0}>...</option>
                    {campos.map((item) => (
                      <option key={item.cod_Campo} value={item.cod_Campo}>
                        {item.info}
                      </option>
                    ))}
                  </select>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  Inicio de cosecha
                  <input
                    type="date"
                    onChange={handleChange}
                    className="form-control"
                    id="inicio_cosecha"
                    name="inicio_cosecha"
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  Teléfono
                  <input
                    type="text"
                    onChange={handleChange}
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    autoComplete="off"
                    maxLength={10}
                    minLength={10}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  Cajas estimadas:
                  <input
                    type="text"
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
          <div className="card-footer">
            <button
              disabled={loading ? true : false}
              className="btn btn-primary  active float-right"
              type="submit"
            >
              {loading ? "Espere..." : "Guardar"}
            </button>
            <button
              className="btn btn-secondary active float-right"
              type="submit"
              onClick={() => openClose_ModalEditar()}
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const evaluar_calidad = (
    <div className={styles.modal}>
      <div className="card card-default">
        <form onSubmit={peticionPutCalidad}>
          <div className="card-header">
            <h6 className="font-weight-bold text-secondary">
              Estatus de calidad
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                Codigo
                <input
                  type="text"
                  disabled
                  className="form-control"
                  id="cod_Prod"
                  name="cod_Prod"
                  value={filaSeleccionada && filaSeleccionada.cod_Prod}
                />
              </div>
              <div className="col-md-6 col-sm-12">
                Campo
                <input
                  type="text"
                  disabled
                  className="form-control"
                  id="cod_Campo"
                  name="cod_Campo"
                  value={filaSeleccionada && filaSeleccionada.cod_Campo}
                />
              </div>
            </div>

            {actionCalidad ? (
              <>
                Estatus:
                <select
                  className="form-control"
                  id="estatus"
                  name="estatus"
                  onChange={handleChange}
                >
                  <option value={0}> --Seleccione una opción-- </option>
                  <option value={1}>APTA</option>
                  <option value={2}>APTA CON CONDICIONES</option>
                  <option value={3}>PENDIENTE</option>
                </select>
                Incidencias:
                <textarea
                  className="form-control"
                  rows="2"
                  name="incidencia"
                  value={filaSeleccionada && filaSeleccionada.incidencia}
                  onChange={handleChange}
                />
                Propuestas:
                <textarea
                  className="form-control"
                  rows="2"
                  name="propuesta"
                  value={filaSeleccionada && filaSeleccionada.propuesta}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                {filaSeleccionada && filaSeleccionada.estatus === null ? (
                  <div className="alert alert-danger mt-1" role="alert">
                    SIN EVALUAR
                  </div>
                ) : (
                  <>
                    <div className="table-responsive table-condensed table-sm tabla mt-2">
                      {filaSeleccionada && filaSeleccionada.estatus !== null ? (
                        <>
                          <table
                            className="table table-hover"
                            style={{ fontSize: 11, textAlign: "center" }}
                          >
                            <thead className="thead-light">
                              <tr>
                                <th colSpan="3">
                                  Realizado por:{" "}
                                  {filaSeleccionada && filaSeleccionada.asesorC}
                                </th>
                              </tr>
                              <tr>
                                <th>Estatus</th>
                                <th>Incidencia</th>
                                <th>Propuesta</th>
                              </tr>
                            </thead>
                            <tbody style={{ backgroundColor: "white" }}>
                              <tr>
                                <td>
                                  {filaSeleccionada &&
                                    filaSeleccionada.estatus === "3" ? (
                                    <p>PENDIENTE</p>
                                  ) : (
                                    <p>APTA</p>
                                  )}
                                </td>
                                <td>
                                  {filaSeleccionada &&
                                    filaSeleccionada.incidencia}
                                </td>
                                <td>
                                  {filaSeleccionada &&
                                    filaSeleccionada.propuesta}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <div className="alert alert-warning" role="alert">
                          Pendiente de evaluar
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="card-footer">
            {actionCalidad ? (
              <button
                disabled={loading ? true : false}
                className="btn btn-primary active float-right"
                type="submit"
              >
                {loading ? "Espere..." : "Guardar"}
              </button>
            ) : (
              <></>
            )}
            <Button
              className="btn btn-secondary btn-sm active float-right"
              onClick={() => openClose_ModalCalidad()}
            >
              Cerrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  const fecha_muestreo = (
    <div className={styles.modal}>
      <div className="card card-default">
        <div className="card-header">
          <h6 className="font-weight-bold text-secondary">
            Fecha de ejecución
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={6}>
                  Codigo:
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    id="cod_Prod"
                    name="cod_Prod"
                    value={filaSeleccionada && filaSeleccionada.cod_Prod}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  Campo:
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    id="cod_Campo"
                    name="cod_Campo"
                    value={filaSeleccionada && filaSeleccionada.cod_Campo}
                  />
                </Grid>
                {actionFecha_ejecucion ? (
                  <>
                    <Grid item xs={12} md={12} lg={6}>
                      Fecha de ejecución:
                      <input
                        type="date"
                        className="form-control"
                        name="fecha_ejecucion"
                        onChange={handleChange}
                        autoComplete="off" 
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                      Sector:
                      <input
                        type="text"
                        className="form-control"
                        name="sector"
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      />
                    </Grid>                
                  </>
                ) : null}
              </Grid>
            </div>

            <div className="col-md-12 mt-2">
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  <div
                    className="table-responsive table-condensed table-sm tabla"
                    style={{ fontSize: 11, textAlign: "center" }}
                  >
                    <table className="table table-hover" id="tblSectores">
                      <thead className="thead-light">
                        <tr>
                          <th colSpan="2">
                            Asesor{" "}
                            {filaSeleccionada && filaSeleccionada.asesorI}
                          </th>
                        </tr>
                        <tr>
                          <th>Sectores agregados</th>
                          <th>Borrar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectores.length > 0
                          ? sectores.map((item) => (
                            <React.Fragment key={item.id}>
                              <tr>
                                <td>{item.sector}</td>
                                <td>
                                  {actionFecha_ejecucion ? (
                                    <>
                                      <Button
                                        className="m-0 p-0"
                                        color="secondary"
                                        endIcon={<Clear />}
                                        onClick={() => deleteSector(item.id)}
                                      ></Button>
                                    </>
                                  ) : null}
                                </td>
                              </tr>
                            </React.Fragment>
                          ))
                          : null}
                      </tbody>
                    </table>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        <div className="card-footer">
          {actionFecha_ejecucion ? (
            <>
              <Button
                className="btn btn-primary btn-sm active float-right"
                onClick={() => peticionPutFecha_Muestreo()}
                disabled={loading ? true : false}
              >
                {loading ? "Espere..." : "Guardar"}
              </Button>
            </>
          ) : null}
          <Button
            className="btn btn-secondary btn-sm active float-right"
            onClick={() => openClose_ModalFecha_muestreo()}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );

  const liberar_muestreo = (
    <div className={styles.modal}>
      <div className="card card-default">
        <div className="card-header"></div>
        <div className="card-body">
          <h6>¿Esta seguro de liberar esta solicitud?</h6>
        </div>
        <div className="card-footer float-right">
          <form onSubmit={peticionPatchLiberar}>
            <button
              disabled={loading ? true : false}
              className="btn btn-primary active float-right"
              type="submit"
            >
              {loading ? "Espere..." : "SI"}
            </button>
            <button
              className="btn btn-secondary active float-right"
              onClick={() => openClose_ModalLiberar()}
            >
              NO
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const agregar_analisis = (
    <div className={styles.modal_lg}>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form onSubmit={enviarAnalisis}>
            <div class="modal-header">
              <h5 className="font-weight-bold text-secondary">
                Análisis de Residuos de Plaguicidas
              </h5>
            </div>
            <div class="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group-sm">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12} lg={4}>
                        Codigo:
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="cod_Prod"
                          value={filaSeleccionada && filaSeleccionada.cod_Prod}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={4}>
                        Campo:
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="cod_Campo"
                          value={filaSeleccionada && filaSeleccionada.cod_Campo}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={4}>
                        Sector (es):
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="sector"
                          value={filaSeleccionada && filaSeleccionada.sector}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={6}>
                        Cultivo:
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="tipo"
                          value={filaSeleccionada && filaSeleccionada.tipo}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={6}>
                        Variedad:
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="producto"
                          value={filaSeleccionada && filaSeleccionada.producto}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={6}>
                        Folio:
                        <input
                          type="text"
                          className={styles.input}
                          className="form-control"
                          required
                          name="folio"
                          onChange={handleChangeAnalisis}
                          autoComplete="off"
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={6}>
                        Zona:
                        <select
                          name="codZona"
                          id="codZona"
                          className="form-control"
                          onChange={handleChangeAnalisis}
                          onClick={cargarZonas}
                        >
                          <option value={0}>Seleccione</option>
                          {zonas.map((item) => (
                            <option key={item.codigo} value={item.codigo}>
                              {item.descZona}
                            </option>
                          ))}
                        </select>
                      </Grid>
                      <Grid item xs={12} md={12} lg={6}>
                        Fecha de envio:
                        <input
                          required
                          type="date"
                          className="form-control"
                          name="fecha_envio"
                          onChange={handleChangeAnalisis}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={6}>
                        Fecha de entrega:
                        <input
                          type="date"
                          required
                          className="form-control"
                          name="fecha_entrega"
                          onChange={handleChangeAnalisis}
                          autoComplete="off"
                        />
                      </Grid>

                      <Grid item xs={12} md={12} lg={6}>
                        Parte Muestreada:
                        <select
                          name="parteMuestreada"
                          className="form-control"
                          onChange={handleChangeAnalisis}
                        >
                          <option value={0}>Seleccione</option>
                          <option value={"J"}>FOLLAJE</option>
                          <option value={"F"}>FRUTA</option>
                          <option value={"S"}>SUELO</option>
                        </select>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6}>
                        Número de análisis:
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="num_analisis"
                          autoComplete="off"
                          value={
                            filaSeleccionada && filaSeleccionada.num_analisis
                          }
                        />
                      </Grid>
                    </Grid>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group-sm">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12} lg={6}>
                        Estatus:
                        <select
                          name="estatus"
                          id="estatus"
                          className="form-control"
                          onChange={handleChangeEstatus}
                        >
                          <option value={0}>Seleccione</option>
                          <option value={"R"}>CON RESIDUOS</option>
                          <option value={"P"}>EN PROCESO</option>
                          <option value={"F"}>FUERA DE LIMITE</option>
                          <option value={"L"}>LIBERADO</option>
                        </select>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6}>
                        Laboratorio:
                        <select
                          name="laboratorio"
                          id="laboratorio"
                          className="form-control"
                          onChange={handleChangeAnalisis}
                        >
                          <option value={0}>Seleccione</option>
                          <option value={"AGQ"}>AGQ</option>
                          <option value={"AGROLAB"}>AGROLAB</option>
                          <option value={"PRIMUSLAB"}>PRIMUSLAB</option>
                        </select>
                      </Grid>

                      {estatus === "F" && (
                        <>
                          <Grid item xs={12} md={12} lg={12}>
                            <Grid container spacing={3}>
                              <Grid item xs={6} md={6} lg={6}>
                                Liberación USA (dias):
                                <input
                                  type="text"
                                  autoComplete="off"
                                  className="form-control"
                                  name="liberacionUSA"
                                  value={liberacionUSA}
                                  onChange={(e) =>
                                    setLiberacionUSA(e.target.value)
                                  }
                                />
                              </Grid>

                              <Grid item xs={6} md={6} lg={6}>
                                Liberación EU (dias):
                                <input
                                  type="text"
                                  autoComplete="off"
                                  className="form-control"
                                  name="liberacionEU"
                                  value={liberacionEU}
                                  onChange={(e) =>
                                    setLiberacionEU(e.target.value)
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12} md={12} lg={6}>
                        <input
                          type="checkbox"
                          name="traza"
                          defaultChecked={false}
                          className="mt-4"
                          onChange={handleChangeAnalisis}
                        />{" "}
                        Traza
                      </Grid>

                      <Grid item xs={12} md={12} lg={6}>
                        <input
                          type="checkbox"
                          name="organico"
                          defaultChecked={false}
                          className="mt-4"
                          onChange={handleChangeAnalisis}
                        />{" "}
                        Organico
                      </Grid>

                      <Grid item xs={12} md={12} lg={12}>
                        Comentarios:
                        <textarea
                          className="form-control"
                          id="comentarios"
                          rows="3"
                          name="comentarios"
                          onChange={handleChangeAnalisis}
                          autoComplete="off"
                        />
                      </Grid>

                      {estatus === "L" && (
                        <>
                          <Grid item xs={12} md={12} lg={6}>
                            <input
                              type="checkbox"
                              name="liberaDocumento"
                              defaultChecked={false}
                              className="mt-4"
                              onChange={handleChangeAnalisis}
                            />{" "}
                            Libera sin PDF
                          </Grid>
                        </>
                      )}

                      {/*   <Grid item xs={12} md={12} lg={12}>
                        PDF
                        <input
                          type="file"
                          name="file"
                          className="m-2"
                          onChange={(e) => subirFile(e.target.files)}
                        />
                      </Grid> */}
                    </Grid>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              {/*   {
        file? */}
              <button
                disabled={loading ? true : false}
                className="btn btn-primary active float-right"
                type="submit"
              >
                {loading ? "Espere..." : "Guardar"}
              </button>
              {/*   :
        null
      } */}

              <button
                className="btn btn-secondary active float-right"
                onClick={() => openClose_ModalAnalisis()}
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const liberar_tarjeta = (
    <div className={styles.modal}>
      <div className="card card-default">
        <form onSubmit={peticionPatchTarjeta}>
          <div className="card-header">
            <h6 className="font-weight-bold text-secondary">
              Entrega de tarjeta
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                Codigo
                <input
                  type="text"
                  disabled
                  className="form-control"
                  id="cod_Prod"
                  name="cod_Prod"
                  value={filaSeleccionada && filaSeleccionada.cod_Prod}
                />
              </div>

              <div className="col-md-6 col-sm-12">
                Campo
                <input
                  type="text"
                  disabled
                  className="form-control"
                  id="cod_Campo"
                  name="cod_Campo"
                  value={filaSeleccionada && filaSeleccionada.cod_Campo}
                />
              </div>

              <div className="col-md-12 col-sm-12 mt-1">
                {filaSeleccionada && filaSeleccionada.tarjeta === "N" ? (
                  <div className="alert alert-danger" role="alert">
                    No entregar tarjeta
                  </div>
                ) : (
                  <>
                    {filaSeleccionada &&
                      filaSeleccionada.tarjeta === "S" &&
                      filaSeleccionada &&
                      filaSeleccionada.idAnalisis_Residuo === null &&
                      filaSeleccionada &&
                      filaSeleccionada.idAgen_Tarjeta === null ? (
                      <>
                        <div className="alert alert-danger" role="alert">
                          No entregar tarjeta
                        </div>
                        <div className="list-group">
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                              En espera de resultado de análisis
                            </li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        {filaSeleccionada &&
                          filaSeleccionada.analisis === "L" ? (
                          <>
                            <div className="alert alert-success" role="alert">
                              Entregar tarjeta
                            </div>
                          </>
                        ) : (
                          <>
                            {filaSeleccionada &&
                              filaSeleccionada.analisis !== null &&
                              filaSeleccionada &&
                              filaSeleccionada.analisis !== "L" &&
                              filaSeleccionada &&
                              filaSeleccionada.idAgen_Tarjeta === null ? (
                              <>
                                <div
                                  className="alert alert-danger"
                                  role="alert"
                                >
                                  No entregar tarjeta
                                </div>
                                <div className="list-group">
                                  <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                      Análisis no Liberado
                                    </li>
                                  </ul>
                                </div>
                              </>
                            ) : (
                              <>
                                {filaSeleccionada &&
                                  filaSeleccionada.idAgen_Tarjeta !== null ? (
                                  <>
                                    <div
                                      className="alert alert-success"
                                      role="alert"
                                    >
                                      Entregar tarjeta
                                    </div>

                                    <div className="list-group">
                                      <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                          Autorizado por:{" "}
                                          {filaSeleccionada &&
                                            filaSeleccionada.agen_Tarjeta}
                                        </li>
                                        <li className="list-group-item">
                                          {filaSeleccionada &&
                                            filaSeleccionada.liberar_Tarjeta}
                                        </li>
                                        <li className="list-group-item">
                                          {filaSeleccionada &&
                                            filaSeleccionada.imageAutoriza !==
                                            null ? (
                                            <>
                                              <img
                                                id="screenShot"
                                                src={rutaFile}
                                                alt=""
                                              />
                                            </>
                                          ) : null}
                                        </li>
                                      </ul>
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    className="alert alert-warning"
                                    role="alert"
                                  >
                                    Pendiente
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="col-md-12 col-sm-12 mt-2">
                {actionTarjeta ? (
                  <>
                    {filaSeleccionada &&
                      filaSeleccionada.idAgen_Tarjeta === null ? (
                      <>
                        {/*  <input type="checkbox" name="tarjeta"
                              defaultChecked={false} className="m-2"
                                  onChange={handleChange}
                              /> Autorizar  */}
                        Justifique:
                        <textarea
                          required
                          className="form-control"
                          id="liberar_Tarjeta"
                          rows="3"
                          name="liberar_Tarjeta"
                          onChange={handleChange}
                          autoComplete="off"
                        />
                        <br />
                        Evidencia
                        <input
                          type="file"
                          name="imagen"
                          className="m-2"
                          onChange={(e) => subirFile(e.target.files)}
                        />
                      </>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="card-footer">
            {actionTarjeta ? (
              <>
                <button
                  disabled={loading ? true : false}
                  className="btn btn-primary btn-sm active float-right"
                  type="submit"
                >
                  {loading ? "Espere..." : "Autorizar"}
                </button>
              </>
            ) : null}
            <button
              className="btn btn-secondary btn-sm active float-right mr-2"
              onClick={() => openClose_ModalTarjeta()}
            >
              Cancelar
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
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChangeTab}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="1" label="Todo" />
              <Tab value="2" label="Re - Muestreo" />
              <Tab value="3" label="Pendientes de Análisis" />
            </Tabs>
          </Box>

          <div>
            {value === "1" ? (
              <Paper className={styles.paper}>
                <Grid item xs={12} md={12} lg={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Toolbar>
                        <Typography
                          variant="h6"
                          id="tableTitle"
                          component="div"
                        >
                          Muestreos solicitados
                        </Typography>
                      </Toolbar>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <input
                        type="text"
                        placeholder="Buscar productor..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control"
                        name="searchText"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <div className="table-responsive table-condensed table-sm">
                  <table
                    className="table table-hover table-sm table-striped"
                    style={{ fontSize: 10, textAlign: "center" }}>
                    <thead className="table-primary">
                      <tr>
                        <th>Editar</th>
                        <th>Código</th>
                        <th>Productor</th>
                        <th>Campo</th>
                        <th>Sector(es)</th>
                        <th>Compra-oprtu</th>
                        <th>Fecha/solicitud</th>
                        <th>Inicio/cosecha</th>
                        <th>Ubicación</th>
                        <th>Teléfono</th>
                        <th>CajasEstimadas</th>
                        <th>Autoriza/producción</th>
                        <th>Fecha/muestreo</th>
                        <th>Análisis</th>
                        <th>Calidad</th>
                        <th>Tarjeta</th>
                        <th>Re-asignar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabledata.filter(searchData(search)).map((row, index) => {
                         

                        return (
                          <tr
                            
                            
                            key={index} 
                            className={styles.tablecell}
                          >
                            <td>
                              {actionEditar ? (
                                <>
                                  <Button
                                    endIcon={<EditTwoToneIcon />}
                                    onClick={() =>
                                      seleccionarRegistro(
                                        row,
                                        "Editar_muestreo"
                                      )
                                    }
                                  ></Button>
                                </>
                              ) : (
                                <></>
                              )}
                            </td>
                            <td component="th" scope="row" padding="none">
                              {row.cod_Prod}
                              <br />
                              {row.abrevP}
                            </td>
                            <td align="center">{row.productor}</td>
                            <td align="center">
                              {row.cod_Campo} - {row.campo}
                            </td>
                            <td align="center">{row.sector}</td>

                            {row.compras_oportunidad === "S" ? (
                              <td align="center"> SI </td>
                            ) : (
                              <td align="center"> NO </td>
                            )}

                            <td align="center">
                              {row.fecha_solicitud !== null ? (
                                <>
                                  {moment(row.fecha_solicitud).format("L")}
                                </>
                              ) : (
                                <></>
                              )}
                            </td>

                            <td align="center">
                              {row.inicio_cosecha !== null ? (
                                <>
                                  {moment(row.inicio_cosecha).format("L")}
                                </>
                              ) : (
                                <></>
                              )}
                            </td>

                            <td align="center">{row.ubicacion}</td>
                            <td align="center">{row.telefono}</td>
                            <td align="center">{row.cajasEstimadas}</td>

                            {row.liberacion === "S" ? (
                              <td align="center" bgcolor="LightGreen">
                                {" "}
                                <DoneIcon />{" "}
                              </td>
                            ) : (
                              <td align="center" bgcolor="Pink">
                                {actionLiberar ? (
                                  <>
                                    <Button
                                      variant="primary"
                                      endIcon={<AddBox />}
                                      onClick={() =>
                                        seleccionarRegistro(
                                          row,
                                          "Liberar_muestreo"
                                        )
                                      }
                                    ></Button>
                                  </>
                                ) : (
                                  <PriorityHighIcon />
                                )}
                              </td>
                            )}

                            {row.idMuestreo !== null &&
                              row.fecha_ejecucion !== null ? (
                              <>
                                <td align="center">
                                  {" "}
                                  {moment(row.fecha_ejecucion).format("L")}
                                  <br />
                                  <Button
                                    variant="primary"
                                    endIcon={<AddBox />}
                                    onClick={() =>
                                      seleccionarRegistro(
                                        row,
                                        "Fecha_muestreo"
                                      )
                                    }
                                  ></Button>
                                </td>
                              </>
                            ) : (
                              <td align="center" bgcolor="Pink">
                                {row.idMuestreo !== null &&
                                  actionFecha_ejecucion ? (
                                  <>
                                    <Button
                                      variant="primary"
                                      endIcon={<AddBox />}
                                      onClick={() =>
                                        seleccionarRegistro(
                                          row,
                                          "Fecha_muestreo"
                                        )
                                      }
                                    ></Button>
                                  </>
                                ) : (
                                  <PriorityHighIcon />
                                )}
                              </td>
                            )}

                            {row.idAnalisis_Residuo !== null ? (
                              <>
                                {row.analisis === "R" ? (
                                  <td align="center" bgcolor="Tomato">
                                    {" "}
                                    CON RESIDUOS
                                    {actionAnalisis ? (
                                      <>
                                        <Button
                                          variant="primary"
                                          endIcon={<AddBox />}
                                          onClick={() =>
                                            seleccionarRegistro(
                                              row,
                                              "Analisis_residuo"
                                            )
                                          }
                                        ></Button>
                                      </>
                                    ) : (
                                      false
                                    )}
                                  </td>
                                ) : (
                                  <>
                                    {row.analisis === "P" ? (
                                      <td
                                        align="center"
                                        bgcolor="Gainsboro"
                                      >
                                        {" "}
                                        EN PROCESO
                                        {actionAnalisis ? (
                                          <>
                                            <Button
                                              variant="primary"
                                              endIcon={<AddBox />}
                                              onClick={() =>
                                                seleccionarRegistro(
                                                  row,
                                                  "Analisis_residuo"
                                                )
                                              }
                                            ></Button>
                                          </>
                                        ) : (
                                          false
                                        )}
                                      </td>
                                    ) : (
                                      <>
                                        {row.analisis === "F" ? (
                                          <td
                                            align="center"
                                            bgcolor="yellow"
                                          >
                                            {" "}
                                            FUERA LIMITE
                                            {actionAnalisis ? (
                                              <>
                                                <Button
                                                  variant="primary"
                                                  endIcon={<AddBox />}
                                                  onClick={() =>
                                                    seleccionarRegistro(
                                                      row,
                                                      "Analisis_residuo"
                                                    )
                                                  }
                                                ></Button>
                                              </>
                                            ) : (
                                              false
                                            )}
                                          </td>
                                        ) : (
                                          <>
                                            <td
                                              align="center"
                                              bgcolor="LightGreen"
                                            >
                                              {" "}
                                              LIBERADO
                                              {actionAnalisis ? (
                                                <>
                                                  <Button
                                                    variant="primary"
                                                    endIcon={<AddBox />}
                                                    onClick={() =>
                                                      seleccionarRegistro(
                                                        row,
                                                        "Analisis_residuo"
                                                      )
                                                    }
                                                  ></Button>
                                                </>
                                              ) : (
                                                false
                                              )}
                                            </td>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <td align="center" bgcolor="Pink">
                                  {actionAnalisis ? (
                                    <>
                                      <td align="center">
                                        <Button
                                          variant="primary"
                                          endIcon={<AddBox />}
                                          onClick={() =>
                                            seleccionarRegistro(
                                              row,
                                              "Analisis_residuo"
                                            )
                                          }
                                        ></Button>
                                      </td>
                                    </>
                                  ) : (
                                    <PriorityHighIcon />
                                  )}
                                </td>
                              </>
                            )}

                            {row.estatus !== null ? (
                              <>
                                {row.estatus === "3" ? (
                                  <td align="center" bgcolor="tomato">
                                    PENDIENTE
                                    <Button
                                      variant="primary"
                                      endIcon={<AddBox />}
                                      onClick={() =>
                                        seleccionarRegistro(row, "Calidad")
                                      }
                                    ></Button>
                                    {row.asesorCS}
                                  </td>
                                ) : (
                                  <td align="center" bgcolor="LightGreen">
                                    APTA
                                    <Button
                                      variant="primary"
                                      endIcon={<AddBox />}
                                      onClick={() =>
                                        seleccionarRegistro(row, "Calidad")
                                      }
                                    ></Button>
                                    {row.asesorCS}
                                  </td>
                                )}
                              </>
                            ) : (
                              <td align="center" bgcolor="Pink">
                                <Button
                                  variant="primary"
                                  endIcon={<AddBox />}
                                  onClick={() =>
                                    seleccionarRegistro(row, "Calidad")
                                  }
                                ></Button>
                                {row.asesorCS}
                              </td>
                            )}

                            {row.analisis === "L" ? (
                              <>
                                <td align="center" bgcolor="LightGreen">
                                  <Button
                                    variant="primary"
                                    endIcon={<AddBox />}
                                    onClick={() =>
                                      seleccionarRegistro(row, "Tarjeta")
                                    }>
                                    <DoneIcon />
                                  </Button>
                                </td>
                              </>
                            ) : (
                              <>
                                {row.idAgen_Tarjeta !== null ? (
                                  <>
                                    <td align="center" bgcolor="LightGreen">
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(
                                            row,
                                            "Tarjeta"
                                          )
                                        }
                                      >
                                        <DoneIcon />
                                      </Button>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td align="center" bgcolor="Pink">
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(
                                            row,
                                            "Tarjeta"
                                          )
                                        }
                                      ></Button>
                                    </td>
                                  </>
                                )}
                              </>
                            )}

                            {otros === false ? (
                              <td align="center">
                                <Button
                                  variant="primary"
                                  endIcon={<AddBox />}
                                  onClick={() =>
                                    seleccionarRegistro(row, "Reasignar")
                                  }
                                ></Button>
                              </td>
                            ) : null}
                          </tr> 
                          
                        );
                      })}                                        
                    </tbody>
                  
                  </table>
               
                </div>
              </Paper>
            ) : null}
          </div>

          <div>
            {value === "2" ? (
              <Paper className={styles.paper}>
                <Grid item xs={12} md={12} lg={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Toolbar>
                        <Typography
                          variant="h6"
                          id="tableTitle"
                          component="div"
                        >
                          Re - Muestreos
                        </Typography>
                      </Toolbar>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <input
                        type="text"
                        placeholder="Buscar productor..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control"
                        name="searchText"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <TableContainer>
                  <div className="table-responsive table-condensed table-sm">
                    <table
                      className="table table-hover table-sm table-striped"
                      style={{ fontSize: 10, textAlign: "center" }}>

                      <thead className="table-primary">
                        <tr>
                          <th>Editar</th>
                          <th>Código</th>
                          <th>Productor</th>
                          <th>Campo</th>
                          <th>Sector(es)</th>
                          <th>Compra-oprtu</th>
                          <th>Fecha/solicitud</th>
                          <th>Inicio/cosecha</th>
                          <th>Ubicación</th>
                          <th>Teléfono</th>
                          <th>CajasEstimadas</th>
                          <th>Autoriza/producción</th>
                          <th>Fecha/muestreo</th>
                          <th>Análisis</th>
                          <th>Calidad</th>
                          <th>Tarjeta</th>
                          <th>Re-asignar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabledataRM.filter(searchData(search)).map((row, index) => {                          

                          return (
                            <tr
                             
                              key={index} 
                              className={styles.tablecell}
                            >
                              <td>
                                {actionEditar ? (
                                  <>
                                    <Button
                                      endIcon={<EditTwoToneIcon />}
                                      onClick={() =>
                                        seleccionarRegistro(
                                          row,
                                          "Editar_muestreo"
                                        )
                                      }
                                    ></Button>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </td>
                              <td component="th" scope="row" padding="none">
                                {row.cod_Prod}
                                <br />
                                {row.abrevP}
                              </td>
                              <td align="center">{row.productor}</td>
                              <td align="center">
                                {row.cod_Campo} - {row.campo}
                              </td>
                              <td align="center">{row.sector}</td>

                              {row.compras_oportunidad === "S" ? (
                                <td align="center"> SI </td>
                              ) : (
                                <td align="center"> NO </td>
                              )}

                              <td align="center">
                                {row.fecha_solicitud !== null ? (
                                  <>
                                    {moment(row.fecha_solicitud).format("L")}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </td>

                              <td align="center">
                                {row.inicio_cosecha !== null ? (
                                  <>
                                    {moment(row.inicio_cosecha).format("L")}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </td>

                              <td align="center">{row.ubicacion}</td>
                              <td align="center">{row.telefono}</td>
                              <td align="center">{row.cajasEstimadas}</td>

                              {row.liberacion === "S" ? (
                                <td align="center" bgcolor="LightGreen">
                                  {" "}
                                  <DoneIcon />{" "}
                                </td>
                              ) : (
                                <td align="center" bgcolor="Pink">
                                  {actionLiberar ? (
                                    <>
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(
                                            row,
                                            "Liberar_muestreo"
                                          )
                                        }
                                      ></Button>
                                    </>
                                  ) : (
                                    <PriorityHighIcon />
                                  )}
                                </td>
                              )}

                              {row.idMuestreo !== null &&
                                row.fecha_ejecucion !== null ? (
                                <>
                                  <td align="center">
                                    {" "}
                                    {moment(row.fecha_ejecucion).format("L")}
                                    <br />
                                    <Button
                                      variant="primary"
                                      endIcon={<AddBox />}
                                      onClick={() =>
                                        seleccionarRegistro(
                                          row,
                                          "Fecha_muestreo"
                                        )
                                      }
                                    ></Button>
                                  </td>
                                </>
                              ) : (
                                <td align="center" bgcolor="Pink">
                                  {row.idMuestreo !== null &&
                                    actionFecha_ejecucion ? (
                                    <>
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(
                                            row,
                                            "Fecha_muestreo"
                                          )
                                        }
                                      ></Button>
                                    </>
                                  ) : (
                                    <PriorityHighIcon />
                                  )}
                                </td>
                              )}

                              {row.idAnalisis_Residuo !== null ? (
                                <>
                                  {row.analisis === "R" ? (
                                    <td align="center" bgcolor="Tomato">
                                      {" "}
                                      CON RESIDUOS
                                      {actionAnalisis ? (
                                        <>
                                          <Button
                                            variant="primary"
                                            endIcon={<AddBox />}
                                            onClick={() =>
                                              seleccionarRegistro(
                                                row,
                                                "Analisis_residuo"
                                              )
                                            }
                                          ></Button>
                                        </>
                                      ) : (
                                        false
                                      )}
                                    </td>
                                  ) : (
                                    <>
                                      {row.analisis === "P" ? (
                                        <td
                                          align="center"
                                          bgcolor="Gainsboro"
                                        >
                                          {" "}
                                          EN PROCESO
                                          {actionAnalisis ? (
                                            <>
                                              <Button
                                                variant="primary"
                                                endIcon={<AddBox />}
                                                onClick={() =>
                                                  seleccionarRegistro(
                                                    row,
                                                    "Analisis_residuo"
                                                  )
                                                }
                                              ></Button>
                                            </>
                                          ) : (
                                            false
                                          )}
                                        </td>
                                      ) : (
                                        <>
                                          {row.analisis === "F" ? (
                                            <td
                                              align="center"
                                              bgcolor="yellow"
                                            >
                                              {" "}
                                              FUERA LIMITE
                                              {actionAnalisis ? (
                                                <>
                                                  <Button
                                                    variant="primary"
                                                    endIcon={<AddBox />}
                                                    onClick={() =>
                                                      seleccionarRegistro(
                                                        row,
                                                        "Analisis_residuo"
                                                      )
                                                    }
                                                  ></Button>
                                                </>
                                              ) : (
                                                false
                                              )}
                                            </td>
                                          ) : (
                                            <>
                                              <td
                                                align="center"
                                                bgcolor="LightGreen"
                                              >
                                                {" "}
                                                LIBERADO
                                                {actionAnalisis ? (
                                                  <>
                                                    {/*    <Link to={`/analisis/${row.idMuestreo}`}>
                    <AddBox />
                  </Link>  */}

                                                    <Button
                                                      variant="primary"
                                                      endIcon={<AddBox />}
                                                      onClick={() =>
                                                        seleccionarRegistro(
                                                          row,
                                                          "Analisis_residuo"
                                                        )
                                                      }
                                                    ></Button>
                                                  </>
                                                ) : (
                                                  false
                                                )}
                                              </td>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <td align="center" bgcolor="Pink">
                                    {actionAnalisis ? (
                                      <>
                                        <td align="center">
                                          <Button
                                            variant="primary"
                                            endIcon={<AddBox />}
                                            onClick={() =>
                                              seleccionarRegistro(
                                                row,
                                                "Analisis_residuo"
                                              )
                                            }
                                          ></Button>
                                        </td>
                                      </>
                                    ) : (
                                      <PriorityHighIcon />
                                    )}
                                  </td>
                                </>
                              )}

                              {row.estatus !== null ? (
                                <>
                                  {row.estatus === "3" ? (
                                    <td align="center" bgcolor="tomato">
                                      PENDIENTE
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(row, "Calidad")
                                        }
                                      ></Button>
                                      {row.asesorCS}
                                    </td>
                                  ) : (
                                    <td align="center" bgcolor="LightGreen">
                                      APTA
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(row, "Calidad")
                                        }
                                      ></Button>
                                      {row.asesorCS}
                                    </td>
                                  )}
                                </>
                              ) : (
                                <td align="center" bgcolor="Pink">
                                  <Button
                                    variant="primary"
                                    endIcon={<AddBox />}
                                    onClick={() =>
                                      seleccionarRegistro(row, "Calidad")
                                    }
                                  ></Button>
                                  {row.asesorCS}
                                </td>
                              )}

                              {row.analisis === "L" ? (
                                <>
                                  <td align="center" bgcolor="LightGreen">
                                    <Button
                                      variant="primary"
                                      endIcon={<AddBox />}
                                      onClick={() =>
                                        seleccionarRegistro(row, "Tarjeta")
                                      }
                                    >
                                      <DoneIcon />
                                    </Button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  {row.idAgen_Tarjeta !== null ? (
                                    <>
                                      <td align="center" bgcolor="LightGreen">
                                        <Button
                                          variant="primary"
                                          endIcon={<AddBox />}
                                          onClick={() =>
                                            seleccionarRegistro(
                                              row,
                                              "Tarjeta"
                                            )
                                          }
                                        >
                                          <DoneIcon />
                                        </Button>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td align="center" bgcolor="Pink">
                                        <Button
                                          variant="primary"
                                          endIcon={<AddBox />}
                                          onClick={() =>
                                            seleccionarRegistro(
                                              row,
                                              "Tarjeta"
                                            )
                                          }
                                        ></Button>
                                      </td>
                                    </>
                                  )}
                                </>
                              )}

                              {otros === false ? (
                                <td align="center">
                                  <Button
                                    variant="primary"
                                    endIcon={<AddBox />}
                                    onClick={() =>
                                      seleccionarRegistro(row, "Reasignar")
                                    }
                                  ></Button>
                                </td>
                              ) : null}
                            </tr>
                          );
                        })}
                       
                      </tbody>
                    </table>
                  </div>
                </TableContainer>

              </Paper>
            ) : null}
          </div>

          <div>
            {value === "3" ? (
              <Paper className={styles.paper}>
                <Grid item xs={12} md={12} lg={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Toolbar>
                        <Typography
                          variant="h6"
                          id="tableTitle"
                          component="div"
                        >
                          Pendientes de análisis
                        </Typography>
                      </Toolbar>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <input
                        type="text"
                        placeholder="Buscar productor..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control"
                        name="searchText"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <TableContainer>
                  <div className="table-responsive table-condensed table-sm">
                    <table
                      className="table table-hover table-sm table-striped"
                      style={{ fontSize: 10, textAlign: "center" }}>
                      <thead className="table-primary">
                        <tr>
                          <th>Editar</th>
                          <th>Código</th>
                          <th>Productor</th>
                          <th>Campo</th>
                          <th>Sector(es)</th>
                          <th>Compra-oprtu</th>
                          <th>Fecha/solicitud</th>
                          <th>Inicio/cosecha</th>
                          <th>Ubicación</th>
                          <th>Teléfono</th>
                          <th>CajasEstimadas</th>
                          <th>Autoriza/producción</th>
                          <th>Fecha/muestreo</th>
                          <th>Análisis</th>
                          <th>Calidad</th>
                          <th>Tarjeta</th>
                          <th>Re-asignar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabledataP.filter(searchData(search)).map((row, index) => {
                         

                          return (
                            <tr
                             
                              tabIndex={-1}
                              key={index}c
                              className={styles.tablecell}
                            >
                              <td>
                                {actionEditar ? (
                                  <>
                                    <Button
                                      endIcon={<EditTwoToneIcon />}
                                      onClick={() =>
                                        seleccionarRegistro(
                                          row,
                                          "Editar_muestreo"
                                        )
                                      }
                                    ></Button>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </td>
                              <td component="th" scope="row" padding="none">
                                {row.cod_Prod}
                                <br />
                                {row.abrevP}
                              </td>
                              <td align="center">{row.productor}</td>
                              <td align="center">
                                {row.cod_Campo} - {row.campo}
                              </td>
                              <td align="center">{row.sector}</td>

                              {row.compras_oportunidad === "S" ? (
                                <td align="center"> SI </td>
                              ) : (
                                <td align="center"> NO </td>
                              )}

                              <td align="center">
                                {row.fecha_solicitud !== null ? (
                                  <>
                                    {moment(row.fecha_solicitud).format("L")}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </td>

                              <td align="center">
                                {row.inicio_cosecha !== null ? (
                                  <>
                                    {moment(row.inicio_cosecha).format("L")}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </td>

                              <td align="center">{row.ubicacion}</td>
                              <td align="center">{row.telefono}</td>
                              <td align="center">{row.cajasEstimadas}</td>

                              {row.liberacion === "S" ? (
                                <td align="center" bgcolor="LightGreen">
                                  {" "}
                                  <DoneIcon />{" "}
                                </td>
                              ) : (
                                <td align="center" bgcolor="Pink">
                                  {actionLiberar ? (
                                    <>
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(
                                            row,
                                            "Liberar_muestreo"
                                          )
                                        }
                                      ></Button>
                                    </>
                                  ) : (
                                    <PriorityHighIcon />
                                  )}
                                </td>
                              )}

                              {row.idMuestreo !== null &&
                                row.fecha_ejecucion !== null ? (
                                <>
                                  <td align="center">
                                    {" "}
                                    {moment(row.fecha_ejecucion).format("L")}
                                    <br />
                                    <Button
                                      variant="primary"
                                      endIcon={<AddBox />}
                                      onClick={() =>
                                        seleccionarRegistro(
                                          row,
                                          "Fecha_muestreo"
                                        )
                                      }
                                    ></Button>
                                  </td>
                                </>
                              ) : (
                                <td align="center" bgcolor="Pink">
                                  {row.idMuestreo !== null &&
                                    actionFecha_ejecucion ? (
                                    <>
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(
                                            row,
                                            "Fecha_muestreo"
                                          )
                                        }
                                      ></Button>
                                    </>
                                  ) : (
                                    <PriorityHighIcon />
                                  )}
                                </td>
                              )}

                              {row.idAnalisis_Residuo !== null ? (
                                <>
                                  {row.analisis === "R" ? (
                                    <td align="center" bgcolor="Tomato">
                                      {" "}
                                      CON RESIDUOS
                                      {actionAnalisis ? (
                                        <>
                                          <Button
                                            variant="primary"
                                            endIcon={<AddBox />}
                                            onClick={() =>
                                              seleccionarRegistro(
                                                row,
                                                "Analisis_residuo"
                                              )
                                            }
                                          ></Button>
                                        </>
                                      ) : (
                                        false
                                      )}
                                    </td>
                                  ) : (
                                    <>
                                      {row.analisis === "P" ? (
                                        <td
                                          align="center"
                                          bgcolor="Gainsboro"
                                        >
                                          {" "}
                                          EN PROCESO
                                          {actionAnalisis ? (
                                            <>
                                              <Button
                                                variant="primary"
                                                endIcon={<AddBox />}
                                                onClick={() =>
                                                  seleccionarRegistro(
                                                    row,
                                                    "Analisis_residuo"
                                                  )
                                                }
                                              ></Button>
                                            </>
                                          ) : (
                                            false
                                          )}
                                        </td>
                                      ) : (
                                        <>
                                          {row.analisis === "F" ? (
                                            <td
                                              align="center"
                                              bgcolor="yellow"
                                            >
                                              {" "}
                                              FUERA LIMITE
                                              {actionAnalisis ? (
                                                <>
                                                  <Button
                                                    variant="primary"
                                                    endIcon={<AddBox />}
                                                    onClick={() =>
                                                      seleccionarRegistro(
                                                        row,
                                                        "Analisis_residuo"
                                                      )
                                                    }
                                                  ></Button>
                                                </>
                                              ) : (
                                                false
                                              )}
                                            </td>
                                          ) : (
                                            <>
                                              <td
                                                align="center"
                                                bgcolor="LightGreen"
                                              >
                                                {" "}
                                                LIBERADO
                                                {actionAnalisis ? (
                                                  <>
                                                    {/*    <Link to={`/analisis/${row.idMuestreo}`}>
                    <AddBox />
                  </Link>  */}

                                                    <Button
                                                      variant="primary"
                                                      endIcon={<AddBox />}
                                                      onClick={() =>
                                                        seleccionarRegistro(
                                                          row,
                                                          "Analisis_residuo"
                                                        )
                                                      }
                                                    ></Button>
                                                  </>
                                                ) : (
                                                  false
                                                )}
                                              </td>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <td align="center" bgcolor="Pink">
                                    {actionAnalisis ? (
                                      <>
                                        <td align="center">
                                          <Button
                                            variant="primary"
                                            endIcon={<AddBox />}
                                            onClick={() =>
                                              seleccionarRegistro(
                                                row,
                                                "Analisis_residuo"
                                              )
                                            }
                                          ></Button>
                                        </td>
                                      </>
                                    ) : (
                                      <PriorityHighIcon />
                                    )}
                                  </td>
                                </>
                              )}

                              {row.estatus !== null ? (
                                <>
                                  {row.estatus === "3" ? (
                                    <td align="center" bgcolor="tomato">
                                      PENDIENTE
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(row, "Calidad")
                                        }
                                      ></Button>
                                      {row.asesorCS}
                                    </td>
                                  ) : (
                                    <td align="center" bgcolor="LightGreen">
                                      APTA
                                      <Button
                                        variant="primary"
                                        endIcon={<AddBox />}
                                        onClick={() =>
                                          seleccionarRegistro(row, "Calidad")
                                        }
                                      ></Button>
                                      {row.asesorCS}
                                    </td>
                                  )}
                                </>
                              ) : (
                                <td align="center" bgcolor="Pink">
                                  <Button
                                    variant="primary"
                                    endIcon={<AddBox />}
                                    onClick={() =>
                                      seleccionarRegistro(row, "Calidad")
                                    }
                                  ></Button>
                                  {row.asesorCS}
                                </td>
                              )}

                              {row.analisis === "L" ? (
                                <>
                                  <td align="center" bgcolor="LightGreen">
                                    <Button
                                      variant="primary"
                                      endIcon={<AddBox />}
                                      onClick={() =>
                                        seleccionarRegistro(row, "Tarjeta")
                                      }
                                    >
                                      <DoneIcon />
                                    </Button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  {row.idAgen_Tarjeta !== null ? (
                                    <>
                                      <td align="center" bgcolor="LightGreen">
                                        <Button
                                          variant="primary"
                                          endIcon={<AddBox />}
                                          onClick={() =>
                                            seleccionarRegistro(
                                              row,
                                              "Tarjeta"
                                            )
                                          }
                                        >
                                          <DoneIcon />
                                        </Button>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td align="center" bgcolor="Pink">
                                        <Button
                                          variant="primary"
                                          endIcon={<AddBox />}
                                          onClick={() =>
                                            seleccionarRegistro(
                                              row,
                                              "Tarjeta"
                                            )
                                          }
                                        ></Button>
                                      </td>
                                    </>
                                  )}
                                </>
                              )}

                              {otros === false ? (
                                <td align="center">
                                  <Button
                                    variant="primary"
                                    endIcon={<AddBox />}
                                    onClick={() =>
                                      seleccionarRegistro(row, "Reasignar")
                                    }
                                  ></Button>
                                </td>
                              ) : null}
                            </tr>
                          );
                        })}
                        
                      </tbody>
                    </table>
                  </div>
                </TableContainer>
              </Paper>
            ) : null}
          </div>

          <Modal open={modalCalidad} onClose={openClose_ModalCalidad}>
            {evaluar_calidad}
          </Modal>

          <Modal
            open={modalFecha_muestreo}
            onClose={openClose_ModalFecha_muestreo}
          >
            {fecha_muestreo}
          </Modal>

          <Modal open={modalLiberar} onClose={openClose_ModalLiberar}>
            {liberar_muestreo}
          </Modal>

          <Modal open={modalAnalisis} onClose={openClose_ModalAnalisis}>
            {agregar_analisis}
          </Modal>

          <Modal open={modalReasignar} onClose={openClose_ModalReasignar}>
            {reasignar_codigo}
          </Modal>

          <Modal open={modalTarjeta} onClose={openClose_ModalTarjeta}>
            {liberar_tarjeta}
          </Modal>

          <Modal open={modalEditar} onClose={openClose_ModalEditar}>
            {editar_muestreo}
          </Modal>
        </section>

      </div>
    </div>
  );
};
export default Muestreos;
