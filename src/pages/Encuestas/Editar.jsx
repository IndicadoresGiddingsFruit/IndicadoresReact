    import React, {useState,useEffect} from 'react';
    import axios from 'axios';
    import Contenedor from '../Contenedor.jsx';
    import Cookies from 'universal-cookie';
    import {TextField,Button,makeStyles,Grid} from '@material-ui/core'
    import AddCircleIcon from '@material-ui/icons/AddCircle';
    import CreateIcon from '@material-ui/icons/Create';
    import {useParams} from 'react-router-dom';
    import swal from 'sweetalert'
    import Box from '@material-ui/core/Box';
    import Collapse from '@material-ui/core/Collapse';
    import IconButton from '@material-ui/core/IconButton';
    import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
    import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
    import Autocomplete from '@material-ui/lab/Autocomplete'; 
    import { ArrowRight } from '@material-ui/icons';
   
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

    const defaultState = {      
      respuesta: ""
    };

    const Editar=(props)=>{  
      const styles=useStyles();
      const url="https://giddingsfruit.mx/ApiIndicadores/api/encuestas";

      //const url="https://localhost:44344/api/encuestas"
      
      const url_usuarios="https://giddingsfruit.mx/ApiIndicadores/api/usuarios";

      const url_det="https://localhost:44344/api/encuestasdet";

      const url_res="https://localhost:44344/api/encuestasres";

      const url_us="https://giddingsfruit.mx/ApiIndicadores/api/encuestasusuarios";

      const cookies = new Cookies();
      const {id}=useParams();  
      const [loadingP,setLoadingP]=useState(false); 
      const [addRespuesta,setAddRespuesta]=useState(false); 
     
      const [loadingU,setLoadingU]=useState(false);
      var [tipoRespuesta,setTipoRespuesta] = useState(null);  
      var [listRespuestas, setlistRespuestas] = useState([{}]);
      const [rows, setRows] = useState([defaultState]);
      const [respuestas, setRespuestas] = useState([]);
      const [getRespuestas, setgetRespuestas] = useState([]);

      const [data, setData]= useState([]);
      const [error,setError]=useState(null);
      const [nombrEncuesta,setNombrencuesta]=useState(null);    
      const [modoEdicion,setmodoEdicion]=useState(false);   
    
      const [preguntas,setPreguntas]=useState([]);  
      const [idPregunta,setidPregunta]=useState('');
     
      const [pregunta,setPregunta]=useState({
        idEncuesta:id,
        pregunta:''
      });

      const [errorU,setErrorU]=useState(null);
      const [listusuarios,setlistusuarios]=useState([]); 
      const [usuarios,setUsuarios]=useState([]); 
           
      const [usuario,setUsuario]=useState({
        idUsuario:parseInt(),
        completo:'',
      }); 
      
      const [detailsopen, setdetailsopen] = useState([]);
      const [open, setOpen] = useState(false);

      const toggleShown=id=>{
      const shownState=detailsopen.slice();       
      const index=shownState.indexOf(id);
       
      if(index>=0){         
          shownState.splice(index,1);
          setdetailsopen(shownState);
         /*  setOpen(false)
          setRespuestas('');  */
      }
      else{
          shownState.push(id);
          setdetailsopen(shownState);
          setOpen(true);
          gRespuestas(id); 
      }

        /* if(open){
          setOpen(false)
          setRespuestas(''); 
        }
        else{
          setOpen(true)
          gRespuestas(id)    
        }     */    
      }

  useEffect(() => {
    getDatos()    
    getUsuarios()
    getListUsuarios()
  }, [])

  //------------------------------- 
  const handleChangePreguntas=e=>{
    const {name, value}=e.target;    
    setPregunta(prevState=>({
      ...prevState,
      [name]: value
    }));
  }  

  const handleTipoRespuesta=e=>{
    setAddRespuesta(true);
    setTipoRespuesta(e.target.value); 
    if(e.target.value==='2'){
      setRespuestas([{ respuesta: "Texto libre" }]);
    }   
  }  

  const handleChangeNRespuestas=(e)=>{
    setlistRespuestas(prevState => {
    prevState = [];
    for (let i = 1; i <= e.target.value; i++) {
      prevState.push(i);
    }
    let stateCopy = [...prevState];
    return stateCopy;
    });   
  }  

  const handleOnRemove = index => {
    const copyRows = [...rows];
    copyRows.splice(index, 1);
    setRows(copyRows);
  };

  const handleOnChangeR = (id) => (e) => {
    setRows((prevState) => ({      
      respuesta: e.target.value
    }));
  };

  const handleBlur = () => {
    setRespuestas(respuestas.concat(rows));
  };

  var listItems =listRespuestas.map((id) => (
    <li key={idPregunta}>
      <TextField type="text" required onChange={handleOnChangeR(id)} className="form-control mb-2" autoComplete="off" onBlur={handleBlur}/>
     {/* <button className="btn-danger btn-sm" style={{float:'right'}} onClick={onRemove}><i className="fas fa-times-circle"></i></button> */}
    </li>
  ));

  //-------------------------------CARGAR DATOS
  const getUsuarios=async()=>{   
    axios.get(url_usuarios)
      .then(res=>{ 
        setlistusuarios(res.data); 
    })
  }

  const getDatos=async()=>{
    await axios.get(url+"/"+id+"/"+cookies.get('Id'))
    .then(res=>{      
      setPreguntas(res.data.item1);
      
        for(const x of res.data.item1)
        {
          setNombrencuesta(x.nombre);         
        }             
      })  
  }

  const getListUsuarios=async()=>{   
    axios.get(url_us+"/"+id)
    .then(res=>{ 
    setUsuarios(res.data);        
    })
  }

  //-------------------------------PREGUNTAS
  const agregarPregunta=e=>{ 
    e.preventDefault();
       
    if(!pregunta.length===0){
      setError('Escriba algo por favor...') 
      return
    }  
    setLoadingP(true);
    agregarP();
        
         /*  setPreguntas([
              ...preguntas,
              {pregunta:pregunta.pregunta}
          ])       
          
          setPregunta({}) */
    setError(null);
    e.target.reset();
  }

  const agregarP=async()=>{   
    await axios.post(url_det+"/"+id,pregunta)
    .then(response=>{
      setData(data.concat(response.data)) 
      agregarR(response.data.id);
      
      setPregunta({});      
      setLoadingP(false);
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

  const eliminarPregunta=async(idPregunta)=>{
        await axios.delete(url_det+"/"+idPregunta)
      .then(response=>{
        setData(data.concat(response.data));
        const arrFiltrado=preguntas.filter(item=> item.idPregunta!==idPregunta)
        setPreguntas(arrFiltrado)
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
      
  const editarPregunta = item => {
        setmodoEdicion(true)
        setPregunta(item.pregunta)
        setidPregunta(item.idPregunta)
  }

  const editarPregunta2 = e => {
        e.preventDefault()
       
        if(!pregunta.trim()){      
          setError('Escriba algo por favor...')
          return
        }

        const arrayEditado = preguntas.map(
          item => item.idPregunta === idPregunta ? {id:idPregunta, pregunta:pregunta} : item
          )
        
        setPreguntas(arrayEditado)
        agregarEditar(idPregunta)
        setmodoEdicion(false)
        setPregunta('')
        setidPregunta('')
        setError(null)
  }

  const agregarEditar=async(idPregunta)=>{  
        await axios.put(url_det+"/"+idPregunta,pregunta)
        .then(response=>{
          setData(data.concat(response.data));      
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

  //-------------------------------RESPUESTAS
  const gRespuestas=async(id)=>{        
    await axios.get(url_res+"/"+id)
    .then(res=>{          
      setgetRespuestas(res.data);       
    })   
  }

  const agregarR=async(idpregunta)=>{    
    await axios.post(url_res+"/"+idpregunta,respuestas)
    .then(response=>{     
      setRespuestas([]);  
      setTipoRespuesta(0);    
      setlistRespuestas([]);
      setAddRespuesta(false);
      getDatos(); 
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

  //-------------------------------USUARIOS
  const handleChange= (e, value) => {  
        if (value && value.id) {
        setUsuario({
          idUsuario: value.id,
          completo: value.completo             
        }, () => {
       }); 
      }     
  } 

  const agregarUsuario=e=>{ 
        e.preventDefault();
         
        if(usuario.length!==0){
          setLoadingU(true);        
          agregarU();

          setUsuarios([
            ...usuarios,
            { idUsuario:usuario.idUsuario,
              usuario: usuario.completo
            }
        ])   
          setErrorU(null);
          setUsuario('');
          e.target.reset();
      }
      else{
        setErrorU('Seleccione un nuevo usuario')
        return
      }
  }

  const agregarU=async()=>{   
        await axios.post(url +"/"+id,usuario)
        .then(response=>{
          setData(data.concat(response.data));
          setLoadingU(false);      
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

  const eliminarUsuario=async(idUsuario)=>{
      await axios.delete(url_us+"/"+id+"/"+idUsuario)
      .then(response=>{
        setData(data.concat(response.data));

        const arrFiltrado=usuarios.filter(item=> item.idUsuario!==idUsuario)
        setUsuarios(arrFiltrado)

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

      <div className="row">     
      <h6 className="text-center">{nombrEncuesta}</h6>     
      </div>
     
      <hr/>
      {/* Preguntas */}
      <div className="row">
      
      <div className="col-6"> 
      <h6 className="text-center">
        {
        modoEdicion ? 'Editar Pregunta' : ''
        }
        </h6>
        <form onSubmit={modoEdicion ? editarPregunta2 : agregarPregunta}>
        {
          error ? <span className="text-danger">{error}</span> : null
        } 

      <Grid container spacing={3}>

      <Grid item xs={12} md={12} lg={12}>
        <TextField className="form-control mb-2" type="text" required name="pregunta" placeholder="Añadir Pregunta" autoComplete="off" onChange={handleChangePreguntas}/> 
      </Grid>
      
     <Grid item xs={4} md={4} lg={4}>
     <h7>Tipo de respuesta</h7>
     <select className="form-control  mb-2" name="tipoRespuesta" onChange={handleTipoRespuesta} required>
     <option value={0}> -- Seleccione -- </option>
     <option value={'1'}>
      Opción múltiple
     </option>
     <option value={'2'}>
      Texto libre
     </option>           
     </select>    
     </Grid>      
      
    {tipoRespuesta==='1' &&
    <>
    <Grid item xs={12} md={8} lg={8}>
      <h7>Número de respuestas</h7>
      <div>
        <TextField type="text" required className="mb-2" autoComplete="off" onChange={handleChangeNRespuestas} />
     </div>
    </Grid>    
    {
      listItems!==null ?
      <Grid item xs={12} md={12} lg={12}>      
      <ol>{listItems}</ol>
      </Grid>
      :null
      }     
      </>
    }    
    </Grid>

      {
        modoEdicion ? (
          <Button className="btn btn-warning btn-sm active float-right btn-block" endIcon={<CreateIcon />} type="submit">Guardar cambios</Button> 
        ) : (
          <>
          {addRespuesta?(
            <Button className="btn btn-primary btn-sm active float-right btn-block" endIcon={<AddCircleIcon />} type="submit">{loadingP ? "Agregando..." : "Agregar"}</Button> 
          ):(
            <>
            </>
          )
          }
          </>
          )
      } 
      </form>
      </div>

      <div className="col-6">   
      <div className="table-responsive table-condensed table-sm tabla">
        <table className="table table-hover" id="dataTableData" name="dataTableData" style={{fontSize: 11, textAlign: 'center'}}>
        <thead className="thead-light">
          <tr>
            <th>Respuestas</th>     
            <th>Preguntas</th> 
            {/* <th>Editar</th> */}
            <th>Borrar</th>
          </tr>
        </thead>
        <tbody style={{backgroundColor: 'white'}}>   
        {
        preguntas.length===0?(
          <React.Fragment key={0}>
          <tr>
            <td colSpan={5}>No hay datos</td>
          </tr>
          </React.Fragment>
        ):(
          preguntas.map(item=>(
            <React.Fragment key={item.idPregunta}>
            <tr>    
            <td>              
              <IconButton aria-label="expand row" size="small" onClick={() => toggleShown(item.idPregunta)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>         
            </td>  
            <td>{item.pregunta}</td> 
            {/* <td><button className="btn btn-primary btn-sm float-right"><i className="fas fa-plus-circle" onClick={() => addRespuestas(item)}></i></button></td> */}  
            {/* <td><button className="btn btn-warning btn-sm float-right"><i className="fas fa-edit" onClick={() => editarPregunta(item)}></i></button></td>*/}            
            <td><button className="btn btn-danger btn-sm float-right mx-2" type="submit" onClick={() => eliminarPregunta(item.idPregunta)}><i className="fas fa-trash"></i></button></td>    
            </tr>
            {detailsopen.includes(item.idPregunta) && (
              <tr>
              <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>              
                          <table size="small" aria-label="purchases">
                          <thead className="thead-light">
                          <tr>
                            <th>Respuestas</th>        
                            <th></th>   
                            <th></th>  
                          </tr>
                          </thead>
                          <tbody>
                      {
                       item.listaRes.length===0?(
                        <React.Fragment key={0}>
                        <tr>
                          <td colSpan={4}>No hay respuestas creadas</td>
                        </tr>
                        </React.Fragment>
                      ):(
                        item.listaRes.map(subitem=>(
                        <React.Fragment key={subitem.idRespuesta}>
                        <tr> 
                        <td>{subitem.respuesta}</td> 
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
  </div>

  <br />
  <hr />

  {/* Usuarios */}
  <h6 className="text-center">Agregar usuarios</h6>  
    <div className="row">
       
      <div className="col-6">  
      <div className="table-responsive table-condensed table-sm tabla">
        <table className="table table-hover" style={{fontSize: 11, textAlign: 'center'}}>
        <thead className="thead-light">    
          <tr>
            <th style={{display: 'none'}}>Id</th> 
            <th>Usuarios</th>   
            <th>Quitar</th> 
          </tr>
        </thead>
        <tbody style={{backgroundColor: 'white'}}>   
        {
        usuarios.length===0?(
          <React.Fragment key={0}>
          <tr>
            <td colSpan={3}>No hay usuarios agregados</td>
          </tr>
          </React.Fragment>
        ):(
          usuarios.map(item=>(
            <React.Fragment key={item.idUsuario}>
            <tr>
            <td style={{display: 'none'}}>{item.idUsuario}</td>  
            <td>{item.usuario}</td>   
            <td><button className="btn btn-danger btn-sm float-right mx-2" type="submit" onClick={() => eliminarUsuario(item.idUsuario)}><i className="fas fa-trash"></i></button></td>    
            </tr>  
            </React.Fragment>
            ))
          )
          }               
        </tbody>
      </table>
      </div>
      </div>

    <div className="col-6">      
    <form onSubmit={agregarUsuario}>
    {
      errorU ? <span className="text-danger">{errorU}</span> : null
    }
    <Autocomplete       
      name="id"   
      options={listusuarios}
      getOptionLabel={(option) => option.completo || ''}
      defaultValue={{ idUsuario: 0, completo: ''}}
      onChange={handleChange}
      renderInput={params => (
      <TextField required
      type="text"  
      {...params}
      variant="standard"
      placeholder="Usuarios"
      margin="normal"
      fullWidth
      />
    )}
  />         

  <Button className="btn btn-primary btn-sm active btn-block" type="submit">{loadingU ? "Agregando..." : "Agregar"}</Button> 
  </form>
  </div>
  </div>
  </section>
       
  </div>
  </div>
  )
}
export default Editar
