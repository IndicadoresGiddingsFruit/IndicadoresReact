import React, {useState,useEffect}  from 'react';
import { CssBaseline,
  AppBar, 
  Toolbar, 
  Typography, 
  List,ListItem, 
  ListItemIcon,ListItemText,Divider, useTheme,makeStyles, Drawer,Hidden, Button, IconButton,ListSubheader } from '@material-ui/core';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import Cookies from 'universal-cookie';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {Link, NavLink,withRouter} from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import BubbleChartTwoToneIcon from '@material-ui/icons/BubbleChartTwoTone';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import AssessmentTwoToneIcon from '@material-ui/icons/AssessmentTwoTone';
import LocationOnTwoToneIcon from '@material-ui/icons/LocationOnTwoTone';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import InsertDriveFileTwoToneIcon from '@material-ui/icons/InsertDriveFileTwoTone';
import SpaTwoToneIcon from '@material-ui/icons/SpaTwoTone';
import AssignmentIndTwoToneIcon from '@material-ui/icons/AssignmentIndTwoTone';
import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import EditLocationTwoToneIcon from '@material-ui/icons/EditLocationTwoTone';
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';

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
}));

const Contenedor = (props)=>{
const { window } = props;
const classes=useStyles();
const cookies = new Cookies();
const [open, setOpen] = useState(false);
const [encuestas, setEncuestas] = useState(false);
const [tipoAgentes, setTipoAgentes] = useState(false);
const [tipoA, setTipoA] = useState(false);
const [tipoP, setTipoP] = useState(false);
const [analisis, setAnalisis] = useState(false);
const [openAnalisis, setopenAnalisis] = React.useState(false);
const [openMuestreos, setopenMuestreos] = React.useState(false);
const [openIndicadores, setopenIndicadores] = React.useState(false);
const [openFinanciamientos, setFinanciamientos] = React.useState(false);
const [openEncuestas, setopenEncuestas] = React.useState(false);
const [admin, setAdmin] = useState(false);
const [selectedIndex, setSelectedIndex] = React.useState(0);
const [mobileOpen, setMobileOpen] = React.useState(false);
const theme = useTheme();

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

  if(cookies.get('Tipo')!=='null' && cookies.get('Tipo')!=='A')
  {   
    if(cookies.get('IdAgen')==='205')
    {
      setAnalisis(true);
    }
    if(cookies.get('Tipo')==='P' || cookies.get('Tipo')==='I' || cookies.get('Tipo')==='C'){
      setTipoAgentes(true);
    }
    if(cookies.get('Tipo')==='P'){
      setTipoP(true);
    }
    if(cookies.get('Tipo')==='A'){
      setTipoA(true);
    }
    if(cookies.get('Id')==='391'){
      setAdmin(true);
    }  
  } 
  else{
    if(cookies.get('Id')==='391')
    {
      setFinanciamientos(true);
    }
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
     <ListItem className="m-0 p-0" button selected={selectedIndex === 4}
          onClick={(event) => handleListItemClick(event, 4)}>
          <NavLink className="btn" to="/nuevo" exact>
          <ListItemIcon> <InsertDriveFileTwoToneIcon />
          <ListItemText primary="Nuevo" /></ListItemIcon>
          </NavLink>
        </ListItem>  
    
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
   <ListItem className="m-0 p-0" button selected={selectedIndex === 6}
      onClick={(event) => handleListItemClick(event, 6)}>
    <NavLink className="btn" to="/analisis" exact>
      <ListItemIcon> <EditIcon />
      <ListItemText primary="Nuevo" /></ListItemIcon>
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
        <div className="nav-item dropdown">
        <Button variant="text" color="inherit" className="nav-link" data-toggle="dropdown" endIcon={<ArrowDropDownIcon />}></Button>
        <div className="dropdown-menu dropdown-menu-right" style={{width: '10px'}}>         
          <Button variant="text" color="inherit" endIcon={<ExitToAppIcon />} onClick={()=>logout()}>Salir</Button>
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
 </div>
 )
}
export default withRouter(Contenedor)