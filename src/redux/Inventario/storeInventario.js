import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import inventarioReducer from './InventarioD'
 
const rootReducer = combineReducers({
    inventario: inventarioReducer
})
 
export default function generateStore() {
    const inventario = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
    return inventario
}