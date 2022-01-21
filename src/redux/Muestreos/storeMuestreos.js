import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import muestreosReducer from './MuestreosD'
import camposReducer from '../Catalogos/CamposD'
import agentesReducer from '../Catalogos/AgentesD'
import regionesReducer from '../Catalogos/RegionesD'

const rootReducer = combineReducers({
    muestreos: muestreosReducer,
    campos: camposReducer,
    regiones: regionesReducer,
    agentes :agentesReducer
})
 
export default function generateStore() {
    const muestreos = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
    return muestreos
}