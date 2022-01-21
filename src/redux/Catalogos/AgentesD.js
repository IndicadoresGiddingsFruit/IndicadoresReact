import axios from "axios";

//constants
const dataInicial = {
  arrayAsesores: []
};

const GET_ListAsesores_Success = "GET_ListAsesores_Success";

//reducer
export default function asesoresReducer(state = dataInicial, action) {
  switch (action.type) 
  {
    case GET_ListAsesores_Success:
      return { ...state, arrayAsesores: action.payload };

    default:
      return state;
  }
}

//actions
export const getListAsesoresAction = (depto) => async (dispatch, getState) => {
  if (localStorage.getItem("asesores"+`/${depto}`)) {
    dispatch({
      type: GET_ListAsesores_Success,
      payload: JSON.parse(localStorage.getItem("asesores"+`/${depto}`)),
    });
    return;
  }
  try {
    const res = await axios.get(
      "https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${depto}`
    );
    dispatch({
      type: GET_ListAsesores_Success,
      payload: res.data,
    });
    localStorage.setItem("asesores"+`/${depto}`, JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};
