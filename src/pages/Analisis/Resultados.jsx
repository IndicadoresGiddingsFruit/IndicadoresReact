import React, {useEffect,useState,forwardRef} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import MaterialTable from 'material-table';
import {makeStyles} from '@material-ui/core/styles' 
import Contenedor from '../Contenedor.jsx'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {useParams} from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

const rows=[
    {
        title:'Id',
        field:'IdAnalisis_Residuo',
        width: -1,
        hidden: true
    },        
    {
        title:'Codigo',
        field:'cod_Prod',
    },
    {
        title:'Campo',
        field:'cod_Campo',
        type: 'number',
    },
    {
        title:'Sector',
        field:'sector',
        type: 'number',
    },
    {
        title:'Productor',
        field:'productor'
    },  
    {
        title:'Tipo',
        field:'tipo'
    },
    {
        title:'Producto',
        field:'producto'
    },  
    {
        title:'Zona',
        field:'zona'
    }, 
    {
        title:'Fecha/envío',
        field:'fecha_envio',
        type:'date'         
    },
    {
        title:'Fecha/entrega',
        field:'fecha_entrega',
        type:'date'         
    },
    {
        title:'Estatus',
        field:'analisis'
    },
    {
        title:'Num/análisis',
        field:'num_analisis'
    },
    {
        title:'Laboratorio',
        field:'laboratorio'
    },
    {
        title:'LiberacionUSA',
        field:'liberacionUSA',
        type:'date'  
    },
    {
        title:'LiberacionEU',
        field:'liberacionEU',
        type:'date'  
    },
    {
        title:'Comentarios',
        field:'comentarios'
    },
    {
      title:'Fecha',
      field:'fecha',
      type:'date' 
    },
    {
      title:'Temporada',
      field:'temporada'
    }               
];

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
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    iconos:{
      cursor: 'pointer'
    }, 
    inputMaterial:{
      width: '100%'
    }
}));

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const Resultados=(props)=>{  
  const styles=useStyles();
  const url="https://giddingsfruit.mx/ApiIndicadores/api/analisis";
  const cookies = new Cookies();   
  const[dataT,setDataT]=useState([]);
  
  const data=async()=>{
    await axios.get(url+`/${cookies.get('IdAgen')}/${cookies.get('Tipo')}/""/0/`)
    .then(res=>{ 
      setDataT(res.data);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  
  useEffect(()=>{
    data();
  },[])
  
  return(
    <div className={styles.root}>
    <Contenedor />     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>   
    <section className="content">     
    <div className="table-responsive table-condensed table-sm">  
    <div style={{fontSize: 10,fontWeight:'bold'}}>
      <MaterialTable columns={rows} data={dataT} title="ANALISIS DE RESIDUOS DE PLAGUICIDAS"     
      className={styles.table}
      localization={{header:{actions:''}}}  
      initialState= {{ pageIndex: 0,}}   
      options={{actionsColumnIndex:-1, headerStyle: { backgroundColor: "#B0C4DE", color: "black", fontWeight:'bold', fontSize: 11 }}}
      icons={tableIcons}/>
    </div>    
    </div>   
    </section>
    </div>
  </div>
  )
  }
  export default Resultados;