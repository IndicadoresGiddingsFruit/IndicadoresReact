import React, {useEffect,useState,forwardRef} from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import {FormControl,Select,MenuItem,Checkbox,FormControlLabel} from '@material-ui/core';
import {Modal,Grid, Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles' 
import moment from 'moment'
import 'moment/locale/es' // Pasar a español
import swal from 'sweetalert'
import Contenedor from '../Contenedor.jsx'
import PropTypes from 'prop-types';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import DoneIcon from '@material-ui/icons/Done';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { format } from 'date-fns';
import { act } from 'react-dom/test-utils';

const useStyles = makeStyles((theme) => ({
  root:{
    display:'flex'
  },
  
  toolbar: theme.mixins.toolbar,
  
  content: {
      flexGrow: 1,         
      padding: theme.spacing(3),
  },
  
  modal: {
    position: 'absolute',
    width: 400,
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },

  modal_lg: {
    position: 'absolute',
    width: 1000,
    height: 500,
  /*   backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5], */
    padding: theme.spacing(2, 4, 3),
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },

  iconos:{
    cursor: 'pointer'
  }, 

  paper: {
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center'    
  },

  table: {
    minWidth: 650,
  },

  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

  formControl: {    
    minWidth: 210,
  },
  
  input:{
    width:'100%',
    textTransform:'uppercase'
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: '', numeric: false, disablePadding: false, label: '' },
  { id: 'cod_prod', numeric: false, disablePadding: true, label: 'Código' }, 
  { id: 'productor', numeric: false, disablePadding: true, label: 'Productor' }, 
  { id: 'campo', numeric: false, disablePadding: false, label: 'Campo' },
  { id: 'sector', numeric: false, disablePadding: false, label: 'Sector(es)' },
  { id: 'compra_oprtu', numeric: true, disablePadding: false, label: 'Compra-oprtu' },
  { id: 'fecha_solicitud', numeric: true, disablePadding: false, label: 'Fecha solicitud' },
  { id: 'inicio_cosecha', numeric: true, disablePadding: false, label: 'Inicio cosecha' },
  { id: 'ubicacion', numeric: true, disablePadding: false, label: 'Ubicacion' },
  { id: 'telefono', numeric: true, disablePadding: false, label: 'Telefono' },
  { id: 'liberacion', numeric: true, disablePadding: false, label: 'Autoriza producción' },
  { id: 'fecha_muestreo', numeric: true, disablePadding: false, label: 'Fecha muestreo' },
  { id: 'analisis', numeric: true, disablePadding: false, label: 'Análisis' },
  { id: 'estatus', numeric: true, disablePadding: false, label: 'Calidad' },
  { id: '', numeric: true, disablePadding: false, label: '' },
  { id: 'tarjeta', numeric: true, disablePadding: false, label: 'Tarjeta' },
  { id: 're_asignar', numeric: true, disablePadding: false, label: 'Re-asignar' }
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  //filtros
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{fontSize: 11, textAlign: 'center'}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function searchTerm(term){
  return function(x){
    return x.cod_Prod.includes(term) || x.productor.toLowerCase().includes(term) || x.campo.toLowerCase().includes(term) || !term
  }
}

const Muestreos=(props)=>{  
  const styles=useStyles();
  const url="https://giddingsfruit.mx/ApiIndicadores/api/muestreo";  
  //const url="https://localhost:44344/api/muestreo";  
  const url_calidad="https://giddingsfruit.mx/ApiIndicadores/api/calidadmuestreo";
  const url_campos="https://giddingsfruit.mx/ApiIndicadores/api/campos";
  const url_analisis="https://giddingsfruit.mx/ApiIndicadores/api/analisis";
  const url_sector="https://giddingsfruit.mx/ApiIndicadores/api/muestreosector";
  const cookies = new Cookies(); 
  var cod_zona;
  const [liberacionUSA, setLiberacionUSA] = useState(0);
  const [liberacionEU, setLiberacionEU] = useState(0);
  const [f_envio, setf_envio] = useState(format(new Date(), "yyyy-MM-dd"));  
  const [f_entrega, setf_entrega] = useState(format(new Date(), "yyyy-MM-dd"));  
  const [loading,setLoading]=useState(false); 
    
  var [data, setData]= useState([]);    
  const [dataOriginal, setDataOriginal]=useState([]);
  const [tabledata,setTableData]=useState([]); 
  const[term,setTerm]=useState("");

  const [verAsesor,setverAsesor]=useState(true);
  const [verAsesorC,setverAsesorC]=useState(false);
  var [estatus, setEstatus] = useState(null); 
  const [zonas, setZonas] = useState([]);
  const [asesores, setasesores] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [idagens, setidagens] = useState([null]);
  const [asesorReasignado, setasesorReasignado] = useState(null);

  const [modalEditar,setmodalEditar]=useState(false);
  const [modalCalidad,setmodalCalidad]=useState(false);
  const [modalFecha_muestreo,setmodalFecha_muestreo]=useState(false);
  const [modalLiberar,setmodalLiberar]=useState(false); 
  const [modalAnalisis,setmodalAnalisis]=useState(false); 
  const [modalReasignar,setmodalReasignar]=useState(false); 
  const [modalTarjeta,setmodalTarjeta]=useState(false); 

  const [actionEditar, setactionEditar] = useState(false);
  const [actionLiberar, setactionLiberar] = useState(false);
  const [actionCalidad, setactionCalidad] = useState(false);
  const [actionFecha_ejecucion, setactionFecha_ejecucion] = useState(false);
  const [actionAnalisis, setactionAnalisis] = useState(false); 
  const [actionTarjeta, setactionTarjeta] = useState(false); 

  const [campos, setcampos] = useState([]);
  var opcion_campo;
  const [c_campo, setc_campo] = useState(null);
  const [campo, setcampo] = useState(null);
  const [loc, setloc] = useState(null);
  const [tipo, settipo] = useState(null);
  const [producto, setproducto] = useState(null);

  const [filaSeleccionada,setfilaSeleccionada]=useState({  
      sector: parseInt(),      
      fecha_ejecucion:  "",      
      liberacion: "",      
      estatus:  "",
      incidencia: "",
      propuesta:  "",
      num_analisis:parseInt(),
      analisis:"",
      tarjeta:"",
      liberar_Tarjeta:"",
      inicio_cosecha:"",
      telefono:""
  })    

  const [nvoanalisis,setNvoanalisis]=useState({  
      codZona:"",
      fecha_envio:f_envio,
      fecha_entrega:f_entrega,
      estatus:"",
      laboratorio:"",
      comentarios:"",
      idAgen:parseInt(cookies.get('IdAgen')),    
      folio:"",
      traza:""
  })    

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('cod_prod');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);    
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
  };
  
  const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = tabledata.map((n) => n.name);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
  };
  
  const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
  
      setSelected(newSelected);
  };
  
  const handleChangePage = (event, newPage) => {
      setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };
  
  const isSelected = (name) => selected.indexOf(name) !== -1;
  
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, tabledata.length - page * rowsPerPage);   

  const handleChange=e=>{  
  /*   console.log(e.target.value); */
        setasesorReasignado(e.target.value); 
        
        const {name, value}=e.target;    
        setfilaSeleccionada(prevState=>({
          ...prevState,
          [name]: value
        }));    
  }

  const handleChangeEstatus=e=>{    
    setEstatus(e.target.value);        
  
    const {name, value}=e.target;    
    setNvoanalisis(prevState=>({
      ...prevState,
      [name]: value
    })); 
  }

  const handleChangeAnalisis=e=>{  
    setf_envio(e.target.value);
    setf_entrega(e.target.value); 

    const {name, value}=e.target;    
    setNvoanalisis(prevState=>({
      ...prevState,
      [name]: value
    })); 
  }

  const handlerZonas= function(e){
    cod_zona=e.target.value;
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json")
    .then(res=>{ 
      setZonas(res.data);   
    })
  }

  const handlerCargarCampos= function(e){
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${filaSeleccionada.cod_Prod}/${0}`)
    .then(res=>{ 
      setcampos(res.data);         
      opcion_campo=e.target.value;
      handlerCargarinfo(opcion_campo);
     })
  }

  //info por campo
  const handlerCargarinfo= function(opcion_campo){     
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${filaSeleccionada.cod_Prod}/${opcion_campo}`)
    .then(res=>{   
    for(const dataObj of res.data)
    {
    setc_campo(dataObj.cod_Campo);
    setcampo(dataObj.campo);
    setloc(dataObj.ubicacion);
    settipo(dataObj.tipo);
    setproducto(dataObj.producto);
  }
})   
}

const peticionPutEditar=async(e)=>{   
  e.preventDefault();

  await axios.put(url+`/${filaSeleccionada.idMuestreo}/${cookies.get('IdAgen')}/${0}`,filaSeleccionada)
  .then(response=>{
    console.log(response);

    var dataNueva= data;
    console.log(data);
    dataNueva.map(item=>{
      if(item.id===filaSeleccionada.idMuestreo){
          item.cod_Campo=filaSeleccionada.cod_Campo;
          item.inicio_cosecha=filaSeleccionada.inicio_cosecha;
          item.telefono=filaSeleccionada.telefono;
      }
    });
    setData(dataNueva);
    swal({
      title: "Datos guardados correctamente!",
      icon: "success",
      button: "ok",
    });
    const arrayEditado = tabledata.map(item => (
      item.idMuestreo === filaSeleccionada.idMuestreo ? 
      {
      idMuestreo : item.idMuestreo, 
      idAnalisis_Residuo:item.idAnalisis_Residuo,
      cod_Prod:item.cod_Prod,
      productor:item.productor,
      cod_Campo:filaSeleccionada.cod_Campo,
      campo:filaSeleccionada.campo,
      ha:filaSeleccionada.ha,
      ubicacion:filaSeleccionada.ubicacion,
      telefono:filaSeleccionada.telefono,
      liberacion: item.liberacion,
      estatus:item.estatus,
      tarjeta:item.tarjeta,
      sector:item.sector,
      fecha_solicitud:item.fecha_solicitud,
      fecha_ejecucion:item.fecha_ejecucion,
      idAgen:item.idAgen,
      asesor:item.asesor,
      idRegion:item.idRegion,
      idAgenC:item.idAgenC,
      asesorC:item.asesorC,
      asesorCS:item.asesorCS,
      idAgenI:item.idAgenI,
      fecha:item.fecha,
      inicio_cosecha:filaSeleccionada.inicio_cosecha,
      incidencia:item.incidencia,
      propuesta:item.propuesta,
      compras_oportunidad:filaSeleccionada.compras_oportunidad,
      fecha_analisis:item.fecha_analisis,
      analisis:item.analisis,
      } : item
    ))
    setTableData(arrayEditado);
    openClose_ModalEditar(); 
  }).catch(error=>{
    swal({
      title: error.response.data,
      text: "Favor de verificar la información",
      icon: "error",
      button: "Cerrar",
    });
    console.log(error.response.data);
    console.log(error.request);
    console.log(error.message); 
  })
}

  const peticionPutFecha_Muestreo=async()=>{   
        await axios.put(url+`/${filaSeleccionada.idMuestreo}/${cookies.get('IdAgen')}/${filaSeleccionada.sector}`,filaSeleccionada)
        .then(response=>{
          var dataNueva= data;
          dataNueva.map(item=>{
            if(item.id===filaSeleccionada.idMuestreo){
                item.fecha_ejecucion=filaSeleccionada.fecha_ejecucion;
                item.idAgenI=filaSeleccionada.idAgenI;
            }
          });
          setData(dataNueva);
          swal({
            title: "Datos guardados correctamente!",
            icon: "success",
            button: "ok",
          });
          const arrayEditado = tabledata.map(item => (
            item.idMuestreo === filaSeleccionada.idMuestreo ? 
            {
            idMuestreo : item.idMuestreo, 
            idAnalisis_Residuo:item.idAnalisis_Residuo,
            cod_Prod:item.cod_Prod,
            productor:item.productor,
            cod_Campo:item.cod_Campo,
            campo:item.campo,
            ha:item.ha,
            ubicacion:item.ubicacion,
            telefono:item.telefono,
            liberacion: item.liberacion,
            estatus:item.estatus,
            tarjeta:item.tarjeta,
            sector:filaSeleccionada.sector,
            fecha_solicitud:item.fecha_solicitud,
            fecha_ejecucion:filaSeleccionada.fecha_ejecucion,
            idAgen:item.idAgen,
            asesor:item.asesor,
            idRegion:item.idRegion,
            idAgenC:item.idAgenC,
            asesorC:item.asesorC,
            asesorCS:item.asesorCS,
            idAgenI:item.idAgenI,
            fecha:item.fecha,
            inicio_cosecha:item.inicio_cosecha,
            incidencia:item.incidencia,
            propuesta:item.propuesta,
            compras_oportunidad:item.compras_oportunidad,
            fecha_analisis:item.fecha_analisis,
            analisis:item.analisis,
            } : item
          ))
          setTableData(arrayEditado);
          openClose_ModalFecha_muestreo(); 
        }).catch(error=>{
          swal({
            title: error.response.data,
            text: "Favor de verificar la información",
            icon: "error",
            button: "Cerrar",
          });
          console.log(error.response.data);
          console.log(error.request);
          console.log(error.message); 
        })
  }

  const peticionPutCalidad=async(e)=>{    
    e.preventDefault();
    setLoading(true); 
     await axios.put(url_calidad+`/${filaSeleccionada.idMuestreo}/${cookies.get('IdAgen')}`,filaSeleccionada)
        .then(response=>{
         console.log(response.data);       

          const arrayEditado = tabledata.map(item => (
            item.idMuestreo === filaSeleccionada.idMuestreo ? 
            {
            idMuestreo : item.idMuestreo, 
            idAnalisis_Residuo:item.idAnalisis_Residuo,
            cod_Prod:item.cod_Prod,
            productor:item.productor,
            cod_Campo:item.cod_Campo,
            campo:item.campo,
            ha:item.ha,
            ubicacion:item.ubicacion,
            telefono:item.telefono,
            liberacion: item.liberacion,
            estatus:response.data.estatus,
            tarjeta:item.tarjeta,
            sector:item.sector,
            fecha_solicitud:item.fecha_solicitud,
            fecha_ejecucion:item.fecha_ejecucion,
            idAgen:item.idAgen,
            asesor:item.asesor,
            idRegion:item.idRegion,
            idAgenC:item.idAgenC,
            asesorC:item.asesorC,
            asesorCS:item.asesorCS,
            idAgenI:item.idAgenI,
            fecha:item.fecha,
            inicio_cosecha:item.inicio_cosecha,
            incidencia:response.data.incidencia,
            propuesta:response.data.propuesta,
            compras_oportunidad:item.compras_oportunidad,
            fecha_analisis:item.fecha_analisis,
            analisis:item.analisis,
            } : item
          ))
          setTableData(arrayEditado);
          swal({
            title: "Datos guardados correctamente!",
            icon: "success",
            button: "ok",
          });
        openClose_ModalCalidad();
        }).catch(error=>{
          swal({
            title: "Algo salió mal",
            text:error.response,
            icon: "error",
            button: "Cerrar",
          });
            console.log(error.response);
            console.log(error.request);
            console.log(error.message);
        })
   
    setLoading(false); 
  }

  const peticionPatchLiberar=async(e)=>{  
    e.preventDefault();  
    setLoading(true);    
        await axios.patch(url+`/${filaSeleccionada.idMuestreo}/${cookies.get('IdAgen')}/${"liberacion"}`,filaSeleccionada)
        .then(response=>{
            const arrayEditado = tabledata.map(item => (
            item.idMuestreo === filaSeleccionada.idMuestreo ? 
            {
            idMuestreo : item.idMuestreo, 
            idAnalisis_Residuo:item.idAnalisis_Residuo,
            cod_Prod:item.cod_Prod,
            productor:item.productor,
            cod_Campo:item.cod_Campo,
            campo:item.campo,
            ha:item.ha,
            ubicacion:item.ubicacion,
            telefono:item.telefono,
            liberacion: 'S',
            estatus:item.estatus,
            tarjeta:item.tarjeta,
            sector:item.sector,
            fecha_solicitud:item.fecha_solicitud,
            fecha_ejecucion:item.fecha_ejecucion,
            idAgen:item.idAgen,
            asesor:item.asesor,
            idRegion:item.idRegion,
            idAgenC:item.idAgenC,
            asesorC:item.asesorC,
            asesorCS:item.asesorCS,
            idAgenI:item.idAgenI,
            fecha:item.fecha,
            inicio_cosecha:item.inicio_cosecha,
            incidencia:item.incidencia,
            propuesta:item.propuesta,
            compras_oportunidad:item.compras_oportunidad,
            fecha_analisis:item.fecha_analisis,
            analisis:item.analisis,
            } : item
          ))
          setTableData(arrayEditado);
          swal({
            title: "Datos guardados correctamente!",
            icon: "success",
            button: "ok",
          });
          openClose_ModalLiberar(); 

        }).catch(error=>{
          swal({
            title: error.response.data,
            text: "Favor de verificar la información",
            icon: "error",
            button: "Cerrar",
          });
          console.log(error.response.data);
          console.log(error.request);
          console.log(error.message); 
        })
    setLoading(false);   
  }

  const peticionPatchTarjeta=async(e)=>{   
    e.preventDefault();
    setLoading(true);    
        await axios.patch(url+`/${filaSeleccionada.idMuestreo}/${cookies.get('IdAgen')}/${"tarjeta"}`,filaSeleccionada)
        .then(response=>{         
            const arrayEditado = tabledata.map(item => (
            item.idMuestreo === filaSeleccionada.idMuestreo ? 
            {
            idMuestreo : item.idMuestreo, 
            idAnalisis_Residuo:item.idAnalisis_Residuo,
            cod_Prod:item.cod_Prod,
            productor:item.productor,
            cod_Campo:item.cod_Campo,
            campo:item.campo,
            ha:item.ha,
            ubicacion:item.ubicacion,
            telefono:item.telefono,
            liberacion: item.liberacion,
            estatus:item.estatus,
            tarjeta:'S',
            sector:item.sector,
            fecha_solicitud:item.fecha_solicitud,
            fecha_ejecucion:item.fecha_ejecucion,
            idAgen:item.idAgen,
            asesor:item.asesor,
            idRegion:item.idRegion,
            idAgenC:item.idAgenC,
            asesorC:item.asesorC,
            asesorCS:item.asesorCS,
            idAgenI:item.idAgenI,
            fecha:item.fecha,
            inicio_cosecha:item.inicio_cosecha,
            incidencia:item.incidencia,
            propuesta:item.propuesta,
            compras_oportunidad:item.compras_oportunidad,
            fecha_analisis:item.fecha_analisis,
            analisis:item.analisis,
            } : item
          ))
          setTableData(arrayEditado);
          swal({
            title: "Datos guardados correctamente!",
            icon: "success",
            button: "ok",
          });
          openClose_ModalTarjeta(); 

        }).catch(error=>{
          swal({
            title: error.response.data,
            text: "Favor de verificar la información",
            icon: "error",
            button: "Cerrar",
          });
          console.log(error.response.data);
          console.log(error.request);
          console.log(error.message); 
        })
    setLoading(false);   
  }

  const peticionPutReasignar=async()=>{     
        await axios.put(url_campos+`/${cookies.get('IdAgen')}/${asesorReasignado}/${cookies.get('Tipo')}`,filaSeleccionada)
        .then(response=>{
          var dataNueva= data;
          dataNueva.map(item=>{
            if(item.id===filaSeleccionada.idMuestreo){
              item.cod_Prod=filaSeleccionada.cod_Prod;
              item.cod_Campo=filaSeleccionada.cod_Campo;
            }
          });
          setData(dataNueva);
          swal({
            title: "Datos guardados correctamente!",
            icon: "success",
            button: "ok",
          });
          openClose_ModalReasignar(); 
        }).catch(error=>{
          swal({
            title: "Algo salió mal",
            text:error.response,
            icon: "error",
            button: "Cerrar",
          });
            console.log(error.response);
            console.log(error.request);
            console.log(error.message);
        })
  }

  const enviarAnalisis = (e) => {
    e.preventDefault();
    if(!nvoanalisis.estatus.trim()){
      swal({
        title: "Debe ingresar información válida",
        icon: "warning",
        button: "Cerrar",
      }).then((value) => {
        if(value){         
          peticionPostAnalisis();
        }
      }); 
    }
    else{
    swal({
      title: "¿Desea guardar esta información?",
      icon: "info",
      buttons: ["No","Si"],
    }).then((value) => {
      if(value){
        peticionPostAnalisis();
      }
    }); 
  }
  }

  const peticionPostAnalisis=async(e)=>{     
    setLoading(true);   
     await axios.post(url_analisis+`/${filaSeleccionada.idMuestreo===null? 0:filaSeleccionada.idMuestreo}/${filaSeleccionada.idAnalisis_Residuo===null? 0:filaSeleccionada.idAnalisis_Residuo}/${liberacionUSA}/${liberacionEU}/${filaSeleccionada.sector}`,nvoanalisis)
    .then(response=>{               
       const arrayEditado = tabledata.map(item => (
        item.cod_Prod===response.data.cod_Prod && item.cod_Campo===response.data.cod_Campo?
        {
        idMuestreo : item.idMuestreo, 
        idAnalisis_Residuo:item.idAnalisis_Residuo,
        cod_Prod:item.cod_Prod,
        productor:item.productor,
        cod_Campo:item.cod_Campo,
        campo:item.campo,
        ha:item.ha,
        ubicacion:item.ubicacion,
        telefono:item.telefono,
        liberacion: item.liberacion,
        estatus:item.estatus,
        tarjeta:item.tarjeta,
        sector:item.sector,
        fecha_solicitud:item.fecha_solicitud,
        fecha_ejecucion:item.fecha_ejecucion,
        idAgen:item.idAgen,
        asesor:item.asesor,
        idRegion:item.idRegion,
        idAgenC:item.idAgenC,
        asesorC:item.asesorC,
        asesorCS:item.asesorCS,
        idAgenI:item.idAgenI,
        fecha:item.fecha,
        inicio_cosecha:item.inicio_cosecha,
        incidencia:item.incidencia,
        propuesta:item.propuesta,
        compras_oportunidad:item.compras_oportunidad,
        fecha_analisis:item.fecha_analisis,
        analisis:response.data.estatus,
        } : item
      ))
      setTableData(arrayEditado);
     
      swal({
        title: "Datos guardados correctamente!",
        icon: "success",
        button: "ok",
      });

      openClose_ModalAnalisis(); 
        }).catch(error=>{
          swal({
            title: error.response.data,
            text: "Favor de verificar la información",
            icon: "error",
            button: "Cerrar",
          });
          console.log(error.response.data);
          console.log(error.request);
          console.log(error.message); 
        }) 
    setLoading(false);
  }

  const seleccionarRegistro=(muestreo,caso)=>{    
        setfilaSeleccionada(muestreo);
        if(caso==="Calidad"){
          setmodalCalidad(true);
        }if(caso==="Fecha_muestreo"){
          handlerCargarSectores();         
        }if(caso==="Liberar_muestreo"){
          setmodalLiberar(true);
        }if(caso==="Analisis_residuo"){
          setmodalAnalisis(true);
        }if(caso==="Reasignar"){
          setmodalReasignar(true);
        }if(caso==="Tarjeta"){
          setmodalTarjeta(true);
        }if(caso==="Editar_muestreo"){
          setmodalEditar(true);
        }
  }

  const peticionGet=async()=>{
    await axios.get(url+`/${cookies.get('IdAgen')}/${cookies.get('Tipo')}`)
    .then(res=>{     
      setDataOriginal(res.data); 
     /*  console.log(res.data);  */
      if(cookies.get('IdAgen')!=='205')
      {  
            if(cookies.get('Tipo')=='P')
            {
              if(cookies.get('IdAgen')=='1')
              { 
                setverAsesor(true);
              }
              else{
                setverAsesor(false);
              }
              setactionEditar(true);             
              setactionCalidad(false);
              setactionFecha_ejecucion(false);
              setactionLiberar(true);

              for(const dataObj of res.data)
              {
                if(dataObj.liberacion==='S'){
                setactionLiberar(false);
                }  
                else{
                setactionLiberar(true);
                }          
              }             
            }

            else if(cookies.get('Tipo')=='C'){
              setverAsesorC(true);
              setactionCalidad(true);
              setactionLiberar(false);
              setactionFecha_ejecucion(false);
              setactionEditar(false);
            }

            else if(cookies.get('Tipo')=='I'){
              setactionFecha_ejecucion(true);
              setactionCalidad(false);
              setactionLiberar(false);
              setactionEditar(false);
            }

            if(cookies.get('IdAgen')=== '1' || cookies.get('IdAgen')==='5' || cookies.get('IdAgen')==='153' || cookies.get('IdAgen')=='281'){
              setactionTarjeta(true);
            }
            else{
              setactionTarjeta(false);
            }
      }
      else{            
              setactionAnalisis(true);
              setactionFecha_ejecucion(true);
              setactionCalidad(false);
              setactionLiberar(false);
              setactionEditar(false);
      }                  
    })
    handlerCargarAsesores();    
  }
      
  useEffect(()=>{    
      peticionGet(); 
      setTableData(dataOriginal);    
  },[dataOriginal]) 
    
  //cargar asesores
  const handlerCargarAsesores= function(e){
      axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${cookies.get("Tipo")}`)
       .then(res=>{    
        setasesores(res.data); 
        for(const dataObj of res.data)
        {         
          setidagens(dataObj.idAgen);  
        } 
      })      
  }

  //cargar sectores
  const handlerCargarSectores= function(e){    
     axios.get(url_sector+`/${filaSeleccionada.cod_Prod}/${filaSeleccionada.cod_Campo}`)
     .then(res=>{    
      if(res.data!=="");
      {
        setSectores(res.data); 
        console.log(sectores);   
      }
      setmodalFecha_muestreo(true);      
    })      
    
  }

  const deleteSector=async(idSector)=>{  
  await axios.delete(url_sector+`/${idSector}`)
 .then(response=>{   
   const arrFiltrado=sectores.filter(item=> item.id!==idSector)
  setSectores(arrFiltrado); 

  }).catch(error=>{
   swal({
     title: error.response.data,
     text: "Favor de verificar la información",
     icon: "error",
     button: "Cerrar",
   });
   console.log(error.response.data);
   console.log(error.request);
   console.log(error.message); 
 })            
  }

  const openClose_ModalCalidad=()=>{
        setmodalCalidad(!modalCalidad);
  }

  const openClose_ModalFecha_muestreo=()=>{   
     setmodalFecha_muestreo(!modalFecha_muestreo);
  }

  const openClose_ModalLiberar=()=>{
     setmodalLiberar(!modalLiberar);
  }

  const openClose_ModalAnalisis=()=>{
   setmodalAnalisis(!modalAnalisis);
  }

  const openClose_ModalReasignar=()=>{
   setmodalReasignar(!modalReasignar);
  }

  const openClose_ModalTarjeta=()=>{
   setmodalTarjeta(!modalTarjeta);
  }

  const openClose_ModalEditar=()=>{
    setmodalEditar(!modalEditar);
   }

  const reasignar_codigo=(
    <div className={styles.modal}>
    <div className="card card-default">
    <div className="card-header"> 
     <div className="card-header">     
       <h7 className="font-weight-bold text-secondary">Re-asignar a otro ingeniero</h7>      
    </div> 
    <div className="card-body">
    Codigo
      <input 
          type="text" disabled
          className="form-control"
          id="cod_Prod" name="cod_Prod"
          value={filaSeleccionada&&filaSeleccionada.cod_Prod}
        /> 
      Campo
      <input 
          type="text" disabled
          className="form-control"
          id="cod_Campo" name="cod_Campo"
          value={filaSeleccionada&&filaSeleccionada.cod_Campo}
        />    
    <br />
    <h7>Asesor</h7>
    <select name="idAgen_Reasignado" className="form-control" onChange={handleChange} onClick={handlerCargarAsesores}>
      <option value={0}>--Seleccione--</option>
      {
        asesores.map(item=>(
        <option key={item.idAgen} value={item.idAgen} >{item.asesor}</option>
      )
      )}
    </select>
    </div>
    <div className="card-footer">
      <Button className="btn btn-primary btn-sm active float-right" onClick={()=>peticionPutReasignar()}>Guardar</Button>
      <Button className="btn btn-secondary btn-sm active float-right" onClick={()=>openClose_ModalReasignar()}>Cerrar</Button>
    </div>
  </div>
  </div>
  </div>
  )

  const editar_muestreo=(
    <div className={styles.modal}>          
    <div className="card card-default">
      <form onSubmit={peticionPutEditar}>
      <div className="card-header">     
         <h7 className="font-weight-bold text-secondary">Editar solicitud 
         <br />
         Código: {filaSeleccionada&&filaSeleccionada.cod_Prod} - Campo: {filaSeleccionada&&filaSeleccionada.cod_Campo}</h7>      
      </div> 
      <div className="card-body">

      <div className="form-group-sm">
        <Grid container spacing={3}>       
        <Grid item xs={12} md={12} lg={4}>
        Campos: 
        <select name="cod_Campo" id="cod_Campo" className="form-control" 
        onChange={handleChange} onClick={handlerCargarCampos}>
          <option value={0}>...</option>
          {
            campos.map(item=>(
            <option key={item.cod_Campo} value={item.cod_Campo} >{item.cod_Campo}</option>
          )
          )}
        </select>     
        </Grid>
        <Grid item xs={12} md={12} lg={8}>
        Descripción:  
        <input 
          type="text" disabled
          className="form-control"
          id="campo" name="campo"
          value={campo}
        />         
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Cultivo:  
        <input 
          type="text" disabled
          className="form-control"
          id="tipo" name="tipo"
          value={tipo}
        />          
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
        Producto:  
        <input 
          type="text" disabled
          className="form-control"
          id="producto" name="producto"
          value={producto}
        />       
        </Grid>
 

        <Grid item xs={12} md={12} lg={6}>
        Inicio de cosecha
      <input 
          type="date" onChange={handleChange} 
          className="form-control"
          id="inicio_cosecha" name="inicio_cosecha"         
        />    
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Teléfono
      <input 
          type="text" onChange={handleChange} 
          className="form-control"
          id="telefono" name="telefono" autoComplete="off" 
          maxLength={10} minLength={10} variant="outlined"
        />     
        </Grid>
      </Grid>
        </div>

      </div>
      <div className="card-footer">        
        <button disabled={loading ? true: false}
        className="btn btn-primary  active float-right" type="submit">
        {loading ? "Espere..." : "Guardar"}</button>
             
      <Button className="btn btn-secondary btn-sm active float-right" onClick={()=>openClose_ModalEditar()}>Cerrar</Button> 
      </div>      
         
      </form>
    </div>    
    </div>
  )

  const evaluar_calidad=(
    <div className={styles.modal}>          
    <div className="card card-default">
      <form onSubmit={peticionPutCalidad}>
      <div className="card-header">     
         <h7 className="font-weight-bold text-secondary">Estatus de calidad</h7>      
      </div> 
      <div className="card-body">
        Codigo
      <input 
          type="text" disabled
          className="form-control"
          id="cod_Prod" name="cod_Prod"
          value={filaSeleccionada&&filaSeleccionada.cod_Prod}
        /> 
      Campo
      <input 
          type="text" disabled
          className="form-control"
          id="cod_Campo" name="cod_Campo"
          value={filaSeleccionada&&filaSeleccionada.cod_Campo}
        />    
         
      {actionCalidad?
      <>
       Estatus:
        <select className="form-control" id="estatus" name="estatus" onChange={handleChange} >
        <option value={0}> --Seleccione una opción-- </option>
        <option value={1}>
        APTA
        </option>
        <option value={2}>
        APTA CON CONDICIONES
        </option>
        <option value={3}>
        PENDIENTE
        </option>
        </select>

        Incidencias:
      <textarea 
          className="form-control" 
          rows="2"        
          name="incidencia"
          value={filaSeleccionada&&filaSeleccionada.incidencia}
          onChange={handleChange} />     

      Propuestas:
      <textarea 
          className="form-control" 
          rows="2"        
          name="propuesta"
          value={filaSeleccionada&&filaSeleccionada.propuesta}
          onChange={handleChange} />           
        </>
        :
        <>
        { filaSeleccionada&&filaSeleccionada.estatus ===null?
            <p>SIN EVALUAR</p>
          :
          <>
    <div className="table-responsive table-condensed table-sm tabla mt-2">
    <table className="table table-hover" style={{fontSize: 11, textAlign: 'center'}}>
    <thead className="thead-light">     
      <tr> 
        <th>Estatus</th>
        <th>Incidencia</th>
        <th>Propuesta</th>
      </tr>
    </thead>
    <tbody style={{backgroundColor: 'white'}}> 
      <tr>
      <td>  
        
          { filaSeleccionada&&filaSeleccionada.estatus === '3'?
          <p>PENDIENTE</p>
          :
          <p>APTA</p>
          }
          
      
      </td>
      <td>{filaSeleccionada&&filaSeleccionada.incidencia}</td>
      <td>{filaSeleccionada&&filaSeleccionada.propuesta}</td>
      </tr>      
   </tbody>
   </table>
   </div>
          </>  
          } 
          </>  
        } 
        </div>

      <div className="card-footer">
        {actionCalidad?
        <button disabled={loading ? true: false}
        className="btn btn-primary active float-right" type="submit">
        {loading ? "Espere..." : "Guardar"}</button>
        :
          <></>
        }      
      <Button className="btn btn-secondary btn-sm active float-right" onClick={()=>openClose_ModalCalidad()}>Cerrar</Button> 
      </div>
      </form>
    </div>    
    </div>
  )

  const fecha_muestreo=(
    <div className={styles.modal}>
      <div className="card card-default">
      <div className="card-header">    
         <h7 className="font-weight-bold text-secondary">Fecha de ejecución</h7>      
      </div> 
      <div className="card-body">
      <div className="row">   
    <div className="col-md-12"> 
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={6}>
        Codigo:   
        <input 
          type="text" disabled
          className="form-control"
          id="cod_Prod" name="cod_Prod"
          value={filaSeleccionada&&filaSeleccionada.cod_Prod}
        />          
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Campo:  
        <input 
          type="text" disabled
          className="form-control"
          id="cod_Campo" name="cod_Campo" 
          value={filaSeleccionada&&filaSeleccionada.cod_Campo}
        />      
        </Grid>       
        <Grid item xs={12} md={12} lg={6}>
        Fecha de ejecución:     
        <input 
          type="date" 
          className="form-control"
          name="fecha_ejecucion"
          onChange={handleChange} autoComplete="off"
          value={filaSeleccionada&&filaSeleccionada.fecha_ejecucion}
        />   
        </Grid>   
        <Grid item xs={12} md={12} lg={6}>
        Sector: 
        <input 
          type="text" 
          className="form-control"
          name="sector" 
          onChange={handleChange} 
        />             
        </Grid> 
      </Grid>
      </div>
      
    <div className="col-md-12 mt-2"> 
      <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <div className="table-responsive table-condensed table-sm tabla" style={{fontSize: 11, textAlign: 'center'}} >
        <table className="table table-hover" id="tblSectores">
        <thead className="thead-light">     
        <tr> 
        <th>Sectores agregados</th>
        <th>Borrar</th>
        </tr>
        </thead>
      <tbody>
      {sectores.length>0?
      sectores.map(item=>(
      <React.Fragment key={item.id}>      
      <tr>
      <td>{item.sector}</td> 
      <td>
      <Button className="m-0 p-0" color="secondary" endIcon={<Clear />}  onClick={()=>deleteSector(item.id)}>                            
      </Button>
      </td>     
      </tr> 
      </React.Fragment>
      ))
      :null
      }  
    
    </tbody>
    </table>
    </div>
    </Grid>  
    </Grid>
    </div>

    </div>
   </div>
   <div className="card-footer">
     <Button className="btn btn-primary btn-sm active float-right" onClick={()=>peticionPutFecha_Muestreo()}>Guardar</Button>
     <Button className="btn btn-secondary btn-sm active float-right" onClick={()=>openClose_ModalFecha_muestreo()}>Cerrar</Button>
  </div>
  </div>
  </div>
  )

  const liberar_muestreo=(
    <div className={styles.modal}>         
      <div className="card card-default">       
      <div className="card-header">
      </div> 
      <div className="card-body">
         <h7>¿Esta seguro de liberar esta solicitud?</h7>
      </div>
      <div className="card-footer float-right">
      <form onSubmit={peticionPatchLiberar}>          
      <button disabled={loading ? true: false}
      className="btn btn-primary active float-right" type="submit">
      {loading ? "Espere..." : "SI"}</button>
          <button className="btn btn-secondary active float-right" onClick={()=>openClose_ModalLiberar()}>NO</button>
      </form>
      </div>
      </div>
    </div>
  )

  const agregar_analisis=(
    <div className={styles.modal_lg}>  
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
        <form onSubmit={enviarAnalisis}>
      <div class="modal-header">
      <h5 className="font-weight-bold text-secondary">Análisis de Residuos de Plaguicidas</h5>  
      </div> 
      <div class="modal-body">
      <div className="row">   
    <div className="col-md-6">
      <div className="form-group-sm">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={4}>
        Codigo:   
        <input 
          type="text" disabled
          className="form-control" name="cod_Prod"
          value={filaSeleccionada&&filaSeleccionada.cod_Prod}
        />          
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
        Campo:  
        <input 
          type="text" disabled
          className="form-control" name="cod_Campo" 
          value={filaSeleccionada&&filaSeleccionada.cod_Campo}
        />      
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
        Sector (es): 
        <input 
          type="text" disabled
          className="form-control"
          name="sector" 
          value={filaSeleccionada&&filaSeleccionada.sector}
        />             
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Cultivo:  
        <input 
          type="text" disabled
          className="form-control"
          name="tipo"
          value={filaSeleccionada&&filaSeleccionada.tipo}
        /> 
         </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Variedad:  
        <input 
          type="text" disabled
          className="form-control"
          name="producto" 
          value={filaSeleccionada&&filaSeleccionada.producto}
        />         
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Folio:  
        <input 
          type="text" className={styles.input}
          className="form-control"
          name="folio"
          onChange={handleChangeAnalisis} autoComplete="off"
        />
        </Grid>
        <Grid item xs={12} md={12} lg={6}>  
        Zona:     
        <select name="codZona" id="codZona" className="form-control" onChange={handleChangeAnalisis} onClick={handlerZonas}>
          <option value={0}>Seleccione</option>
          {
            zonas.map(item=>(
            <option key={item.codigo} value={item.codigo} >{item.descZona}</option>
          )
        )}
      </select>           
       </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Fecha de envio:  
        <input required type="date" 
          className="form-control" name="fecha_envio" onChange={handleChangeAnalisis}
        />    
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Fecha de entrega:        
        <input 
          type="date" required
          className="form-control"
          name="fecha_entrega"
          onChange={handleChangeAnalisis} autoComplete="off"
        />   
        </Grid>        
      </Grid>
      </div>
    </div>

    <div className="col-md-6">
      <div className="form-group-sm"> 
        <Grid container spacing={3}>  
        <Grid item xs={12} md={12} lg={6}>        
          Estatus: 
          <select name="estatus" id="estatus" className="form-control" onChange={handleChangeEstatus}>
            <option value={0}>Seleccione</option>          
            <option value={'R'}>CON RESIDUOS</option>
            <option value={'P'}>EN PROCESO</option>
            <option value={'F'}>FUERA DE LIMITE</option>
            <option value={'L'}>LIBERADO</option>
          </select>             
        </Grid>

        <Grid item xs={12} md={12} lg={6}>     
      Laboratorio:    
      <select name="laboratorio" id="laboratorio" className="form-control" onChange={handleChangeAnalisis}>
            <option value={0}>Seleccione</option>          
            <option value={'AGQ'}>AGQ</option>
            <option value={'AGROLAB'}>AGROLAB</option>
          </select>        
      </Grid>

      {estatus==="F"&&             
        <>   
         <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
        <Grid item xs={6} md={6} lg={6}>
        Liberación USA (dias):
              <input type="text" autoComplete="off"
              className="form-control" name="liberacionUSA" value={liberacionUSA} onChange={e => setLiberacionUSA(e.target.value)}  
              />  
        </Grid>

        <Grid item xs={6} md={6} lg={6}>
        Liberación EU (dias):
              <input type="text" autoComplete="off"
              className="form-control" name="liberacionEU" value={liberacionEU} onChange={e => setLiberacionEU(e.target.value)}  
              />          
        </Grid>   
        </Grid>  
        </Grid>       
            </> 
        }

      <Grid item xs={12} md={12} lg={6}>
        Número de análisis:  
        <input 
          type="text" disabled
          className="form-control"
          name="num_analisis"         
          autoComplete="off"
          value={filaSeleccionada&&filaSeleccionada.num_analisis}
        />         
      </Grid>
      
      <Grid item xs={12} md={12} lg={6}>  
      <input type="checkbox" name="traza"
        defaultChecked={false} className="mt-4"
        onChange={handleChangeAnalisis}
        /> Traza    
    </Grid>

      <Grid item xs={12} md={12} lg={12}>
      Comentarios:     
      <textarea 
          className="form-control" 
          id="comentarios" 
          rows="3"        
          name="comentarios"
          onChange={handleChangeAnalisis} autoComplete="off"
        />        
      </Grid>      
      
      </Grid>
      </div>
    </div>
    </div>    
   
      </div>
      <div class="modal-footer">
      <button disabled={loading ? true: false}
      className="btn btn-primary active float-right" type="submit">
      {loading ? "Espere..." : "Enviar"}</button>
      <button className="btn btn-secondary active float-right" onClick={()=>openClose_ModalAnalisis()}>Cerrar</button>
      </div>
      </form>
    </div>
    </div>
    </div>
  )

  const liberar_tarjeta=(
    <div className={styles.modal}>          
    <div className="card card-default">
    <form onSubmit={peticionPatchTarjeta}>
      <div className="card-header">     
        <h7 className="font-weight-bold text-secondary">Liberar entrega de tarjeta</h7>      
      </div> 
      <div className="card-body">    

      <input type="checkbox" name="tarjeta"
        defaultChecked={false} className="m-2"
        onChange={handleChange}
        /> Autorizar 
      <br/>

      Justifique:     
      <textarea required
          className="form-control" 
          id="liberar_Tarjeta" 
          rows="3"        
          name="liberar_Tarjeta"
          onChange={handleChange} autoComplete="off"
        />           
    
      </div>    
      <div className="card-footer">            
        <button disabled={loading ? true: false}
        className="btn btn-primary btn-sm active float-right" type="submit">
        {loading ? "Espere..." : "Guardar"}</button>   
        <button className="btn btn-secondary btn-sm active float-right" onClick={()=>openClose_ModalTarjeta()}>Cerrar</button>        
      </div>
    </form>
    </div>    
    </div>
  )
    
return(
<div className={styles.root}>
<Contenedor />     
<div className={styles.content}>
<div className={styles.toolbar}> </div>   
<section className="content">  
<div>
{/*  
<Paper className={styles.paper}>
  <Toolbar> 
    <Typography  variant="h6" id="tableTitle" component="div">
       Muestreos solicitados
    </Typography>      
  </Toolbar>
        
  <TableContainer>
    <Table
           className={styles.table}
            aria-labelledby="tableTitle"
            size='small'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={styles}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tabledata.length}
            />
            <TableBody>
              {stableSort(tabledata, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.idMuestreo);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow                       
                      onClick={(event) => handleClick(event, row.idMuestreo)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.idMuestreo}
                      selected={isItemSelected}
                      className={styles.tablecell}>
                       
                      <TableCell component="th" id={labelId} scope="row" padding="none">{row.cod_Prod}</TableCell>
                      <TableCell align="center">{row.productor}</TableCell>
                      <TableCell align="center">{row.cod_Campo} - {row.campo}</TableCell>
                      <TableCell align="center">{row.sector}</TableCell>
                      
                      {row.compras_oportunidad ==='S' ? 
                       <TableCell align="center"> SI </TableCell>
                        : 
                       <TableCell align="center"> NO </TableCell>
                      }         

                      <TableCell align="center">{moment(row.fecha_solicitud).format('L')}</TableCell>
                      <TableCell align="center">{moment(row.inicio_cosecha).format('L')}</TableCell>
                      <TableCell align="center">{row.ubicacion}</TableCell>
                      <TableCell align="center">{row.telefono}</TableCell>   


                      {actionLiberar?
                      <>
                       {row.liberacion ==='S' ? 
                       <TableCell align="center" bgcolor="LightGreen"> <DoneIcon/> </TableCell>
                        : 
                       <TableCell align="center" bgcolor="yellow">
                         <Button variant="primary" endIcon={<AddBox />}></Button>
                       </TableCell>
                      }
                      </>    
                      :
                      <TableCell align="center" bgcolor="yellow"> <PriorityHighIcon /> </TableCell>
                      }
                             

                      {row.fecha_ejecucion !== null ? 
                        <TableCell align="center">{moment(row.fecha_ejecucion).format('L')}</TableCell>
                        : 
                       <TableCell align="center" bgcolor="yellow"> <PriorityHighIcon /> </TableCell>
                      }                         
                      
                      {row.idAnalisis_Residuo !== null ?                        
                        <>  
                        {row.estatus === 'R' ?                        
                          <TableCell align="center" bgcolor="red"> CON RESIDUOS </TableCell>
                          :
                          <> 
                          {row.estatus === 'P' ?                        
                          <TableCell align="center" bgcolor="red"> EN PROCESO </TableCell>
                          :
                          <> 
                          {row.estatus === 'F' ?                        
                          <TableCell align="center" bgcolor="red"> FUERA LIMITE </TableCell>
                          :
                          <> 
                          <TableCell align="center" bgcolor="red"> LIBERADO</TableCell>
                          </>                      
                          }  
                          </>                      
                          }  
                          </>                      
                        }  
                      </>                               
                      :
                      <TableCell align="center" bgcolor="yellow"> <PriorityHighIcon /> </TableCell>                                  
                      } 
                      
                      <TableCell align="center"></TableCell>
                      <TableCell align="center">{row.tarjeta}</TableCell>
                      <TableCell align="center"> </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (33) * emptyRows }}>
                  <TableCell colSpan={16} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tabledata.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper> */}
     </div>

<Paper className={styles.paper}>  

  <Grid item xs={12} md={12} lg={12}>
  <Grid container spacing={1}>
  <Grid item xs={12} md={6} lg={6}>
  <Toolbar> 
    <Typography  variant="h6" id="tableTitle" component="div">
       Muestreos solicitados
    </Typography>      
  </Toolbar>
  </Grid>
  <Grid item xs={12} md={6} lg={6}>
     
  <input className="form-control" placeholder="Buscar ..." name="term" onChange={e => setTerm(e.target.value)}/>
  </Grid>
  </Grid>
  </Grid>

  <TableContainer>
  <div className="table-responsive table-condensed table-sm">
  <table className="table table-hover" style={{fontSize: 10, textAlign: 'center'}}>
  <EnhancedTableHead
      classes={styles}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tabledata.length}
              className="thead-light"
  />
    <tbody>  
    {stableSort(tabledata, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter(searchTerm(term)).map((row, index) => {
                  const isItemSelected = isSelected(row.idMuestreo);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <tr                       
                      onClick={(event) => handleClick(event, row.idMuestreo)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.idMuestreo}
                      selected={isItemSelected}
                      className={styles.tablecell}>                     
                      
                      <td>
                      {actionEditar?
                          <>
                          <Button endIcon={<EditTwoToneIcon />} 
                           onClick={()=>seleccionarRegistro(row, "Editar_muestreo")}>                            
                         </Button> 
                         </>    
                         :
                         <></>
                         }
                      </td>

                      <td component="th" id={labelId} scope="row" padding="none">{row.cod_Prod}
                      {verAsesor?
                      <p>{row.asesor}</p>
                        :
                        <></>
                      }
                      </td>

                      <td align="center">{row.productor}</td>
                      <td align="center">{row.cod_Campo} - {row.campo}</td>
                      <td align="center">{row.sector}</td>
                      
                      {row.compras_oportunidad ==='S' ? 
                       <td align="center"> SI </td>
                        : 
                       <td align="center"> NO </td>
                      }  

                      <td align="center">
                       {row.fecha_solicitud !== null ? 
                       <>
                       {moment(row.fecha_solicitud).format('L')}
                       </>    
                        :
                        <></>
                      }             
                      </td>

                      <td align="center">
                       {row.inicio_cosecha !== null ? 
                       <>
                       {moment(row.inicio_cosecha).format('L')}
                       </>    
                        :
                        <></>
                      }             
                      </td>

                      <td align="center">{row.ubicacion}</td>
                      <td align="center">{row.telefono}</td>  
                      
                       {row.liberacion ==='S' ? 
                       <td align="center" bgcolor="LightGreen"> <DoneIcon/> </td>
                        : 
                       <td align="center" bgcolor="Pink">
                         {actionLiberar?
                         <>
                         <Button variant="primary" endIcon={<AddBox />} 
                          onClick={()=>seleccionarRegistro(row, "Liberar_muestreo")}
                          >                            
                        </Button>
                        </>    
                        :
                         <PriorityHighIcon />
                        }
                       </td>
                      }                       

                      {row.idMuestreo !== null && row.fecha_ejecucion !== null ? 
                      <>
                        <td align="center">{moment(row.fecha_ejecucion).format('L')}
                        {actionFecha_ejecucion?
                          <>
                          <Button variant="primary" endIcon={<AddBox />} 
                           onClick={()=>seleccionarRegistro(row, "Fecha_muestreo")}>                            
                         </Button>
                         </>    
                         :
                         <></>
                         }
                         </td>
                         </>
                        : 
                       <td align="center" bgcolor="Pink"> 
                        {row.idMuestreo !== null && actionFecha_ejecucion?
                         <>
                         <Button variant="primary" endIcon={<AddBox />} 
                          onClick={()=>seleccionarRegistro(row, "Fecha_muestreo")}
                          >                            
                        </Button>
                        </>    
                        :
                        <PriorityHighIcon />
                        }
                       </td>
                      }                         
                      
                      {row.idAnalisis_Residuo !== null ?                        
                        <>  
                        {row.analisis === 'R' ?                        
                          <td align="center" bgcolor="Tomato"> CON RESIDUOS 
                          {actionAnalisis?
                          <>
                          <Button variant="primary" endIcon={<AddBox />} 
                          onClick={()=>seleccionarRegistro(row, "Analisis_residuo")}
                          >                            
                          </Button>
                         </>    
                      :
                     false
                      } 
                      
                      </td>
                          :
                          <> 
                          {row.analisis === 'P' ?                        
                          <td align="center" bgcolor="Gainsboro"> EN PROCESO 
                          {actionAnalisis?
                          <>
                           <Button variant="primary" endIcon={<AddBox />} 
                          onClick={()=>seleccionarRegistro(row, "Analisis_residuo")}
                          >                            
                          </Button>  
                          </>    
                      :
                     false
                      } 
                      </td>
                        :
                        <> 
                          {row.analisis === 'F' ?                        
                          <td align="center" bgcolor="yellow"> FUERA LIMITE 
                          {actionAnalisis?
                          <>
                          <Button variant="primary" endIcon={<AddBox />} 
                          onClick={()=>seleccionarRegistro(row, "Analisis_residuo")}
                          >                            
                          </Button> 
                        </>    
                      :
                     false
                      } 
                      </td>
                          :
                          <> 
                          <td align="center" bgcolor="LightGreen"> LIBERADO</td>
                          </>                      
                          }  
                          </>                      
                          }  
                          </>                      
                        }                        
                      </>                    
                      :
                      <>
                      <td align="center" bgcolor="Pink"> 
                       {actionAnalisis?
                      <>
                       <td align="center">
                       <Button variant="primary" endIcon={<AddBox />} 
                          onClick={()=>seleccionarRegistro(row, "Analisis_residuo")}
                          >                            
                          </Button>          
                       </td>
                      </>    
                      :
                      <PriorityHighIcon /> 
                      }  
                      </td>                        
                      </>                            
                      } 
                                            
                      {row.estatus !== null ? 
                      <> 
                        {row.estatus === '3' ? 
                        <td align="center" bgcolor="tomato">PENDIENTE
                          {verAsesorC ?
                          <p>{row.asesorC}</p>
                          :
                          <></>
                          }
                        </td>    
                        :                                                
                        <td align="center" bgcolor="LightGreen">APTA
                          {verAsesorC ?
                          <p>{row.asesorC}</p>
                          :
                          <></>
                          }
                        </td>                                  
                        }
                        </> 
                        :
                        <td align="center" bgcolor="Pink"> <PriorityHighIcon /> </td>   
                      }
                       
                       <td> 
                         <Button variant="primary" endIcon={<AddBox />} 
                           onClick={()=>seleccionarRegistro(row, "Calidad")}
                           >                             
                         </Button>
                      </td>
                      
                       {row.tarjeta !== null && row.analisis === 'L' && (row.estatus==='1' || row.estatus==='2')?
                       <> 
                        {row.tarjeta === 'S' ? 
                        <td align="center" bgcolor="LightGreen"><DoneIcon/></td>    
                        :                                                
                        <td align="center" bgcolor="Pink">
                        {actionTarjeta?
                          <>
                            <Button variant="primary" endIcon={<AddBox />} onClick={()=>seleccionarRegistro(row, "Tarjeta")}>                            
                            </Button>
                          </>
                        :
                        <PriorityHighIcon />
                        } 
                        </td>                               
                        }   
                        </>
                        : 
                        <>
                        <td align="center" bgcolor="Pink"> 
                        {actionTarjeta?
                        <>
                          <Button variant="primary" endIcon={<AddBox />} onClick={()=>seleccionarRegistro(row, "Tarjeta")}>                            
                          </Button>
                        </>
                        :
                        <PriorityHighIcon />
                        } 
                        </td>        
                        </>
                      }

                      <td align="center"> 
                        <Button variant="primary" endIcon={<AddBox />}  onClick={()=>seleccionarRegistro(row, "Reasignar")}>                            
                        </Button>
                    </td>
                    </tr>
                  );
                })}
              {emptyRows > 0 && (
                <tr style={{ height: (33) * emptyRows }}>
                  <td colSpan={16} />
                </tr>
              )} 
   </tbody>
   </table>
  </div>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tabledata.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

<div>
{/*     <MaterialTable columns={rows} data={tabledata} title="" icons={tableIcons} actions={[   
      {
        icon:'library_add',
        iconProps: { style: { fontSize: "15px", color: "black" } },
        tooltip: "Reasignar código",
        name:"Reasignar",
        onClick:(event,rowData)=>seleccionarRegistro(rowData, "Reasignar")
    },
    actionLiberar?
    {
        icon:'library_add',
        iconProps: { style: { fontSize: "15px", color: "black" } },
        tooltip: "Liberar muestreo",
        name:"Liberar_muestreo",
        onClick:(event,rowData)=>seleccionarRegistro(rowData, "Liberar_muestreo")
    }:false,

    actionFecha_ejecucion?
    {
        icon:'library_add',
        iconProps: { style: { fontSize: "15px", color: "black"  } },
        tooltip: "Fecha de muestreo",
        onClick:(event,rowData)=>seleccionarRegistro(rowData, "Fecha_muestreo")
    }:false,

    actionCalidad?
    {
        icon:'library_add',
        iconProps: { style: { fontSize: "15px", color: "black"  } },
        tooltip: "Evaluar calidad",
        onClick:(event,rowData)=>seleccionarRegistro(rowData, "Calidad")
    }:false,

    actionAnalisis?
    {
        icon:'library_add',
        iconProps: { style: { fontSize: "15px", color: "black"  } },
        tooltip: "Resultado del nálisis",
        onClick:(event,rowData)=>seleccionarRegistro(rowData, "Analisis_residuo")
    }:false
    ]}

    options={{
      actionsCellStyle: {
        backgroundColor: "#B0C4DE",
        color: "black"
      },
      headerStyle: { backgroundColor: "#B0C4DE", color: "black", fontWeight:'bold' }
    }}
    options={{actionsColumnIndex:-1}} 
    className={styles.table}
    localization={{header:{actions:''}}}  
    initialState= {{ pageIndex: 0,}}   
    /> 
 */}
 </div>
 
<Modal open={modalCalidad} onClose={openClose_ModalCalidad}>{evaluar_calidad}</Modal>

<Modal open={modalFecha_muestreo} onClose={openClose_ModalFecha_muestreo}>{fecha_muestreo}</Modal>

<Modal open={modalLiberar} onClose={openClose_ModalLiberar}>{liberar_muestreo}</Modal>

<Modal open={modalAnalisis} onClose={openClose_ModalAnalisis}>{agregar_analisis}</Modal>

<Modal open={modalReasignar} onClose={openClose_ModalReasignar}>{reasignar_codigo}</Modal>

<Modal open={modalTarjeta} onClose={openClose_ModalTarjeta}>{liberar_tarjeta}</Modal>

<Modal open={modalEditar} onClose={openClose_ModalEditar}>{editar_muestreo}</Modal>

</section>
</div>
</div>
);
}

export default Muestreos;