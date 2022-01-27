import axios from "axios";

//constants
const dataInicial = {
  arrayCampos: [],
};

const GET_ListCampos_Success = "GET_ListCampos_Success"; 

//reducer
export default function camposReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListCampos_Success:
      return { ...state, arrayCampos: action.payload }; 

    default:
      return state;
  }
}

//actions 
export const getListCamposAction = (Cod_Prod,Cod_Campo) => async (dispatch, getState) => {
  try {
      const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/campos' + `/${Cod_Prod}/${Cod_Campo}`)  
      console.log(res.data)
      dispatch({
          type: GET_ListCampos_Success,
          payload: res.data
      })
  } catch (error) {
      console.log(error)
  }
} 
 
 