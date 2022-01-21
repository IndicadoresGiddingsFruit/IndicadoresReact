import React, {useState,useEffect,forwardRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {useParams} from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {makeStyles, Hidden,lighten} from '@material-ui/core'
import GetAppIcon from '@material-ui/icons/GetApp';
import MaterialTable from 'material-table';
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
import Contenedor from '../Contenedor.jsx';
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

const tablerows=[    
    {
        title:'Zona',
        field:'zona'
    },
    {
        title:'Departamento',
        field:'departamento'
    },
    {
        title:'Usuario',
        field:'usuario'
    },
    {
        title:'Pregunta',
        field:'pregunta'
    },
    {
        title:'Respuesta',
        field:'respuesta'
    }
];

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

const useStyles=makeStyles(theme=>({
  root:{
    display:'flex'
  },
   toolbar: theme.mixins.toolbar,
   content: {
      flexGrow: 1,
      
      padding: theme.spacing(3),
    },    
}))
 
const RespuestasTotal=(props)=>{  
  const styles=useStyles(); 
    const {id}=useParams();     
    const url="https://giddingsfruit.mx/ApiIndicadores/api/encuestas";      
    const [tabledata,setTableData]=useState([]);     
    const [nombrEncuesta,setNombrencuesta]=useState('');  
   
    useEffect(() => {
        getDatos();
    }, [])

    const getDatos=async()=>{       
      await axios.get(url+"/"+id)
        .then(res=>{     
            setTableData(res.data);    
            console.log(res.data)           
            for(const dataObj of res.data)
            {
              setNombrencuesta(dataObj.nombre)                       
            }    
        })          
    }

    return (
    <div className={styles.root}>
    <Contenedor />
     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>   
    <section className="content">  
    <div align="right" className="mb-2">
     <ReactHTMLTableToExcel id="botonExportar" 
      className="btn btn-success" 
      table="tblRespuestas" 
      filename="Resultados" 
      sheet="Resultados"       
      buttonText="Descargar"/>
      </div>

    <div className="table-responsive table-condensed table-sm tabla">
    <table className="table table-hover" style={{fontSize: 11, textAlign: 'center'}} id="tblRespuestas">
    <thead className="thead-light">
      <tr>
        <th colSpan={5}>{nombrEncuesta}</th>
      </tr>
      <tr> 
        <th>Zona</th>
        <th>Departamento</th>
        <th>Usuario</th>
        <th>Pregunta</th> 
        <th>Respuesta</th>        
      </tr>
    </thead>
    <tbody style={{backgroundColor: 'white'}}>  
    {
    tabledata.map(item=>(
      <React.Fragment key={item.idPregunta}>      
      <tr>
      <td>{item.zona}</td>
      <td>{item.departamento}</td>
      <td>{item.usuario}</td>
      <td>{item.pregunta}</td> 
      <td>{item.respuesta}</td> 
      </tr> 
      </React.Fragment>
    ))
    }  
   </tbody>
   </table>
   </div>
   
    </section>
    </div>  
    </div>
    )
    }

 export default RespuestasTotal
