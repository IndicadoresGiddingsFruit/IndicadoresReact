import React, {useEffect} from 'react';
import clsx from 'clsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import { withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles, IconButton, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const drawerWidth = 240;
const useStyles=makeStyles(theme=>({ 
  /* menuButton:{
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  }, */
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
}))

function Header (props) {
const styles=useStyles();
const cookies = new Cookies();
const [open, setOpen] = React.useState(false);

 
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

useEffect(()=>{
    if(!cookies.get('Id')){
        props.history.push('/');
    }
  },[]); 

return(
  <AppBar position="fixed"
  className={clsx(styles.appBar, {
    [styles.appBarShift]: open,
  })}>
    <Toolbar>
    {/* <IconButton color="inherit" aria-label="menu" className={styles.menuButton} onClick={()=>props.abrirMenu()}> */}
    <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawer}
            edge="start"
            className={clsx(styles.menuButton, {
              [styles.hide]: open,
            })}
          >
      <MenuIcon />
    </IconButton>
      <Typography variant="h6" className={styles.title}>
      {cookies.get('Completo')}
      </Typography>
     

      <div className="nav-item dropdown">
      <Button variant="text" color="inherit" className="nav-link" data-toggle="dropdown" endIcon={<ArrowDropDownIcon />}></Button>
        <div className="dropdown-menu dropdown-menu-right" style={{width: '10px'}}>         
          <Button variant="text" color="inherit" endIcon={<ExitToAppIcon />} onClick={()=>logout()}>Salir</Button>
        </div>
      </div>
      
    </Toolbar>
  </AppBar>
);
}
  
export default withRouter(Header);