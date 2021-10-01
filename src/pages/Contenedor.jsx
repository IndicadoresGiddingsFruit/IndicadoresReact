import React, {useState,useEffect}  from 'react';
import { CssBaseline,
  AppBar, 
  Toolbar, 
  Typography, 
  List,ListItem, 
  ListItemIcon,
  ListItemText,
  Divider, 
  useTheme,
  makeStyles, 
  Drawer,
  Hidden, 
  Button, 
  IconButton,
  ListSubheader,
  Modal,
  Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import Cookies from 'universal-cookie';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {Link, NavLink,withRouter} from 'react-router-dom';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import LocationOnTwoToneIcon from '@material-ui/icons/LocationOnTwoTone';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import InsertDriveFileTwoToneIcon from '@material-ui/icons/InsertDriveFileTwoTone';
import SpaTwoToneIcon from '@material-ui/icons/SpaTwoTone';
import EditLocationTwoToneIcon from '@material-ui/icons/EditLocationTwoTone';
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import CreateIcon from '@material-ui/icons/Create';
import BlockIcon from '@material-ui/icons/Block';
import axios from 'axios';
import swal from 'sweetalert'

const drawerWidth = 170;
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
  // necessary for content to be below app bar
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
    backgroundColor: theme.palette.background.paper,
    margin:0,
    padding:0
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

const Contenedor = (props)=>{
const url="https://giddingsfruit.mx/ApiIndicadores/api/usuarios";
const cookies = new Cookies();
const { window } = props;
const classes=useStyles(); 
const [open, setOpen] = useState(false);
const [encuestas, setEncuestas] = useState(false);
const [tipoAgentes, setTipoAgentes] = useState(false);
const [tipoA, setTipoA] = useState(false);
const [tipoP, setTipoP] = useState(false);
const [analisis, setAnalisis] = useState(false); 
const [openAnalisis, setopenAnalisis] = useState(false);
const [openMuestreos, setopenMuestreos] = useState(false);
const [openIndicadores, setopenIndicadores] = useState(false);
const [openFinanciamientos, setFinanciamientos] = useState(false);
const [openEncuestas, setopenEncuestas] = useState(false);
const [openBloqueo, setopenBloqueo] = useState(false);
const [notificaciones, setNotificaciones] = useState(false);
const [modalCambiarP,setmodalCambiarP]=useState(false);
const [admin, setAdmin] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(0);
const [mobileOpen, setMobileOpen] = useState(false);
const theme = useTheme();
const [loading,setLoading]=useState(false); 
const [claves,setClaves]=useState({}); 
const [nuevaclave,setNuevaclave]=useState(null); 
const [otros, setOtros] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleClickEncuestas = () => {
    setopenEncuestas(!openEncuestas);
  };

  const handleClickIndicadores = () => {
    setopenIndicadores(!openIndicadores);
  };

  const handleClickMuestreos = () => {
    setopenMuestreos(!openMuestreos);
  };

  const handleClickAnalisis = () => {
    setopenAnalisis(!openAnalisis);
  };

  const validaciones =() => {   
/* agentes */
  if(cookies.get('Depto')==='P' || cookies.get('Depto')==='C' || cookies.get('Depto')==='I')
  {   
    if(cookies.get('IdAgen')==='205')
    {
      setAnalisis(true);
      /* setNotificaciones(false); */ 
    }
    if(cookies.get('Depto')==='P'){
      setTipoP(true); 
    }   
    if(cookies.get('Depto')==='I'){
      setopenBloqueo(true);
    }       
    setTipoAgentes(true);
  } 
  /* usuarios consulta */
  else if(cookies.get('Tipo')!==null)
   {   
    if(cookies.get('Tipo')==='A'){
      setTipoA(true);
    }  
    
    if(cookies.get('Id')==='352'){
      setAdmin(true);
      setFinanciamientos(true);
    }  

      setOtros(true);     
      setAnalisis(false);  
      setTipoAgentes(true);
      setTipoP(false);
      setTipoA(false);
      setAdmin(false);    
  }  
  else{
    console.log('NADA');
  }

  } 

  useEffect(() => {
    if(cookies.get('Id')===undefined){
      props.history.push('/');
    }  
      validaciones();
  }, [validaciones]);
 
  const logout=()=>{
    cookies.remove('Id', {path:'/'});
    cookies.remove('Nombre', {path:'/'});
    cookies.remove('Completo', {path:'/'});
    cookies.remove('correo', {path:'/'});
    cookies.remove('IdAgen', {path:'/'});
    cookies.remove('IdRegion', {path:'/'});
    cookies.remove('Tipo', {path:'/'});
    props.history.push('/');
  } 

const cambiarPassword=(e)=>{
  e.preventDefault();   
    if(claves.clave===claves.confirmar)
    {
      setLoading(true); 
      setNuevaclave({         
        id:parseInt(cookies.get('Id')),
        clave: claves.clave        
      }); 
     data(); 
    }
     if(claves.contraseña !== cookies.get('Clave')){    
      swal({
        title: "¡La contraseña actual es incorrecta!",
        text: "Favor de verificar",
        icon: "warning",
        button: "Cerrar",
      });
       return
    }      
    if(claves.clave !== claves.confirmar){
      swal({
        title: "¡Las contraseñas no coinciden!",
        text: "Favor de verificar",
        icon: "warning",
        button: "Cerrar",
      });
       return
    }      
} 

const openClose_ModalCambiarPass=()=>{
  setmodalCambiarP(!modalCambiarP);
 }

const handleDrawer = () => {
  setOpen(!open);
};
    
const drawer = (
  <div>     
  <div>
  <IconButton onClick={handleDrawer}>  
  <a href="#" onClick={handleDrawer}>
    <img src="/Indicadores/dist/img/logo.png" alt="" style={{marginLeft: '50px', width: '60px', height: '40px'}}/>       
  </a> 
  </IconButton> 
  </div>  
    <List>       
        <ListItem className="m-0 p-0" button selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}>           
          <NavLink className="btn" to="/encuestas" exact> 
          <ListItemIcon> <HomeTwoToneIcon />
          <ListItemText primary="Encuestas" /></ListItemIcon>
          </NavLink>
        </ListItem> 

    {openFinanciamientos?
    <>
     <ListItem className="m-0 p-0" button selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}>
          <NavLink className="btn" to="/financiamiento" exact>
          <ListItemIcon> <DescriptionTwoToneIcon />
          <ListItemText primary="Financiamiento" /></ListItemIcon>
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
     {          
        tipoP ?(
        <>     
        <ListItem className="m-0 p-0" button selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}>
          <NavLink className="btn" to="/visitas" exact>
          <ListItemIcon> <LocationOnTwoToneIcon />
          <ListItemText primary="Visitas" /></ListItemIcon>
          </NavLink>
        </ListItem>  
      
        <ListItem className="m-0 p-0" button selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}>
          <NavLink className="btn" to="/reporteVisitas" exact>
          <ListItemIcon> <EditLocationTwoToneIcon />
          <ListItemText primary="Reporte" /></ListItemIcon>
          </NavLink>
        </ListItem>  

        <ListItem className="m-0 p-0" button selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}>
          <NavLink className="btn" to="/financiamiento" exact>
          <ListItemIcon> <DescriptionTwoToneIcon />
          <ListItemText primary="Financiamiento" /></ListItemIcon>
          </NavLink>
        </ListItem> 
      </>
      ):(
      <>
      </>
      )           
      }
          
     <Divider />
     <List
      component="nav" 
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Muestreos
        </ListSubheader>
      }
      className={classes.nested_root}
    >
      {otros===false?  
      <>     
     <ListItem className="m-0 p-0" button selected={selectedIndex === 4}
          onClick={(event) => handleListItemClick(event, 4)}>
          <NavLink className="btn" to="/nuevo" exact>
          <ListItemIcon> <InsertDriveFileTwoToneIcon />
          <ListItemText primary="Nuevo" /></ListItemIcon>
          </NavLink>
        </ListItem>  
        </> 
        :null
      }

        <ListItem className="m-0 p-0" button selected={selectedIndex === 5}
          onClick={(event) => handleListItemClick(event, 5)}>
          <NavLink className="btn" to="/muestreos" exact>
          <ListItemIcon> <SpaTwoToneIcon />
          <ListItemText primary="Todo" /></ListItemIcon>
          </NavLink>
        </ListItem> 

        </List>
    <Divider />
        
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Analisis
        </ListSubheader>
      }
      className={classes.nested_root}
    >
    {
    analisis ?(
    <>
  {/*  <ListItem className="m-0 p-0" button selected={selectedIndex === 6}
      onClick={(event) => handleListItemClick(event, 6)}>
    <NavLink className="btn" to="/analisis" exact>
      <ListItemIcon> <EditIcon />
      <ListItemText primary="Nuevo" /></ListItemIcon>
    </NavLink>
  </ListItem>   */}

  <ListItem className="m-0 p-0" button selected={selectedIndex === 6}
      onClick={(event) => handleListItemClick(event, 6)}>
    <NavLink className="btn" to="/liberar" exact>
      <ListItemIcon> <MultilineChartIcon />
      <ListItemText primary=" Fuera Limite" /></ListItemIcon>
    </NavLink>
  </ListItem>  

   </>
   ):(
   <></>    
   )
   }
    <ListItem className="m-0 p-0" button selected={selectedIndex === 7}
          onClick={(event) => handleListItemClick(event, 7)}>
          <NavLink className="btn" to="/resultados" exact>
          <ListItemIcon> <CheckCircleTwoToneIcon />
          <ListItemText primary="Todo" /></ListItemIcon>
          </NavLink>
        </ListItem> 
    </List> 
  
    <Divider />
    {openBloqueo?
    <>
      <List
      component="nav" 
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
        Bloqueo 
        </ListSubheader>
      }
      className={classes.nested_root}
      >      
      <ListItem className="m-0 p-0" button selected={selectedIndex === 4}
          onClick={(event) => handleListItemClick(event, 4)}>
          <NavLink className="btn" to="/bloqueo" exact>
          <ListItemIcon> <BlockIcon />
          <ListItemText primary="Nuevo" /></ListItemIcon>
          </NavLink>
      </ListItem> 
    </List>
    </>
    :
    null
    }  
    
    </>
  ):(  
  <> 
  </>    
  )
  }       
    </List>
  </div>
);

const container = window !== undefined ? () => window().document.body : undefined;

const seleccionarOpcion=(caso)=>{   
  if(caso==="contraseña"){
    setmodalCambiarP(true);
  } 
}

const handleChange=e=>{  
  const {name, value}=e.target;     
  setClaves(prevState=>({
    ...prevState,
    [name]: value
  }));  
}

const data=async()=>{
  await axios.put(url,nuevaclave)
  .then(response=>{    
    logout();
  
    }).catch(error=>{
      swal({
        title: error.response,
        text: "Favor de verificar la información",
        icon: "error",
        button: "Cerrar",
      });
      console.log(error.response);
      console.log(error.request);
      console.log(error.message); 
    })
    setLoading(false); 
   }

const change_password=(
  <div className={classes.modal}>          
  <div className="card card-default">
    <form onSubmit={cambiarPassword}>
    <div className="card-header">     
       <h7 className="font-weight-bold text-secondary">Cambiar contraseña</h7>      
    </div> 
    <div className="card-body">
    <div className="form-group-sm">
      <Grid container spacing={3}>       
      <Grid item xs={12} md={12} lg={12}>
      Contraseña actual:
      <input 
          type="password" onChange={handleChange} autoComplete="off"
          className="form-control" required
          name="contraseña"
        />              
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
       Nueva contraseña:
       <input 
          type="password" onChange={handleChange} autoComplete="off"
          className="form-control" required
          name="clave"
        />    
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
      Confirme la nueva contraseña:
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
      <button disabled={loading ? true: false} className="btn btn-primary btn-sm active float-right" type="submit">
      {loading ? "Espere..." : "Guardar"}</button>
           
      <button className="btn btn-secondary btn-sm active float-right" onClick={()=>openClose_ModalCambiarPass()}>Cancelar</button> 
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
        className={classes.menuButton}
      >
      <MenuIcon />
      </IconButton>
      <div className="d-sm-inline-block form-inline">
       <Typography variant="h6">{cookies.get('Completo')}</Typography>
      </div>

    <ul className="navbar-nav ml-auto"> 
    <li className="nav-item dropdown no-arrow">  
    {notificaciones?
    <>
     <div className="btn-group">
      <Button variant="text" color="inherit" className="nav-link" data-toggle="dropdown">
      <i className="fas fa-bell fa-fw" />
        <span className="badge badge-danger badge-counter">+</span>
      </Button> 
      <div className="dropdown-menu">
      <div>
      <h6 className="dropdown-header">
        Análisis Fuera de Límite
      </h6>
        
        <a className="dropdown-item d-flex align-items-center" href="#">
          <div className="mr-3">
            <div className="icon-circle bg-warning">
              <i className="fas fa-exclamation-triangle text-white" />
            </div>
          </div>
          <div>
           {/*  <div className="small text-gray-500">December 2, 2019</div> */}
            Existen análisis pendientes por Liberar
          </div>
        </a>
        <Link className="dropdown-item text-center small text-gray-500" to="/liberar">Ver todo</Link>
      </div>
      </div>   
    </div> 
    </>
    :null
    }
  
    <div className="btn-group">
        <Button variant="text" color="inherit" className="nav-link" data-toggle="dropdown" endIcon={<ArrowDropDownIcon />}></Button>
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={()=>seleccionarOpcion("contraseña")}><VpnKeyIcon /> Cambiar contraseña </button>
            <a className="dropdown-item" href="#" onClick={()=>logout()}><ExitToAppIcon /> Salir</a>
          </div>
    </div>

    </li>
    </ul>   
      
    </Toolbar>
  </AppBar>
  <nav className={classes.drawer} aria-label="mailbox folders">
  {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
      keepMounted: true, // Better open performance on mobile.
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