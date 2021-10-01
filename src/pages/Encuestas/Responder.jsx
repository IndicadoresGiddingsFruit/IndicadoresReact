import React, {useState,useEffect} from 'react';
import axios from 'axios';
import Contenedor from '../Contenedor.jsx';
import Cookies from 'universal-cookie';
import {Button} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save';
import {useParams, withRouter} from 'react-router-dom';
import swal from 'sweetalert';
import {makeStyles} from '@material-ui/core';

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

const Responder=(props)=>{  
  const styles=useStyles(); 
    const cookies = new Cookies();
    const {id}=useParams();  
    var i;
    const url="https://giddingsfruit.mx/ApiIndicadores/api/encuestas";    
    //const url="https://localhost:44344/api/encuestas";    
    const url_us="https://giddingsfruit.mx/ApiIndicadores/api/encuestasusuarios";
    //const url_us="https://localhost:44344/api/encuestasusuarios";
    const [preguntas,setPreguntas]=useState([]);           
    const [data, setData]= useState([]);
    const [nombrEncuesta,setNombrencuesta]=useState('');    
    const [respuesta,setRespuesta]=useState({
      /* idPregunta:parseInt(),
      idRelacion:parseInt() */
    });
    const [respuestas, setRespuestas]=useState([]);
    
    useEffect(() => {
      const getDatos=async()=>{
        try { 
        await axios.get(url+"/"+id+"/"+cookies.get('Id'))
        .then(res=>{    
          setPreguntas(res.data.item1);           
          for(const dataObj of res.data.item1)
          {
            setNombrencuesta(dataObj.encuesta); 
          }           
        })  
      } catch (error) {
        console.log(error)
      }  
    }
      getDatos()
    }, [id,cookies])   

    const handleChange=e=>{ 
     /*  const {name, value}=e.target;    
      setRespuesta(prevState=>({
        ...prevState,
        [name]: value
      }));    */

     /*  const {name, value}=e.target;    
      setRespuesta(prevState=>({
        ...prevState,
        idPregunta:parseInt(name),
        idRespuesta:value
        //[name]: value
      }));   
    */

      const {name, value}=e.target;    
      setRespuesta(prevState=>({
        ...prevState,
        idPregunta:parseInt(name),
        idRelacion:parseInt(value),
        respuesta:value
      }));   

      console.log(respuesta);
    } 

    const guardar=e=>{
      e.preventDefault();
      
      for (i in respuesta) 
      {  
        if(respuesta[i])
        { 
        let data = 
        { 
          idPregunta: parseInt(i), 
          id: parseInt(respuesta[i]) 
        };
        respuestas.push(data);  
        }      
      }

    /*   for (i in respuesta) 
      {  
        if(respuesta[i])
        { 
        let data = { 
          idPregunta:parseInt(respuesta[i]), 
          idRelacion:parseInt(respuesta[i]), 
          respuesta:respuesta[i],
          idAsingUsuario:parseInt(cookies.get('Id')),
        };
        respuestas.push(data);  
        }      
      } */
     
      console.log(respuestas);

      if(respuestas.length===0){           
        swal({
         title: "¡No debe enviar la encuesta vacía!",
         text: "Favor de responder todas las preguntas",
         icon: "error",
         button: "Cerrar",
       });
        return
      }
      else if(preguntas.length>respuestas.length){
        swal({
          title: "¡Faltan preguntas por responder!",
          text: "Favor de completar el cuestionario",
          icon: "warning",
          button: "Cerrar",
        });
        return setRespuestas([]);
      }
      //peticionPost(); 
      setRespuestas([]);
    }
  
    const peticionPost=async()=>{
        await axios.post(url_us+"/"+id,respuestas)
        .then(response=>{
          setData(data.concat(response.data));
          swal({
            title: "¡Gracias por su contribución!",
            icon: "success",
            button: "ok",
          }).then(function() {
            props.history.push('/index');
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

    return (
      <div className={styles.root}>
    <Contenedor />
     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>   
    <section className="content">  
    <h6>{nombrEncuesta}</h6>   
    <p>Por favor, invierta unos pocos minutos de su tiempo para rellenar el siguiente cuestionario</p>
    <hr/>
     
    <form onSubmit={guardar}>
    <ol>
    {
    preguntas.map(item=>(
      <React.Fragment key={item.id}>    
      <li name="idPregunta">{item.pregunta}
          <ul className="list-group">
          {
            item.listaRes.map(subitem=>(
            <React.Fragment key={subitem.idRelacion}>            
                <li className="list-group">
                {subitem.idRespuesta===76 ?
                (
                <>
                  <input className="form-check-input" type="radio" name={subitem.idPregunta} defaultValue={subitem.idRelacion} 
                  ></input>
                  <textarea className="form-control mb-2" type="text" required name={subitem.idPregunta} autoComplete="off" 
                  onChange={handleChange}></textarea>        
                </>
                ):(
                <>
                  <input className="form-check-input" type="radio" name={subitem.idPregunta} defaultValue={subitem.idRelacion} 
                    onChange={handleChange}></input>
                    <label className="form-check-label" htmlFor="exampleRadios1">
                        {subitem.respuesta}
                    </label>  
                </> 
                 )
                 }         
                </li>            
            </React.Fragment>          
            ))
          } 
          <br/>               
          </ul>  
      </li> 
      </React.Fragment>
    ))
    }
    </ol>
    <Button className="btn btn-primary btn-sm active float-right btn-block" endIcon={<SaveIcon />} type="submit">Guardar</Button> 
    </form>

    </section>
    </div>   
    </div>
    )
    }
export default withRouter (Responder);