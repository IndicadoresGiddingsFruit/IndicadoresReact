import {Route} from 'react-router-dom';
import Routes from './Routes';

const PrivateRoute=(props)=>{
    return(
       /*  <Routes exact={props.exact} path={props.path} component={props.component} /> */
       <Routes {...props} />
    );
};
export default PrivateRoute;