import axios from "axios";

//constants
const dataInicial = {
  arrayRecepcion: [],
};

const GET_ListRecepcion_Success = "GET_ListRecepcion_Success";

//reducer
export default function recepcionReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListRecepcion_Success:
      return { ...state, arrayRecepcion: action.payload };
    default:
      return state;
  }
}

//actions
export const getListRecepcionAction = (IdAgen) => async (dispatch, getState) => { 
  try {
      const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/recepcion'+ `/${IdAgen}`)  
      console.log(res.data);
      dispatch({
          type: GET_ListRecepcion_Success,
          payload: res.data
      })
  } catch (error) {
      console.log(error)
  }
} 
