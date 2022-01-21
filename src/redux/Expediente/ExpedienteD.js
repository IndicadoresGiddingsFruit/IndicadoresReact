import axios from "axios";

//constants
const dataInicial = {
  arrayData: []
};

const GET_List_Success = "GET_List_Success";

//reducer
export default function expedienteReducer(state = dataInicial, action) {
  switch (action.type) 
  {
    case GET_List_Success:
      return { ...state, arrayData: action.payload };

    default:
      return state;
  }
}

//actions
export const getList = (idAgen) => async (dispatch, getState) => {
  try {
    const res = await axios.get(
      "https://giddingsfruit.mx/ApiIndicadores/api/expediente"+ `/${idAgen}`
    );
    dispatch({
      type: GET_List_Success,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};
