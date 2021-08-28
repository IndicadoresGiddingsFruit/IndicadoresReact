import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';

export default function Menu(){ 
  const cookies = new Cookies();
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
<div>
  <aside className="main-sidebar sidebar-dark-primary elevation-4">
    <a href="/index" className="brand-link">
      <img src="dist/img/LOGOB.png" alt="" className="img-circle" style={{width: '40px'},{height: '40px'}}/>       
    </a>
    <div className="sidebar">
      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">  
          {actionProduccion?(
          <>
            <li className="nav-item has-treeview">
                      <a href="#" className="nav-link">
                        <i className="nav-icon fas fa-users-cog" />
                        <p>
                          Indicadores
                          <i className="fas fa-angle-left right" />                          
                        </p>
                      </a>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <a href="#" className="nav-link">
                            <i className="fas fa-chart-line" /> <p>Curva</p>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#" className="nav-link">
                            <i className="fas fa-truck-loading" /> <p>Produccion</p>
                          </a>
                        </li>
                        <li className="nav-item">
                        <Link to="/financiamiento" className="nav-link"><i className="fas fa-search-dollar" /> <p>Financiamiento</p></Link>  
                        </li>                       
                      </ul>
                    </li>
            <li className="nav-item has-treeview">
                      <a href="#" className="nav-link">
                        <i className="fas fa-map-marked-alt" /> <p>Visitas <i className="right fas fa-angle-left" /></p>
                      </a>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">                         
                          <a href="#" className="nav-link">
                            <i className="fas fa-file-image" /> <p>Reporte</p>
                          </a>
                        </li>
                        <li className="nav-item">   
                        <Link to="/index" className="nav-link"><i className="fas fa-map-marker-alt" /> <p>Resultados</p></Link>  
                        </li>                       
                      </ul>
                    </li>
          </>
          ):false},                  
            <li className="nav-item has-treeview">
              <a href="#" className="nav-link">
              <i className="fas fa-spa" /> <p>Muestreos<i className="fas fa-angle-left right" /></p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                <Link to="/nuevo" className="nav-link"><i className="fas fa-seedling" /> <p>Nuevo</p></Link>                         
                </li>
                <li className="nav-item">
                <a href="/muestreos" className="nav-link">
                <i className="fas fa-spa" /> <p>Ver todo</p>
                </a>
                </li>
                <li className="nav-item">
                <a href="#" className="nav-link">
                <i className="fas fa-chart-line" /> <p>Evaluación</p>
                </a>
                </li>
                <li className="nav-item">
                <a href="#" className="nav-link">
                <i className="fas fa-check-circle" /> <p>Liberados</p>
                </a>
                </li>                        
                </ul>
                </li>
            
            <li className="nav-item has-treeview">
             <a href="#" className="nav-link">
             <i className="fas fa-chart-area" /> <p> Análisis <i className="fas fa-angle-left right" /> </p>
             </a>
             <ul className="nav nav-treeview">
             <li className="nav-item">
             <a href="/resultados" className="nav-link">
             <i className="fas fa-seedling" /> <p>Resultados</p>
             </a>
            </li>      
            {actionAnalisis?(
            <>
             <li className="nav-item">
             <a href="/analisis" className="nav-link">
             <i className="fas fa-file-signature" /> <p>Nuevo</p>
             </a>
             </li> 
             </>
            ):false},         
          </ul>
        </li> 
            <li className="nav-item has-treeview">
             <a href="#" className="nav-link">
             <i className="fas fa-file-archive" /> <p> Encuestas <i className="fas fa-angle-left right" /> </p>
             </a>
             <ul className="nav nav-treeview">
             <li className="nav-item">
             <a href="/encuestas" className="nav-link">
             <i className="fas fa-file-signature" /> <p>Ver</p>
             </a>
            </li>
            
          </ul>
        </li>                  
       </ul>
      </nav>
     </div>
     </aside>
    </div>
  )
}

