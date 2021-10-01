import React, {useEffect,useState,forwardRef} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import MaterialTable from 'material-table';
import {makeStyles,Modal, Grid} from '@material-ui/core' 
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
import GetAppIcon from '@material-ui/icons/GetApp';
import ExportExcel from 'react-export-excel';

const ExcelFile=ExportExcel.ExcelFile;
const ExcelSheet=ExportExcel.ExcelSheet;
const ExcelColumn=ExportExcel.ExcelColumn;

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
      width: 800,
      padding: theme.spacing(2, 4, 3),
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

const Movimientos=()=>{  
  const styles=useStyles();
  //const url="https://giddingsfruit.mx/ApiIndicadores/api/analisis";
  const url="https://localhost:44344/api/analisis";
  const cookies = new Cookies();   
  const[data,setData]=useState([]);
  const [loading,setLoading]=useState(false); 
  const [modalEditar, setModalEditar]= useState(false);
  const [estatus, setEstatus] = useState(null); 
  const [admin, setAdmin] = useState(false);
  const [zonas, setzonas] = useState([]);
  const [codZona, setcodZona] = useState([null]);//cod de zonas
  const [liberacionUSA, setLiberacionUSA] = useState(0);
  const [liberacionEU, setLiberacionEU] = useState(0);
  const [filaSeleccionada,setfilaSeleccionada]=useState({}); 
  var idAnalisis;
  const [filaEditada,setfilaEditada]=useState({   
    codZona: "",
    fecha_envio: "",
    fecha_entrega: "",
    estatus: "",
    laboratorio: "",
    comentarios: "",
    idAgen: parseInt(cookies.get('IdAgen')),
    liberacionUSA: "",
    liberacionEU: "",
    folio: "",
    traza: "",
    organico: "",
    parteMuestreada: ""
  })   

  const getdata=async()=>{
    if(cookies.get('Depto')!=='null')    
    { 
      await axios.get(url+`/${cookies.get('IdAgen')}/${null}/${cookies.get('Depto')}/""/0/${null}`)
      .then(res=>{ 
        setData(res.data);
      })
      .catch(err=>{
        console.log(err);
      })
    }
    else{
      await axios.get(url+`/${cookies.get('Id')}/${cookies.get('Tipo')}/${null}/""/0/${null}`)
      .then(res=>{ 
        setData(res.data);
      })
      .catch(err=>{
        console.log(err);
      })
    }
  }
  
  useEffect(()=>{
    if(cookies.get('IdAgen')==='205' || cookies.get('IdAgen')==='216'){
      setAdmin(true);     
    }       
    else{
      setAdmin(false);  
    }
    getdata();
  },[])
  
  const cargarZonas=async()=>{   
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json")
     .then(res=>{    
      setzonas(res.data); 
      for(const dataObj of res.data)
      {
        setcodZona(dataObj.codigo);
      }
    })      
  }

  const handleChange=e=>{   
    const {name, value}=e.target;    
    setfilaEditada(prevState=>({
        ...prevState,
        [name]: value
      }));     
  }

  const handleChangeEstatus=e=>{    
    setEstatus(e.target.value);        
  
    const {name, value}=e.target;    
    setfilaEditada(prevState=>({
      ...prevState,
      [name]: value
    }));     
  }

  const abrirModalEliminar=()=>{
   if(admin){
    swal({
      title: "¿Está seguro de eliminar esta información?",
      icon: "info",
      buttons: ["No","Si"],
    }).then((value) => {
      if(value){
        borrar();
      }
    }); 

   }
   else{
     swal({
          title: "¡No se puede borrar el registro!", 
          icon: "warning",
          button: "Cerrar",
        });
    }
  }
  
  const abrirCerrarModalEditar=()=>{   
    if(admin){
      setModalEditar(!modalEditar);
     }
     else{
       swal({
            title: "¡No se puede editar el registro!", 
            icon: "warning",
            button: "Cerrar",
          });
      }
  }

  const seleccionarRegistro=(registro,opcion)=>{    
    setfilaSeleccionada(registro); 
    idAnalisis=registro.id;

    (opcion==="Editar")?abrirCerrarModalEditar():abrirModalEliminar()
  }

  const borrar=async()=>{      
   await axios.delete(url+"/"+idAnalisis)
   .then(response=>{        
    
    const arrFiltrado=data.filter(item=> item.id!==filaSeleccionada.id)
    setData(arrFiltrado);

    swal({
      title: "Registro eliminado correctamente",
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

  const editar = (e) => {
    e.preventDefault();
    setLoading(true);
    guardar();
  }

  const guardar=async()=>{      
 await axios.put(url+"/"+filaSeleccionada.id+"/"+liberacionUSA+"/"+liberacionEU,filaEditada)
  .then(response=>{   
  setModalEditar(false);  
  var res_analisis, res_traza, res_organico;

  if(response.data.estatus==="L"){
    res_analisis="LIBERADO";
  }
  if(response.data.estatus==="R"){
    res_analisis="CON RESIDUOS";
  }
  if(response.data.estatus==="P"){
    res_analisis="EN PROCESO";
  }
  if(response.data.estatus==="F"){
    res_analisis="FUERA DE LIMITE";
  }
  if(response.data.traza==="1")
  {
    res_traza="SI";
  }
  else
  {
    res_traza="";
  }
  if(response.data.organico==="1")
  {
    res_organico="SI";
  }
  else
  {
    res_organico="";
  }

  const arrayEditado = data.map(item => (
      item.id === filaSeleccionada.id ? 
      {
        id:filaSeleccionada.id,
        cod_Prod:filaSeleccionada.cod_Prod,
        cod_Campo:filaSeleccionada.cod_Campo,
        sector:item.sector,
        productor:item.productor,        
        tipo:item.tipo,
        producto:item.producto,
        zona:item.zona,
        fecha_envio:filaSeleccionada.fecha_envio,
        fecha_entrega:filaSeleccionada.fecha_entrega,        
        descEstatus:res_analisis,
        num_analisis:item.num_analisis,
        laboratorio:filaSeleccionada.laboratorio,
        liberacionUSA:response.data.liberacionUSA,
        liberacionEU:response.data.liberacionEU,
        parteMuestreada:response.data.parteMuestreada,
        comentarios:filaSeleccionada.comentarios,
        traza:res_traza,
        organico:res_organico,
        fecha:response.data.fecha,
        temporada:item.temporada,
        
      } : item
    ))
    setData(arrayEditado);    
   
    swal({
      title: "Datos actualizados correctamente",
      icon: "success",
      button: "ok",
    });

  }).catch(error=>{
    swal({
      title: "Algo salió mal",
      text:error.response.data,
      icon: "error",
      button: "Cerrar",
    });
      console.log(error.response);
      console.log(error.request);
      console.log(error.message);
  }) 
  setLoading(false);
  }

  const bodyEditar=(
    <div className={styles.modal}>
     <div className="row">
    <form onSubmit={editar}>
    <div className="modal-header">
      <h6>Modificar registro</h6>
    </div>
    <div className="modal-body">

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
          onChange={cargarZonas} autoComplete="off"
        />
        </Grid>
        <Grid item xs={12} md={12} lg={6}>  
        Zona:     
        <select name="codZona" className="form-control" onChange={handleChange} onClick={cargarZonas}>
          <option value={0}>Seleccione</option>
          {
            zonas.map(item=>(
            <option key={item.codigo} value={item.codigo}>{item.descZona}</option>
          )
        )}
      </select>           
       </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Fecha de envio:     
         <input 
          type="date"  
          className="form-control"
          name="fecha_envio"         
          variant="outlined"  
          onChange={handleChange}
        />       
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Fecha de entrega:   
        <input 
          type="date"  
          className="form-control"
          name="fecha_entrega"         
          variant="outlined"  
          onChange={handleChange}
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
          <select name="estatus" className="form-control" onChange={handleChangeEstatus}>
            <option value={0}>Seleccione</option>          
            <option value={'R'}>CON RESIDUOS</option>
            <option value={'P'}>EN PROCESO</option>
            <option value={'F'}>FUERA DE LIMITE</option>
            <option value={'L'}>LIBERADO</option>
          </select>             
        </Grid>

        <Grid item xs={12} md={12} lg={6}>     
      Laboratorio:    
      <select name="laboratorio" className="form-control" onChange={handleChange}>
            <option value={0}>Seleccione</option>          
            <option value={'AGQ'}>AGQ</option>
            <option value={'AGROLAB'}>AGROLAB</option>
            <option value={'PRIMUSLAB'}>PRIMUSLAB</option>
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
        Parte Muestreada: 
          <select name="parteMuestreada" className="form-control" onChange={handleChange} 
          >
            <option value={0}>Seleccione</option> 
            <option value={'J'}>FOLLAJE</option>          
            <option value={'F'}>FRUTA</option>
            <option value={'S'}>SUELO</option>
          </select>             
        </Grid>

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
        onChange={handleChange}
        /> Traza    
    </Grid>

    <Grid item xs={12} md={12} lg={6}>  
      <input type="checkbox" name="organico"
        defaultChecked={false} className="mt-4" 
        onChange={handleChange}
        /> Organico    
    </Grid>

      <Grid item xs={12} md={12} lg={12}>
      Comentarios:     
      <textarea 
          className="form-control" 
          id="comentarios" 
          rows="3"        
          name="comentarios" 
          onChange={handleChange} autoComplete="off"
        />        
      </Grid>      
      
      </Grid>
      </div>
    </div>
    </div> 
    
    </div>
    <div className="modal-footer">
    <button disabled={loading ? true: false}
      className="btn btn-primary active float-right" type="submit">
      {loading ? "Espere..." : "Guardar"}</button>
    <button className="btn btn-secondary active float-right" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
    </div>
    </form>
    </div>
    </div>
  )

  return(
    <div className={styles.root}>
    <Contenedor />     
    <div className={styles.content}>
    <div className={styles.toolbar}></div>   
    <section className="content">  
    <ExcelFile element={<button className="btn btn-success m-2" type="submit">
       <GetAppIcon /> Exportar a Excel</button>} filename="ANALISIS DE RESIDUOS DE PLAGUICIDAS">
      <ExcelSheet data={data} name="ANALISIS DE RESIDUOS DE PLAGUICIDAS">
        <ExcelColumn label="Código" value="cod_Prod"/>      
        <ExcelColumn label="Campo" value="cod_Campo"/>      
        <ExcelColumn label="Sector" value="sector"/> 
        <ExcelColumn label="Productor" value="productor"/>      
        <ExcelColumn label="Tipo" value="tipo"/>      
        <ExcelColumn label="Producto" value="producto"/>      
        <ExcelColumn label="Zona" value="zona"/>      
        <ExcelColumn label="Fecha/envío" value="fecha_envio"/>      
        <ExcelColumn label="Fecha/entrega" value="fecha_entrega"/>      
        <ExcelColumn label="Estatus" value="descEstatus"/>      
        <ExcelColumn label="Num/análisis" value="num_analisis"/>      
        <ExcelColumn label="Laboratorio" value="laboratorio"/>      
        <ExcelColumn label="LiberaciónUSA" value="liberacionUSA"/>      
        <ExcelColumn label="LiberaciónEU" value="liberacionEU"/>   
        <ExcelColumn label="Parte/Muestreada" value="parteMuestreada"/>      
        <ExcelColumn label="Comentarios" value="comentarios"/>      
        <ExcelColumn label="Traza" value="traza"/>      
        <ExcelColumn label="Orgánico" value="organico"/>      
        <ExcelColumn label="Fecha" value="fecha"/>      
        <ExcelColumn label="Temporada" value="temporada"/>                
      </ExcelSheet>
    </ExcelFile>  


    <div className="table-responsive table-condensed table-sm">  
    <div style={{fontSize: 10,fontWeight:'bold'}}>
      <MaterialTable 
      columns={rows} id="tblReportResultados"
      data={data} 
      title="Movimientos de Material de Empaque (Entradas y Salidas)"     
      className={styles.table}
      localization={{header:{actions:''}}}  
      initialState= {{ pageIndex: 0,}}   
      options={{actionsColumnIndex:-1, headerStyle: { backgroundColor: "#B0C4DE", color: "black", fontWeight:'bold', fontSize: 11 }}}
      icons={tableIcons}
      actions={[
        {
        icon: () => <Edit />,
        tooltip:'Editar',
        onClick:(event,rowData)=>seleccionarRegistro(rowData, "Editar")
        },
        {
          icon: () => <DeleteOutline />,
          tooltip:'Eliminar',
          onClick:(event,rowData)=>seleccionarRegistro(rowData, "Eliminar")
        },
      ]}
      options={{
        actionsColumnIndex:-1,       
      }}
      localization={{header:{actions:''}}}  
      />
     
    </div>    
    </div>       
  
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>{bodyEditar}</Modal>

    </section>
    </div>
  </div>
  )
  }
  export default Movimientos;