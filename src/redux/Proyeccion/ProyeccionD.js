import axios from "axios";

//constants
const dataInicial = {
  arrayProyeccion: []
};

const GET_ListProyeccion_Success = "GET_ListProyeccion_Success";

//reducer
export default function proyeccionReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListProyeccion_Success:
      return { ...state, arrayProyeccion: action.payload };

    default:
      return state;
  }
}

//actions
export const getListProyeccionAction = (IdAgen) => async (dispatch, getState) => {    
  try {
      const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/proyeccion'+ `/${IdAgen}`)  
      
      dispatch({
          type: GET_ListProyeccion_Success,
          payload: res.data
      })     
  } catch (error) {
      console.log(error)
  }
} 

