import React, {useState,useEffect} from 'react';
import axios from 'axios';
import Contenedor from '../Contenedor.jsx';
import Cookies from 'universal-cookie';
import {Modal,TextField,Button, Typography} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Link} from 'react-router-dom';
import swal from 'sweetalert';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Autocomplete from '@material-ui/lab/Autocomplete'; 
import {makeStyles} from '@material-ui/core/styles'; 
import {withRouter} from 'react-router-dom';

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
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  modal_analisis: {
    position: 'absolute',
    width: 1000,
    height: 650,
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

const Encuestas =(props)=>{ 
  const styles=useStyles();
  const url="https://giddingsfruit.mx/ApiIndicadores/api/encuestas";
  const url_tipo="https://giddingsfruit.mx/ApiIndicadores/api/encuestastipo";
  const cookies = new Cookies(); 
  const [loading,setLoading]=useState(false); 
  const [admin,setAdmin]=useState(false); 
  const [unAdmin,setunAdmin]=useState(false); 
  const [data, setData]= useState([]);
  const [error,setError]=useState(null);
  const [modalTipo,setmodalTipo]=useState(false);
  const [errorTipo,setErrorTipo]=useState(null);
  const [tipos,setTipos]=useState([]);
  const [tipo,setTipo]=useState({
    idTipo:parseInt(),
    descripcion: ''
  });
  const [encuestas,setEncuestas]=useState([]);
  const [encuesta,setEncuesta]=useState('');
 
  /*const [encuesta,setEncuesta]=useState({
    nombre: '',
    descripcion: '',
    idTipo:parseInt()
  }); */
   
 const [detailsopen, setdetailsopen] = useState([]);
 const [open, setOpen] = useState(false);
 
 const toggleShown=id=>{
    const shownState=detailsopen.slice();
    const index=shownState.indexOf(id);
    if(index>=0){
      shownState.splice(index,1);
      setdetailsopen(shownState);
    }
    else{
      shownState.push(id);
      setdetailsopen(shownState);
      setOpen(true)
    }
 }
 
 useEffect(()=>{
    if(cookies.get('Id')==='399'){
      setAdmin(true);
      getEncuestas();
      getTipos();
      setunAdmin(false);
    }
    else {
      setAdmin(false);
      getEncuestasUsuarios();
      setunAdmin(true);
    }
 },[])

 const getTipos=async()=>{
    await axios.get(url_tipo)
    .then(res=>{          
      setTipos(res.data);   
    })
 }   

 const handleChangeTipo=e=>{     
    const {name, value}=e.target;    
    setTipo(prevState=>({
      ...prevState,
      [name]: value
    }));   
 }

 const agregarTipo=e=>{ 
  e.preventDefault();
  
   if(tipo.length===0 || tipo.descripcion=== ""){
        setErrorTipo('Porfavor escriba algo')
        return
    } 
    peticionPostTipo();
 }

 const peticionPostTipo=async()=>{
    await axios.post(url_tipo,tipo)
    .then(response=>{
      setData(data.concat(response.data));
      swal({
        title: "Listo!",
        icon: "success",
        button: "ok",
      }).then(function() {
        /* setTipos([
          ...tipos,
          {idTipo:tipo.idTipo, descripcion:tipo.descripcion}
      ]) */
      setTipos([]);
      getTipos();
      setTipo('');
      setErrorTipo(null);
      openClose_ModalTipo();
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
  
 const getEncuestas=async()=>{
    await axios.get(url)
    .then(res=>{          
      setEncuestas(res.data);     
    })
 }   

 const getEncuestasUsuarios=async()=>{
  await axios.get(url+"/"+0+"/"+cookies.get('Id'))
  .then(res=>{    
    setEncuestas(res.data.item2);   
  })  
 }  

 const peticionPost=async()=>{
  await axios.post(url,encuesta)
  .then(response=>{
    setData(data.concat(response.data));

  setEncuesta(''); 
  setError(null);
  setEncuestas([]);
  getEncuestas();
  setLoading(false);
 
  swal({
    title: "Datos guardados correctamente",   
    icon: "success",
    button: "ok",
  }).then((value) => {
    if(value){         
      props.history.push('/editar/' + response.data.id);
    }
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

 const handleChange= e =>{   
    const {name, value}=e.target;    
    setEncuesta(prevState=>({
      ...prevState,
      [name]: value
    })); 
 } 

 const handleChangeAutocomplete = (event, value, name) => {  
    if (value && value.idTipo) {
      setEncuesta((prevState) => ({
        ...prevState,
        [name]: value.idTipo
      }));
    }
 };

 const agregarEncuesta=e=>{ 
  e.preventDefault();  
    setLoading(true);
    peticionPost();
    e.target.reset();
 }

 const eliminar=async(id)=>{
   await axios.delete(url+"/"+id)
  .then(response=>{
    setData(data.concat(response.data));
    const arrFiltrado=encuestas.filter(item=> item.idEncuesta!==id)
    setEncuestas(arrFiltrado);

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

 const openClose_ModalTipo=()=>{
    setmodalTipo(!modalTipo);
 }

 const abrirModal=e=>{   
      setmodalTipo(true);
 }

 const tipo_encuesta=(
 <div className={styles.modal}>          
    <div className="card card-default">
      <div className="card-header">     
         <h6 className="font-weight-bold text-secondary">Tipo de encuesta</h6>      
      </div> 
      <div className="card-body">
      <form onSubmit={agregarTipo}>
        {
          errorTipo? <span className="text-danger">{errorTipo}</span>:null
        }
        <TextField type="text" className="form-control mb-2" name="descripcion" placeholder="Tipo de encuesta" autoComplete="off" onChange={handleChangeTipo}/>
        <Button variant="contained" color="primary" className="btn btn-primary btn-block" endIcon={<AddCircleIcon />} type="submit">Agregar</Button>   
      </form>
    </div>
    </div>    
    </div>
 )

return(
<div className={styles.root}>
<Contenedor />
 
<div className={styles.content}>
<div className={styles.toolbar}> </div>  
     
<section>  
  <div className="row" style={{height:'100%'}}>
  {admin?(
    <> 
    <div className="col-12 col-sm-8">
    <Typography variant="h6" align="center">Encuestas creadas</Typography>
   {/*  <h5 className="text-center">Encuestas creadas</h5>   */}
    <div className="table-responsive table-condensed table-sm tabla" style={{fontSize: 11, margin: 'auto', width: '100%'}}>
    <table className="table table-hover">
    <thead className="thead-light">
      <tr>
        <th>Usuarios</th>  
        <th colSpan={2}>Nombre</th>
        <th>Creada</th>
        <th>Ultima modificación</th>
        <th>Tipo</th>
        <th>Estatus</th>               
        <th>Editar</th>
        <th>Eliminar</th>
        <th>Respuestas</th>
        <th>Respuestas</th>
      </tr>
    </thead>
    <tbody style={{backgroundColor: 'white', textAlign: 'center'}}>   
    {
    encuestas.length===0?(
      <React.Fragment key={0}>
      <tr>
        <td colSpan={11}>No hay encuestas creadas</td>
      </tr>
      </React.Fragment>
    ):(
      encuestas.map(item=>(
        <React.Fragment key={item.idEncuesta}>
        <tr>        
        <td>              
            <IconButton aria-label="expand row" size="small" onClick={() => toggleShown(item.idEncuesta)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>         
        </td>  
        <td>{item.nombre}</td>
        <td>{item.descripcion}</td>
        {item.fecha===null || item.fecha===undefined ?
          (
            <td></td> 
          ):(
            <td><span>{(new Date(item.fecha)).toLocaleDateString() }</span></td>
          )
        }  
        
        {item.fecha_modificacion===null || item.fecha_modificacion===undefined ?
          (
            <td></td> 
          ):(
            <td><span>{(new Date(item.fecha_modificacion)).toLocaleDateString() }</span> </td>   
          )
        }  
        {item.tipo===null?
          (
            <td></td> 
          ):(
            <td>{item.tipo}</td>
          )
        } 
        {item.estatus==='0'?
          (
            <td>TERMINADO</td> 
          ):(
            <td>VIGENTE</td>
          )
        } 
       
        <td><Link to={`/editar/${item.idEncuesta}`} className="btn btn-warning btn-sm float-right"><i className="fas fa-edit"></i></Link></td>  
        <td><button className="btn btn-danger btn-sm float-right mx-2" type="submit" onClick={() => eliminar(item.idEncuesta)}><i className="fas fa-trash"></i></button></td>    
        <td><Link to={`/respuestastotal/${item.idEncuesta}`} className="btn btn-primary btn-sm float-right"><i className="fas fa-arrow-circle-right"></i></Link></td>    
        </tr>
        {detailsopen.includes(item.idEncuesta) && (
        <tr key={item.idEncuesta}>
                    <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>              
                          <table size="small" aria-label="purchases">
                          <thead className="thead-light">
                          <tr> 
                            <th>Usuarios</th> 
                            <th>Fecha de respuesta</th>
                            <th>Respuestas</th>
                          </tr>
                          </thead>
                          <tbody>
                      {
                      item.listaUsuarios.length===0?(
                        <React.Fragment key={0}>
                        <tr>
                          <td colSpan={3}>No hay usuarios agregados</td>
                        </tr>
                        </React.Fragment>
                      ):(
                        item.listaUsuarios.map(subitem=>(
                        <React.Fragment>
                        <tr key={subitem.idUsuario}>                       
                        <td>{subitem.usuario}</td> 
                        {subitem.fecha_respuesta===null?
                        (
                        <>
                        <td></td> 
                        <td></td>
                        </>
                        ):(
                        <>
                        <td><span>{(new Date(subitem.fecha_respuesta)).toLocaleDateString() }</span> </td> 
                        <td><Link to={`/respuestas/${item.idEncuesta}/${subitem.idUsuario}`} className="btn btn-primary btn-sm float-right"><i className="fas fa-arrow-circle-right"></i></Link></td>    
                        </>
                        )
                        } 
                        </tr>   
                        </React.Fragment>
                      ))
                      )
                      }                  
                      </tbody>
                      </table>
                    </Box>
                  </Collapse>
                  </td>
                  </tr>
        )} 
        </React.Fragment>
        ))
      )
      }               
    </tbody>
   </table>
   </div>
   </div>
    <div className="col-11 col-sm-3">   
    <Typography variant="h6" align="center">Nueva Encuesta</Typography>
    {/* <h5 className="text-center">Nueva Encuesta</h5>*/}
      <form onSubmit={agregarEncuesta}>
      {
          error? <span className="text-danger">{error}</span>:null
      }
        <TextField required type="text" className="form-control mb-2" name="nombre" placeholder="Nombre de la encuesta" autoComplete="off" onChange={handleChange}/>
        <TextField required type="text" className="form-control mb-2" name="descripcion" placeholder="Descripción" autoComplete="off" onChange={handleChange}/>         
          <Autocomplete       
              name="idTipo"  
              options={tipos}
              getOptionLabel={(option) => option.descripcion || ''}
              defaultValue={[tipos[0]]}
              onChange={(event, value) =>
                handleChangeAutocomplete(event, value, "idTipo")
              }               
              renderInput={params => (
                <TextField required {...params} variant="standard" placeholder="Tipo" margin="normal" fullWidth />
              )}
          />  
        <Button variant="contained" color="primary" className="btn btn-primary btn-block" type="submit">{loading ? "Guardando..." : "Guardar"} </Button>   
      </form>
    </div>
    <div className="col-1" style={{padding:0, margin: 0}}>  
     <button type="button" className="btn btn-primary" style={{padding:5, marginTop: 130}} onClick={abrirModal}><i className="fas fa-plus-circle"></i></button>
    </div>
    </>
    ):false} 
   </div>

   <div className="row">
   {unAdmin?(
    <>      
    <div className="col-12"> 
    <h5 className="text-center">¡Bienvenido a Encuestas 360!</h5>
    <hr/>
    <div className="table-responsive table-condensed table-sm tabla">
    <table className="table table-hover" style={{fontSize: 11, textAlign: 'center'}}>
    <thead className="thead-light">
      <tr>
        <th style={{display: 'none'}}>Id</th>        
        <th colSpan={2}>Nombre</th>
        <th>Fecha</th>
        <th>Estatus</th>
        <th>Fecha de respuesta</th>
        <th></th>
      </tr>
    </thead>
    <tbody style={{backgroundColor: 'white'}}>   
    {
    encuestas.length===0?(
      <React.Fragment key={0}>
      <tr>
        <td colSpan={9}>No hay encuestas pendientes</td>
      </tr>
      </React.Fragment>
    ):(
      encuestas.map(item=>(
        <React.Fragment key={item.idEncuesta}>
        <tr>
        <td style={{display: 'none'}}>{item.idEncuesta}</td>        
        <td>{item.nombre}</td>
        <td>{item.descripcion}</td>
        <td><span>{(new Date(item.fecha)).toLocaleDateString()}</span></td>
        {item.estatus==='0'?
          (
            <td>TERMINADO</td> 
          ):(
            <td>VIGENTE</td>
          )
        } 
        {item.fecha_Respuesta===null?
          (
            <>
            <td></td> 
            <td><Link to={`/responder/${item.idEncuesta}`} className="btn btn-warning btn-sm float-right">Responder <i className="fas fa-edit"></i></Link></td>  
            </>
          ):(
            <>
            <td><span>{(new Date(item.fecha_Respuesta)).toLocaleDateString() }</span></td>  
            <td><Link to={`/respuestas/${item.idEncuesta}/${cookies.get('Id')}`} className="btn btn-primary btn-sm float-right">Ver respuestas <i className="fas fa-arrow-circle-right"></i></Link></td>  
           </>
          )
        }               
      </tr>  
        </React.Fragment>
        ))
      )
      }               
    </tbody>
   </table>
   </div>
  </div>  
  </>
  ):false} 
</div> 

  <Modal open={modalTipo} onClose={openClose_ModalTipo}>{tipo_encuesta}</Modal>
  </section>
  </div>  
  </div> 
)
}

export default withRouter(Encuestas);