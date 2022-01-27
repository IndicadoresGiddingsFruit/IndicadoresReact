import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../css/login.css';
import { Grid, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import swal from 'sweetalert';
import {
  getListRegionesAction
} from "../redux/Catalogos/RegionesD";

const useStyles = makeStyles((theme) => ({
  inputs: {
    width: '100%'
  },
}));

const Registro = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/usuarios";
  //const url="https://localhost:44344/api/usuarios";
  const [error, setError] = useState(false)
  const [data, setData] = useState([])
  const [pwd, setPwd] = useState({
    input: {}
  });
  const [loading, setLoading] = useState(false);
  const regiones = useSelector((v) => v.regiones.arrayRegiones);
  const [form, setForm] = useState({
    nombre: '',
    clave: '',
    tipo: null,
    depto: null,
    idRegion: parseInt()
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  }

  const handleChangePwd = e => {
    let input = pwd.input;
    input[e.target.name] = e.target.value;

    setPwd({
      input
    });

    setForm((prevState) => ({
      ...prevState,
      clave: e.target.value
    }));
  }

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      registrar();
    }
  }

  const registrar = e => {
    e.preventDefault()

    if (form.idRegion === 0) {
      setError('Debe seleccionar una región')
      return
    }

     if (validate()) {
      post();
      let input = {};
      setError('')
      input["clave"] = "";
      input["claveConfirm"] = "";
      setPwd({ input: input }); 
    } 
  }

  const validate = e => {
    let input = pwd.input;
    let isValid = true;

    if (input["clave"] !== input["claveConfirm"]) {
      isValid = false;
      setError('Las contraseñas no coinciden');
    }
    else {
      isValid = true;
    }
    return isValid;
  }

  const post = async () => {
    setLoading(true);
    await axios.post(url, form)
      .then(response => {
        setData(data.concat(response.data));
        swal({
          title: "¡Registro correcto!",
          icon: "success",
          button: "ok",
        }).then(function () {
          props.history.push('/');
        });
      }).catch(error => {
        swal({
          title: "Favor de verificar la información",
          text: error.response.data,
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message);
      })
      setLoading(false);
  }

  //Cargar lista de las regiones
  useEffect(() => {
    dispatch(getListRegionesAction());
  }, []);

  return (

    <section className="containerRegistro">
      <div className="container-fluid">
        <div className="card card-default">
          <form onSubmit={registrar}>
            <div className="card-header">
              <div>
                <img src="/Indicadores/dist/img/logo_horizontal.png" alt="" style={{ width: '100px' }, { height: '60px' }} />
              </div>
              <span className="font-weight-bold text-secondary">Indicadores GiddingsFruit</span>
              <br />
              {
                error ? <span className="font-weight-bold text-danger mt-3">{error}</span> : null
              }
            </div>
            <div className="card-body font-weight-bold text-secondary">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group-sm">
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12} lg={4}>
                        <input type="text" name="nombre" className="form-control" required
                          onChange={handleChange} placeholder="Usuario de SEASON" autoComplete="off" />
                      </Grid>

                      <Grid item xs={12} md={12} lg={8}>
                        <input type="text" className="form-control" type="email" name="correo" required
                          onChange={handleChange} placeholder="Correo" variant="outlined" autoComplete="off" />
                      </Grid>

                      <Grid item xs={12} md={12} lg={6}>
                        <input type="text" className="form-control" type="password" name="clave" required
                          onChange={handleChangePwd} value={pwd.input.clave} placeholder="Contraseña" autoComplete="off" />
                      </Grid>

                      <Grid item xs={12} md={12} lg={6}>
                        <input type="text" className="form-control" type="password" name="claveConfirm" required
                          onChange={handleChangePwd} value={pwd.input.claveConfirm}
                          onKeyPress={onKeyPress} placeholder="Confirma la contraseña" variant="outlined" autoComplete="off" />
                      </Grid>

                    </Grid>
                  </div>
                </div>

                <div className="col-md-12 mt-3">
                  <div className="form-group-sm">
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} lg={6}>
                        Departamento
                        <select
                          name="depto"
                          className="form-control"
                          onChange={handleChange}
                        >
                          <option value={null}>Ninguno</option>
                          <option value={"C"}>Calidad</option>
                          <option value={"I"}>Inocuidad</option>
                          <option value={"P"}>Producción</option>
                        </select>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6}>
                        Región:
                        <select
                          name="idRegion"
                          className="form-control"
                          onChange={handleChange}
                        >
                          <option value={0}>--Seleccione--</option>
                          {regiones.map((item) => (
                            <option key={item.codZona} value={item.codZona}>
                              {item.descripcion}
                            </option>
                          ))}
                        </select>
                      </Grid>

                    </Grid>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button
                disabled={loading ? true : false}
                className="btn btn-primary active float-right"
                type="submit"
              >
                {loading ? "Espere..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

  )
}
export default withRouter(Registro);