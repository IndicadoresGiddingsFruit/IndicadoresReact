import React, {useEffect,useState} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';
import {Grid,Button,Modal} from '@material-ui/core';
import Contenedor from '../Contenedor.jsx';
import {makeStyles} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const useStyles=makeStyles(theme=>({
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
      width: 600,
      padding: theme.spacing(2, 4, 3),
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
}))

const ReporteVisitas = (props) => {
 const styles=useStyles(); 
 const url="https://giddingsfruit.mx/ApiIndicadores/api/visitas";  
 const url_img="https://giddingsfruit.mx/ApiIndicadores/api/imagenvisita";  
 const cookies = new Cookies(); 
 const [data, setData]= useState([]);
 const [fecha, setFecha]= useState(null);  
 const [rutaImg, setRutaImg]= useState(null);   
 const [incidencias, setIncidencias]= useState(null);   
 const [modalImg,setModalImg]=useState(false); 
 const [asesores, setasesores] = useState([]);
 var [idAgen, setIdAgen] = useState(null);
 const [error,setError]=useState(null); 
 const [idagens, setidagens] = useState([null]);
 const [admin, setAdmin] = useState(false);

 const cargarData = async (e) => {
    e.preventDefault()
    if(idAgen===null){
      idAgen=cookies.get('IdAgen');
    }   

    if(idAgen !== null){
      peticionGet();  
      setError(null);  
    }
  
    else{
      setError('Seleccione un asesor');
      return
    }
      
 }
 
  //cargar asesores
  const handlerCargarAsesores= function(e){
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${"P"}`)
    .then(res=>{    
      setasesores(res.data); 
        for(const dataObj of res.data)
        {         
          setidagens(dataObj.idAgen);  
        } 
      })      
  }

 const peticionGet=async()=>{
    await axios.get(url+`/${fecha}/${idAgen}`)
      .then(response=>{        
        if(response.data.item3.length===0)
        {
          swal({
            title:"No se encontraron datos",           
            icon: "warning",
            button: "Cerrar",
          });
          setData([]);
        }
        else{
        setData(response.data.item3);   
        }
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
   
 const handleChangeAgen=e=>{      
  setIdAgen(e.target.value);
}

 const handleChange=e=>{  
    setFecha(e.target.value);
 }
  
 const openClose_Modal=()=>{
  setModalImg(!modalImg);   
 }

 const abrirImg=async(item)=>{
    await axios.get(url_img+`/${item.idVisita}`)
    .then(response=>{   
      console.log(response.data);
           
      setRutaImg(response.data);  
      setIncidencias(item.descIncidencia);
      openClose_Modal();

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

 useEffect(()=>{
  if(cookies.get('IdAgen')==='1' || cookies.get('IdAgen')==='5')
  {
    setAdmin(true);
  }
  else{
    setAdmin(false);
  }
},[])

  const img=(
    <div className={styles.modal}>         
      <div className="card card-default">       
      <div className="card-header">      
      <button type="button" className="close" onClick={()=> openClose_Modal()}>
          <span aria-hidden="true">&times;</span>
        </button>
        <h6>Incidencias: <br /> {incidencias}</h6>
      </div> 
      <div className="card-body">
      <img src={rutaImg} style={{width: '100%', height: '100%'}} /> 
      </div>
      </div>
    </div>  
  )
  
    return(
    <div className={styles.root}>
    <Contenedor />     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>   
    <section className="content"> 
    
    <Grid container spacing={3}>
    <Grid item xs={12} md={12} lg={12}>
        
    <form onSubmit={cargarData} className="mb-2"> 
    {admin?
    <>    
      {
          error ? <span className="text-danger">{error}</span> : null
      }   
    <Grid item xs={12} md={12} lg={6}  style={{padding:0, bottom:4,display: 'inline-block'}}>       
      <select name="idAgen" className="form-control" onChange={handleChangeAgen} onClick={handlerCargarAsesores}>
      <option value={0}>--Seleccione un asesor zonal--</option>
      {
        asesores.map(item=>(
        <option key={item.idAgen} value={item.idAgen}>{item.asesor}</option>
      )
      )}
    </select>
    </Grid>
    </>
    :
      null
    }
    <Grid item xs={12} md={12} lg={5}  style={{padding:0, bottom:4,display: 'inline-block'}}>       
    <input 
        type="date" required         
        name="fecha" className="form-control"
        onChange={handleChange}
        />       
    </Grid>
    <Grid item xs={12} md={12} lg={1} style={{padding:0, bottom:4,display: 'inline-block'}}>     
      <button className="btn btn-sm btn-light shadow-lg" type="submit"><i className="fas fa-search"></i></button> 
    </Grid>
    <Grid item xs={12} md={12} lg={3} style={{padding:0, float:'right', bottom:4,display: 'inline-block'}}>
     <ReactHTMLTableToExcel id="botonExportar" 
      className="btn btn-success mr-0" 
      table="tblReportVisitas" 
      filename={fecha}
      sheet={fecha}       
      buttonText="EXCEL"/>
    </Grid>
   </form>  
   
    </Grid>

    {/* <Grid item xs={12} md={12} lg={3}>
    <form onSubmit={cargarData}  className="mb-2"> 
    <div className="col-11" style={{paddingRight:0, marginRight: 0,display: 'inline-block'}}>  
        <input 
        type="date" required         
        name="fecha" className="form-control"
        onChange={handleChange}
        />  
    </div>        
    <div className="col-1" style={{padding:0, bottom:4,display: 'inline-block'}}>  
      <button className="btn btn-sm btn-light shadow-lg" type="submit"><i className="fas fa-search"></i></button>        
    </div>    
    </form>
    </Grid> */}
    </Grid>

  <div className="table table-responsive table-condensed table-sm">
  <table className="table table-hover" style={{fontSize: 12, textAlign: 'center'}} id="tblReportVisitas">
    <thead className="thead-dark">
      <tr>
        <td>
          Código
        </td>
        <td>
          Productor
        </td>
        <td>
          Campo
        </td>
        <td>
          Descripción
        </td>
        <td>
          Sector
        </td>
        <td>
          Producto
        </td>
        <td>
          Fecha
        </td>
        <td>
          Comentarios
        </td>
        <td>
          Atendió
        </td>
        <td>
          Etapa
        </td>        
        <td>
          Folio
        </td>
        <td>
          Imagen
        </td>
      </tr>
    </thead>
    <tbody>
    {
    data.map(item=>(
      <React.Fragment key={item.idVisita}>      
      <tr>
      <td>{item.cod_prod}</td>
      <td>{item.productor}</td>
      <td>{item.cod_Campo}</td>
      <td>{item.campo}</td>
      <td>{item.idSector}</td>
      <td>{item.tipo}</td>
      <td>{item.fecha}</td> 
      <td>{item.comentarios}</td> 
      <td>{item.atendio}</td> 
      <td>{item.etapa}</td> 
      <td>{item.folio}</td> 
      <td><Button endIcon={<AddBox />} onClick={()=>abrirImg(item)} /></td> 
      </tr> 
      </React.Fragment>
    ))
    }  
  </tbody>
  </table>
  </div> 
  </section>

  <Modal open={modalImg} onClose={openClose_Modal}>{img}</Modal>
  
  </div>
  </div>
  )
  }
export default ReporteVisitas;
