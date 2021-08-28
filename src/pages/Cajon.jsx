import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import {List,ListItem, ListItemIcon,ListItemText,Divider, makeStyles, Drawer,useTheme} from '@material-ui/core';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import IconButton from '@material-ui/core/IconButton';
import {ChevronLeftIcon,ChevronRightIcon} from '@material-ui/icons/Menu';
import clsx from 'clsx';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "white"
  },
  toolbar: theme.mixins.toolbar, 
}));

const Cajon = (props)=>{ 
  const styles=useStyles();
  const cookies = new Cookies();  
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [actionProduccion, setactionProduccion] = useState(false);
  const [actionAnalisis, setactionAnalisis] = useState(false);
  
 
  
  useEffect(() => {    
      if(cookies.get('IdAgen')==='205'){
        setactionProduccion(false);
        setactionAnalisis(true);
      }
      else {
      if(cookies.get('Tipo')==='P'){
        setactionProduccion(true);
        setactionAnalisis(false);
      }
      else {
        setactionProduccion(false);
        setactionAnalisis(false);
      }
    }
});
    
return(
/*<Drawer 
  className={styles.drawer} classes={{
    paper: styles.drawerPaper,
  }}
  anchor="left"
  variant={props.variant}
  open={props.open}
  onClose={props.onClose ? props.onClose : null}> */
  
  <Drawer
  variant="permanent"
  className={clsx(styles.drawer, {
    [styles.drawerOpen]: open,
    [styles.drawerClose]: !open,
  })}
  classes={{
    paper: clsx({
      [styles.drawerOpen]: open,
      [styles.drawerClose]: !open,
    }),
  }}>
    
    <div className={styles.toolbar}>
    <IconButton onClick={props.handleDrawer}>
    <a href="/index" className="brand-link" style={{padding: '10px 0 10px 80px'}}>
      <img src="dist/img/logo.png" alt="" className="img-circle" style={{width: '40px'},{height: '40px'}}/>       
    </a> 
    {/*  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}  */}
      
    </IconButton> 
  </div>
  <Divider />
 
    <List component="nav">
    <ListItem button component="a" href="/index">
        <ListItemIcon>
            <AssignmentIndIcon /> 
        </ListItemIcon>
        <ListItemText primary='Encuestas'/>
    </ListItem>
    <Divider />
    </List>
 
</Drawer>
)
}
export default Cajon
      