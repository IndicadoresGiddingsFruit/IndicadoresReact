import axios from "axios";

//constants
const dataInicial = {
  arrayFueraLimite: []
};

const GET_ListFueraLimite_Success = "GET_ListFueraLimite_Success"; 

//reducer
export default function analisisFLReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListFueraLimite_Success:
      return { ...state, arrayFueraLimite: action.payload }; 

    default:
      return state;
  }
}

//actions  
export const getListAnalisisFueraLimiteAction = ( id,tipo,depto,idMuestreo,estatus) => async (dispatch, getState) => {
  try {
      const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/analisis'+ `/${id}/${tipo}/${depto}/${idMuestreo}/${estatus}`)  
      dispatch({
          type: GET_ListFueraLimite_Success,
          payload: res.data
      })
  } catch (error) {
      console.log(error)
  }
} 

 