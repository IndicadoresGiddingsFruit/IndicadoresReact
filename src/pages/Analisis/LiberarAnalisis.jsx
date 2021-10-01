import React, {useEffect,useState,forwardRef} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import MaterialTable from 'material-table';
import {makeStyles} from '@material-ui/core' 
import Contenedor from '../Contenedor.jsx';
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
import swal from 'sweetalert';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';

const rows=[
  {
      title:'Id',
      field:'id',
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
    title:'codZona',
    field:'codZona',
    width: -1,
    hidden: true
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
      field:'descEstatus'
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
    title:'ParteMuestreada',
    field:'parteMuestreada'
  },
  {
      title:'Comentarios',
      field:'comentarios'
  },
  {
    title:'Traza',
    field:'traza'
  },
  {
    title:'Orgánico',
    field:'organico'
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

const LiberarAnalisis=(props)=>{  
  const styles=useStyles();
  const url="https://giddingsfruit.mx/ApiIndicadores/api/analisis";
  //const url="https://localhost:44344/api/analisis";
  const cookies = new Cookies();   
  const[dataT,setDataT]=useState([]);
  var id;

  const data=async()=>{ 
      await axios.get(url+`/${cookies.get('IdAgen')}/${null}/${cookies.get('Depto')}/""/0/F`)
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
 
  const seleccionarRegistro=(registro)=>{   
    id=registro.id;
    abrirModal();
  }

   const abrirModal=()=>{ 
    swal({
      title: "¿Está seguro de cambiar el estatus de Fuera de Limite a Liberado?",
      icon: "info",
      buttons: ["No","Si"],
    }).then((value) => {
      if(value){
       liberar();
      }
    });  
  }

  const liberar=async()=>{   
    await axios.patch(url+`/${id}/${cookies.get('IdAgen')}`)
    .then(response=>{             
     const arrFiltrado=dataT.filter(item=> item.id!==id)
     setDataT(arrFiltrado);
     swal({
       title: "Registro actualizado correctamente",
       icon: "success",
       button: "ok",
     });
     
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
   
  return(
    <div className={styles.root}>
    <Contenedor />     
    <div className={styles.content}>
    <div className={styles.toolbar}></div>   
    <section className="content">     

    <div className="table-responsive table-condensed table-sm">  
    <div style={{fontSize: 10,fontWeight:'bold'}}>
      <MaterialTable 
      columns={rows} id="tblReportResultados"
      data={dataT} 
      title="Liberar análisis Fuera de Limite"     
      className={styles.table}
      localization={{header:{actions:''}}}  
      initialState= {{ pageIndex: 0,}}   
      options={{actionsColumnIndex:-1, headerStyle: { backgroundColor: "#B0C4DE", color: "black", fontWeight:'bold', fontSize: 11 }}}
      icons={tableIcons}
      actions={[
        {
          icon: () => <CheckCircleTwoToneIcon />,
          tooltip:'Liberar',
          onClick:(event,rowData)=>seleccionarRegistro(rowData)
        },
      ]}
      options={{
        actionsColumnIndex:-1,       
      }}
      localization={{header:{actions:''}}}  
      />     
    </div>    
    </div>        

    </section>
    </div>
  </div>
  )
  }
  export default LiberarAnalisis;