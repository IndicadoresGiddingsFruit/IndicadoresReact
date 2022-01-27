import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { makeStyles, Paper, Typography } from '@material-ui/core'
import Contenedor from '../Contenedor.jsx';
import swal from 'sweetalert';
import { useDispatch, useSelector } from "react-redux";
import {
  getListAnalisisFueraLimiteAction
} from "../../redux/Analisis/FueraLimiteD";
import '../../css/Table.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
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
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
    textAlign: "center",
  }
}));

//Filtrar tabla
function searchData(search) {
  return function (item) {
    return (
      item.cod_Prod.toLowerCase().includes(search.toLowerCase())
    );
  };
}

const LiberarAnalisis = (props) => {
  const styles = useStyles();
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/analisis";
  //const url="https://localhost:44344/api/analisis";
  const cookies = new Cookies();
  const dispatch = useDispatch();

  //Cargar información
  const data = useSelector((v) => v.analisisFL.arrayFueraLimite);

  //Buscar
  const [search, setSearch] = useState("");

  //Id para liberar
  const [id, setId] = useState(null); 

  //Traer información 
  useEffect(() => {
    dispatch(getListAnalisisFueraLimiteAction(cookies.get('IdAgen'), null, cookies.get('Depto'), 0, 'F'));
  })

  const abrirModal = (idSelected) => {  
    console.log(idSelected);
    setId(idSelected); 
    console.log(id); 
    swal({
      title: "¿Está seguro de cambiar el estatus de Fuera de Limite a Liberado?",
      icon: "info",
      buttons: ["No", "Si"],
    }).then((value) => {
      if (value) { 
        liberar(idSelected);
        //window.location.reload();
      }
    });
  }

   const liberar = async (idSelected) => {
    console.log(idSelected);
    await axios.patch(url + "/" + idSelected + "/" +cookies.get('IdAgen'))
      .then(response => {
       console.log(response);
      }).catch(error => {
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
        <div className={styles.toolbar}></div>
        <section className="content font-weight-bold text-secondary">
          <Paper className={styles.paper}>
            <Typography
              variant="h6"
              id="tableTitle"
              component="div">
              LIBERAR ANÁLISIS FUERA DE LÍMITE
            </Typography>

            <div className="row mt-2">            
              <div className="col-6">
                <input
                  type="text"
                  placeholder="Buscar código..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  name="searchText"
                />
              </div>

              <div className="col-12 mt-2">
              <div className="table-responsive table-condensed table-sm">
                  {data.length > 0 ? (
                    <table
                      className="table-libAnalisis table-hover table-sm table-striped"
                      style={{ fontSize: 11, textAlign: "center" }}
                    >
                      <thead className="table-primary">
                        <tr>
                          <th>Código</th>
                          <th>Campo</th>
                          <th>Sector(es)</th>
                          <th>Tipo</th>
                          <th>Producto</th>
                          <th>Zona</th>
                          <th>Fecha/envío</th>
                          <th>Fecha/entrega</th>
                          <th>Estatus</th>
                          <th>Num/análisis</th>
                          <th>Laboratorio</th>
                          <th>LiberaciónUSA</th>
                          <th>LiberaciónEU</th>
                          <th>ParteMuestreada</th>
                          <th>Comentarios</th>
                          <th>Traza</th>
                          <th>Orgánico</th>
                          <th>Fecha</th>
                          <th>Temporada</th>
                          <th>Liberar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.filter(searchData(search)).map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.cod_Prod}</td>
                            <td>{item.cod_Campo}</td>
                            <td>{item.sector}</td>
                            <td>{item.tipo}</td>
                            <td>{item.producto}</td>
                            <td>{item.zona}</td>
                            <td>{item.fecha_envio}</td>
                            <td>{item.fecha_entrega}</td>
                            <td bgcolor="yellow">{item.descEstatus}</td>
                            <td>{item.num_analisis}</td>
                            <td>{item.laboratorio}</td>
                            <td>{item.liberacionUSA}</td>
                            <td>{item.liberacionEU}</td>
                            <td>{item.parteMuestreada}</td>
                            <td>{item.comentarios}</td>
                            <td>{item.traza}</td>
                            <td>{item.organico}</td>
                            <td>{item.fecha}</td>
                            <td>{item.temporada}</td>
                            <td><button className="btn btn-primary btn-sm float-right mx-2" type="submit"
                            onClick={()=>abrirModal(item.id)}>
                              <i className="fas fa-check-circle"></i></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <>
                      <div className="alert alert-danger" role="alert">
                        Cargando...
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Paper>
        </section>
      </div>
    </div>
  )
}
export default LiberarAnalisis;