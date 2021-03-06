import React, { useState, useEffect } from 'react';
import {
  CssBaseline, AppBar, Toolbar, Typography, List, ListItem,
  ListItemIcon, ListItemText, Divider, useTheme, makeStyles,
  Drawer, Hidden, Button, IconButton, ListSubheader, Modal, Grid
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Cookies from 'universal-cookie';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { NavLink, withRouter } from 'react-router-dom';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import LocationOnTwoToneIcon from '@material-ui/icons/LocationOnTwoTone';
import AssignmentTurnedInTwoToneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';
import SpaTwoToneIcon from '@material-ui/icons/SpaTwoTone';
import EditLocationTwoToneIcon from '@material-ui/icons/EditLocationTwoTone';
import BarChartTwoToneIcon from '@material-ui/icons/BarChartTwoTone';
import BlockIcon from '@material-ui/icons/Block';
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone';
import HelpOutlineTwoToneIcon from '@material-ui/icons/HelpOutlineTwoTone';
import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import axios from 'axios';
import swal from 'sweetalert';
import '../css/index.css';

const drawerWidth = 220;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },

  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },

  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  nested: {
    paddingLeft: theme.spacing(4)
  },

  nested_root: {
    width: "100%",
    maxWidth: 360,
    /*  backgroundColor: theme.palette.background.paper, */
    margin: 0,
    padding: 0,
    /* backgroundColor:'#3f51b5', */
    color: 'white'
  },

  modal: {
    position: 'absolute',
    width: 400,
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },

}));

const Contenedor = (props) => {
  const url = "https://giddingsfruit.mx/ApiIndicadores/api/usuarios";
  //const url="https://localhost:44344/api/usuarios";

  const cookies = new Cookies();
  const { window } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [registroUsuarios, setregistroUsuarios] = useState(false);
  const [tipoAgentes, setTipoAgentes] = useState(false);
  const [tipoA, setTipoA] = useState(false);
  const [tipoP, setTipoP] = useState(false);
  const [tipoC, setTipoC] = useState(false);
  const [analisis, setAnalisis] = useState(false);
  const [inventario, setInventario] = useState(false);
  const [openFinanciamientos, setFinanciamientos] = useState(false);
  const [openBloqueo, setopenBloqueo] = useState(false);
  const [modalCambiarP, setmodalCambiarP] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [claves, setClaves] = useState({});
  const [nuevaclave, setNuevaclave] = useState({
    id: parseInt(cookies.get('Id')),
    clave: ""
  });
  const [otros, setOtros] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const validaciones = () => {
    //Asesores y usuarios que consultan muestreos y analisis
    if (cookies.get('Depto') !== 'null' || cookies.get('Tipo') !== 'null') {

      if (cookies.get('Depto') === 'P' || cookies.get('Depto') === 'C' || cookies.get('Depto') === 'I') {
        //Asesor que libera analisis de residuos
        if (cookies.get('IdAgen') === '205') {
          setAnalisis(true);
        }

        //Produccion y DCERVANTES
        if (cookies.get('Depto') === 'P' || cookies.get('IdAgen') === '50') {
          setTipoP(true);
        }

        //Inocuidad
        if (cookies.get('Depto') === 'I') {
          setopenBloqueo(true);
        }

        //Calidad
        if (cookies.get('Depto') === 'C') {
          setTipoC(true);
        }

        setTipoAgentes(true);
      }

      /* usuarios consulta */
      else if (cookies.get('Tipo') !== null) {
        if (cookies.get('Tipo') === 'A') {
          setInventario(true);
        }

        else {
          //Usuario ADMIN
          if (cookies.get('Id') === '352') {
            setAdmin(true);
            setFinanciamientos(true);
            setregistroUsuarios(true);
          }
          setOtros(true);
          setAnalisis(false);
          setTipoAgentes(true);
          setTipoP(false);
          setTipoA(false);
          setAdmin(false);
        }
      }
    }
  }

  useEffect(() => {
    //si se han perdido las cookies regresar al login
    if (cookies.get('Id') === undefined) {
      props.history.push('/');
    }
    //validar usuarios
    validaciones();
  }, []);

  //Cerar sesi??n
  const logout = () => {
    cookies.remove('Id', { path: '/' });
    cookies.remove('Nombre', { path: '/' });
    cookies.remove('Completo', { path: '/' });
    cookies.remove('correo', { path: '/' });
    cookies.remove('IdAgen', { path: '/' });
    cookies.remove('IdRegion', { path: '/' });
    cookies.remove('Tipo', { path: '/' });
    props.history.push('/');
  }

  const cambiarPassword = (e) => {
    e.preventDefault();

    if (claves.contrase??a !== cookies.get('Clave')) {
      swal({
        title: "??La contrase??a actual es incorrecta!",
        text: "Favor de verificar",
        icon: "warning",
        button: "Cerrar",
      });
      return
    }

    if (claves.clave !== claves.confirmar) {
      swal({
        title: "??Las contrase??as no coinciden!",
        text: "Favor de verificar",
        icon: "warning",
        button: "Cerrar",
      });
      return
    }

    if (claves.clave === claves.confirmar) {
      /* console.log(claves);
      console.log(nuevaclave); */
      putCambiarClave();
    }
  }

  const openClose_ModalCambiarPass = () => {
    setmodalCambiarP(!modalCambiarP);
  }

  const handleDrawer = () => {
    setOpen(!open);
  };

  //Menu izquierdo
  const drawer = (
    <div>
      <div className="d-flex justify-content-center">
        <IconButton onClick={handleDrawer}>
          <a onClick={handleDrawer}>
            <img src="/Indicadores/dist/img/logo.png" alt="" style={{ width: '60px', height: '40px' }} />
          </a>
        </IconButton>
      </div>

      <div>
        <List>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="a" id="nested-list-subheader" data-toggle="collapse" href="#evaluaciones">
                <HelpOutlineTwoToneIcon /> Evaluaciones
              </ListSubheader>
            }
            className={classes.nested_root}
          >
            <ListItem id="evaluaciones" className="panel-collapse collapse m-0 p-0"
            >
              <NavLink className="btn text-white" to="/encuestas" exact>
                <ListItemIcon>
                  <ListItemText primary="Encuestas" /></ListItemIcon>
              </NavLink>
            </ListItem>
          </List>

          {openFinanciamientos ?
            <>
              <Divider />
              <ListItem className="m-0 p-0"
              >
                <NavLink className="btn" to="/financiamiento" exact>
                  <ListItemIcon> <MonetizationOnTwoToneIcon />
                    <ListItemText primary="Financiamiento" /></ListItemIcon>
                </NavLink>
              </ListItem>
            </>
            :
            <>
            </>
          }

          {registroUsuarios ?
            <>
              <Divider />
              <ListItem className="m-0 p-0"
              >
                <NavLink className="btn" to="/registro" exact>
                  <ListItemIcon> <AccountCircleTwoToneIcon />
                    <ListItemText primary="Usuarios" /></ListItemIcon>
                </NavLink>
              </ListItem>
            </>
            :
            <>
            </>
          }

          <Divider />
          {tipoAgentes ? (
            <>
              {/* Produccion */}
              {
                tipoP ? (
                  <>
                    <List
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                      subheader={
                        <ListSubheader component="a" id="nested-list-subheader" data-toggle="collapse" href="#indicadores">
                          <BarChartTwoToneIcon /> Indicadores
                        </ListSubheader>
                      }
                      className={classes.nested_root}
                    >

                      <List
                        component="nav" id="indicadores" className="panel-collapse collapse"
                        aria-labelledby="nested-list-subheader"
                        className={classes.nested_root}
                      >

                        <List
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                          subheader={
                            <ListSubheader component="a" id="nested-list-subheader" data-toggle="collapse" href="#volumen">
                              <TrendingUpTwoToneIcon /> Vol??men
                            </ListSubheader>
                          }
                          className={classes.nested_root}
                        >

                          <List
                            component="nav" id="volumen" className="panel-collapse collapse m-0 p-0"
                            aria-labelledby="nested-list-subheader"
                            className={classes.nested_root}
                          >

                            <ListItem className="m-0 p-0">
                              <NavLink className="btn" to="/financiamiento" exact>
                                <ListItemIcon>
                                  <ListItemText primary="Validaci??n Cartera" /></ListItemIcon>
                              </NavLink>
                            </ListItem>

                            <ListItem className="m-0 p-0">
                              <NavLink className="btn" to="/proyeccion" exact>
                                <ListItemIcon>
                                  <ListItemText primary="Historial Proyecci??n" /></ListItemIcon>
                              </NavLink>
                            </ListItem>

                            <ListItem className="m-0 p-0">
                              <NavLink className="btn" to="/productividad" exact>
                                <ListItemIcon>
                                  <ListItemText primary="Productividad" /></ListItemIcon>
                              </NavLink>
                            </ListItem>

                          </List>
                        </List>

                        <List
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                          subheader={
                            <ListSubheader component="a" id="nested-list-subheader" data-toggle="collapse" href="#rendimiento">
                              <LocationOnTwoToneIcon /> Rendimiento
                            </ListSubheader>
                          }
                          className={classes.nested_root}
                        >

                          <List
                            component="nav" id="rendimiento" className="panel-collapse collapse m-0 p-0"
                            aria-labelledby="nested-list-subheader"
                            className={classes.nested_root}
                          >
                            <ListItem className="m-0 p-0">
                              <NavLink className="btn" to="/visitas" exact>
                                <ListItemIcon>
                                  <ListItemText primary="Visitas" /></ListItemIcon>
                              </NavLink>
                            </ListItem>

                            <ListItem className="m-0 p-0">
                              <NavLink className="btn" to="/reporteVisitas" exact>
                                <ListItemIcon> {/* <EditLocationTwoToneIcon /> */}
                                  <ListItemText primary="Bit??cora Visitas" /></ListItemIcon>
                              </NavLink>
                            </ListItem>

                            <ListItem className="m-0 p-0">
                              <NavLink className="btn" to="/expediente" exact>
                                <ListItemIcon> {/* <FolderSharedTwoToneIcon /> */}
                                  <ListItemText primary="Expediente" /></ListItemIcon>
                              </NavLink>
                            </ListItem>

                          </List>
                        </List>
                      </List>
                    </List>
                  </>
                ) : (
                  <>
                  </>
                )
              }

              <Divider />

              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="a" id="nested-list-subheader" data-toggle="collapse" href="#muestreos">
                    <SpaTwoToneIcon /> Muestreos
                  </ListSubheader>
                }
                className={classes.nested_root}
              >

                {otros === false ?
                  <>
                    <ListItem className="m-0 p-0"
                    >
                      <NavLink className="btn" to="/nuevo" exact>
                        <ListItemIcon>
                          <ListItemText primary="Nuevo Muestreo" /></ListItemIcon>
                      </NavLink>
                    </ListItem>
                  </>
                  : null
                }

                <ListItem id="muestreos" className="panel-collapse collapse m-0 p-0"
                >
                  <NavLink className="btn" to="/muestreos" exact>
                    <ListItemIcon>
                      <ListItemText primary="Todo" /></ListItemIcon>
                  </NavLink>
                </ListItem>


              </List>
              <Divider />

              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="a" id="nested-list-subheader" data-toggle="collapse" href="#analisis">
                    <CheckCircleTwoToneIcon /> Analisis
                  </ListSubheader>
                }
                className={classes.nested_root}
              >
                {
                  analisis ? (
                    <>

                      <ListItem id="analisis" className="panel-collapse collapse m-0 p-0">
                        <NavLink className="btn" to="/liberar" exact>
                          <ListItemIcon>
                            <ListItemText primary=" Fuera Limite" /></ListItemIcon>
                        </NavLink>
                      </ListItem>

                    </>
                  ) : (
                    <></>
                  )
                }
                <ListItem id="analisis" className="panel-collapse collapse m-0 p-0"
                >
                  <NavLink className="btn" to="/resultados" exact>
                    <ListItemIcon>
                      <ListItemText primary="Resultados" /></ListItemIcon>
                  </NavLink>
                </ListItem>
              </List>

              <Divider />
              {openBloqueo ?
                <>
                  <List
                    component="a" id="nested-list-subheader" data-toggle="collapse" href="#bloqueo"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        <BlockIcon /> Bloqueo
                      </ListSubheader>
                    }
                    className={classes.nested_root}
                  >
                    <ListItem id="bloqueo" className="panel-collapse collapse m-0 p-0">
                      <NavLink className="btn" to="/bloqueo" exact>
                        <ListItemIcon>
                          <ListItemText primary="Nuevo Bloqueo" /></ListItemIcon>
                      </NavLink>
                    </ListItem>
                  </List>

                  <Divider />

                  <List
                    component="a" id="nested-list-subheader" data-toggle="collapse" href="#auditorias"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        <AssignmentTurnedInTwoToneIcon />  Auditorias
                      </ListSubheader>
                    }
                    className={classes.nested_root}
                  >
                    <ListItem id="auditorias" className="panel-collapse collapse m-0 p-0">
                      <NavLink className="btn" to="/auditorias" exact>
                        <ListItemIcon>
                          <ListItemText primary="Auditor??a Interna" /></ListItemIcon>
                      </NavLink>
                    </ListItem>
                  </List>
                </>
                :
                null
              }

            </>
          ) : (
            <>
            </>
          )
          }

          <Divider />
          {
            inventario ? (
              <>
                <ListItem className="m-0 p-0">
                  <NavLink className="btn" to="/inventario" exact>
                    <ListItemIcon> <EditLocationTwoToneIcon />
                      <ListItemText primary="Inventario" /></ListItemIcon>
                  </NavLink>
                </ListItem>
              </>
            ) : (
              <>
              </>
            )
          }

        </List>
      </div>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const seleccionarOpcion = (caso) => {
    if (caso === "contrase??a") {
      setmodalCambiarP(true);
    }
  }


  //Manejo de estado de formulario para cambiar contrase??a
  const handleChange = e => {
    const { name, value } = e.target;

    setClaves(prevState => ({
      ...prevState,
      [name]: value
    }));

    setNuevaclave((prevState) => ({
      ...prevState,
      id: parseInt(cookies.get('Id')),
      clave: claves.clave
    }));
  }

  //Guardar la nueva contrase??a
  const putCambiarClave = async () => {
    setLoading(true);
    await axios.put(url, nuevaclave)
      .then(response => {
        //cerrar sesion
        logout();
      }).catch(error => {
        swal({
          title: "Favor de verificar la informaci??n",
          text: error.response.data,
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response);
        console.log(error.request);
        console.log(error.message);
      })
    setLoading(false);
  }

  const change_password = (
    <div className={classes.modal}>
      <div className="card card-default">
        <form onSubmit={cambiarPassword}>
          <div className="card-header">
            <h7 className="font-weight-bold text-secondary">Cambiar contrase??a</h7>
          </div>
          <div className="card-body">
            <div className="form-group-sm">
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  Contrase??a actual:
                  <input
                    type="password" onChange={handleChange} autoComplete="off"
                    className="form-control" required
                    name="contrase??a"
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  Nueva contrase??a:
                  <input
                    type="password" onChange={handleChange} autoComplete="off"
                    className="form-control" required
                    name="clave"
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  Confirme la nueva contrase??a:
                  <input
                    type="password" onChange={handleChange} autoComplete="off"
                    className="form-control" required
                    name="confirmar"
                  />
                </Grid>
              </Grid>
            </div>

          </div>
          <div className="card-footer">
            <button disabled={loading ? true : false} className="btn btn-primary btn-sm active float-right" type="submit">
              {loading ? "Espere..." : "Guardar"}</button>

            <button className="btn btn-secondary btn-sm active float-right" onClick={() => openClose_ModalCambiarPass()}>Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  )

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}>

            <MenuIcon />

          </IconButton>

          {/*  Nombre completo del usuario logueado */}
          <div className="d-sm-inline-block form-inline">
            <Typography variant="h6">{cookies.get('Completo')}</Typography>
          </div>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown no-arrow">
              <div className="btn-group">
                <Button variant="text" color="inherit" className="nav-link" data-toggle="dropdown" endIcon={<ArrowDropDownIcon />}></Button>
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => seleccionarOpcion("contrase??a")}><VpnKeyIcon /> Cambiar contrase??a </button>
                  <a className="dropdown-item" href="#" onClick={() => logout()}><ExitToAppIcon /> Salir</a>
                </div>
              </div>

            </li>
          </ul>

        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <Modal open={modalCambiarP} onClose={openClose_ModalCambiarPass}>{change_password}</Modal>

    </div>
  )
}
export default withRouter(Contenedor)