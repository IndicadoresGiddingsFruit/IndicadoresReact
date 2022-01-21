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
    var respuestas = [];

    const url="https://giddingsfruit.mx/ApiIndicadores/api/encuestas";    
    //const url="https://localhost:44344/api/encuestas";    
    
    const url_us="https://giddingsfruit.mx/ApiIndicadores/api/encuestasusuarios";
    //const url_us="https://localhost:44344/api/encuestasusuarios";
    
    const [preguntas,setPreguntas]=useState([]);           
    const [data, setData]= useState([]);
    const [nombrEncuesta,setNombrencuesta]=useState('');    
    const [descEncuesta,setDescEncuesta]=useState('');    
    const [loading, setLoading] = useState(false);


    var [arrayPreguntas, setarrayPreguntas] = useState([]);
    const [respuestaIdRelacion, setRespuestaIdRelacion] = useState([]);
    var [arrayIdRelacion, setArrayIdRelacion] = useState([]);
  
    var [arrayPreguntasLibre, setarrayPreguntasLibre] = useState([]);
    const [respuestaL, setRespuestaL] = useState([]);
    var [arrayRespuestaLibre, setArrayRespuestaLibre] = useState([]);

    useEffect(() => {
      const getDatos=async()=>{
        try { 
        await axios.get(url+"/"+id+"/"+cookies.get('Id'))
        .then(res=>{    
          setPreguntas(res.data.item1);           
          for(const x of res.data.item1)
          {
            setNombrencuesta(x.encuesta); 
            setDescEncuesta(x.descripcion)
          }           
        })  
      } catch (error) {
        console.log(error)
      }  
    }
      getDatos()
    }, [id,cookies])   

    const handleChangeL = (e) => {
      const { name, value } = e.target;
  
      setRespuestaL((prevState) => ({
        ...prevState,
        respuestaLibre: value,
        idPregunta: respuestaIdRelacion.idPregunta
      }));
    };

    const onblurRespuesta = function () {
      /* setRespuestaLibre((prevState) => ({
        ...prevState,
        respuestaLibre: respuestaLibre,
        idPregunta: respuestaIdRelacion.idPregunta
      })); */
  
      // console.log(arrayRespuestaLibre);


/* 
      let newsAnswer = arrayPreguntasLibre.filter(
        (p) => p.idPregunta !== arrayPreguntasLibre.idPregunta
      );
      newsAnswer.push(respuestaL);
      setarrayPreguntasLibre(newsAnswer);
      console.log(arrayPreguntasLibre); */

      for (var i = 0; i < arrayPreguntasLibre.length; i++) {
        if (
          arrayPreguntasLibre[i].idPregunta === arrayPreguntasLibre.idPregunta
        ) {
          arrayPreguntasLibre.splice(i, 1);
        }
      }
  
      arrayPreguntasLibre.push(respuestaL);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
  
      setRespuestaIdRelacion((prevState) => ({
        ...prevState,
        idRelacion: parseInt(value),
        idPregunta: parseInt(name)
      }));
    };
  
    const onblurIdRelacion = function (e) {
      for (var i = 0; i < arrayPreguntas.length; i++) {
        if (arrayPreguntas[i].idPregunta === respuestaIdRelacion.idPregunta) {
          arrayPreguntas.splice(i, 1);
        }
      }
  
      arrayPreguntas.push(respuestaIdRelacion);
  
      //console.log(arrayPreguntas);
    };

    const guardar=e=>{
    e.preventDefault();
      
    for (var i = 0; i < arrayPreguntas.length; i++) {
      arrayIdRelacion.push(arrayPreguntas[i].idRelacion);
      //console.log(arrayIdRelacion);
    }

    for (var k = 0; k < arrayPreguntasLibre.length; k++) {
      arrayRespuestaLibre.push(arrayPreguntasLibre[k].respuestaLibre);
      //console.log(arrayRespuestaLibre);
    }

    if (arrayIdRelacion.length === 0) {
      return;
    }

    for (var j = 0; j < arrayIdRelacion.length; ++j) {
      respuestas.push({
        idRelacion: arrayIdRelacion[j],
        respuestaLibre: arrayRespuestaLibre[j]
      });
    }

   /*  console.log(respuestas);  
   
    console.log(preguntas.length);
    console.log(respuestas.length); */

      if(respuestas.length===0){           
        swal({
         title: "¡No debe enviar la encuesta vacía!",
         text: "Favor de responder todas las preguntas",
         icon: "error",
         button: "Cerrar",
       });
        return
      }
      else if(preguntas.length > respuestas.length){       
        swal({
          title: "¡Faltan preguntas por responder!",
          text: "Favor de completar el cuestionario",
          icon: "warning",
          button: "Cerrar",
        });
        return
      }
      else{
      peticionPost(); 
        respuestas = [];   
      }
    }
  
    const peticionPost=async()=>{
      setLoading(true);
        await axios.post(url_us+"/"+id+"/"+cookies.get('Id'),respuestas)
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
        setLoading(false);
    }

    return (
    <div className={styles.root}>
    <Contenedor />
     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>   
    <section className="content">  
     <h6>{descEncuesta}</h6>
 {/* <h6>Encuesta de satisfacción de servicio, con las siguientes consideraciones:
      <br />
      Se considera el área de INFORMÁTICA a la gerencia de Alexander 
      <br />
      Se considera el área de SOPORTE a la gerencia de Julio Manzo 
      <br />
      Es obligatorio agregar comentarios
      <br />
      <i>Tus respuestas y tu nombre serán confidenciales </i>
    </h6>
     */}
    <hr/>

    <h6>{nombrEncuesta}</h6>  
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
                <input
                  className="form-check-input"
                  type="radio"
                  name={subitem.idPregunta}
                  defaultValue={subitem.idRelacion}
                 /*  onChange={(e) =>
                    setRespuestaIdRelacion(e.target.value)
                  } */
                  onChange={handleChange}
                  onBlur={onblurIdRelacion}
                  ></input>
                  <label className="form-check-label" htmlFor="exampleRadios1">
                    {subitem.respuesta}
                  </label>   
                </li>            
            </React.Fragment>          
            ))
          } 
         
          <br/>   
            Comentarios
            <input
            className="form-control mb-2"
                    type="text"
                    required
                    name="respuestaLibre"
                    autoComplete="off"
                    maxLength="60"
                    style={{width:'60%'}}
                    /* onChange={(e) => setRespuestaLibre(e.target.value)} */
                    onChange={handleChangeL}
                    onBlur={onblurRespuesta}
                  ></input>       
          <br />            
          </ul>  
      </li> 
      </React.Fragment>
    ))
    }
    </ol>
    <Button className="btn btn-primary btn-sm active float-right btn-block" 
    endIcon={<SaveIcon />} type="submit" disabled={loading ? true: false}> 
      {loading ? "Guardando..." : "Guardar"}    
      </Button>     

      {loading ?
        <Button className="btn btn-secondary btn-sm active float-right btn-block" 
          endIcon={<SaveIcon />} type="submit"> 
          Reenviar
        </Button>   
        :null
      }
    </form>
    </section>
    </div>   
    </div>
    )
    }
export default withRouter (Responder);