import axios from "axios";

//constants
const dataInicial = {
  arrayRegiones: []
};

const GET_ListRegiones_Success = "GET_ListRegiones_Success";

//reducer
export default function regionesReducer(state = dataInicial, action) {
  switch (action.type) {
    case GET_ListRegiones_Success:
      return { ...state, arrayRegiones: action.payload };

    default:
      return state;
  }
}

//actions
export const getListRegionesAction = () => async (dispatch, getState) => {
  if (localStorage.getItem("regiones")) {
    dispatch({
      type: GET_ListRegiones_Success,
      payload: JSON.parse(localStorage.getItem("regiones")),
    });
    return;
  }
  try {
    const res = await axios.get(
      "https://giddingsfruit.mx/ApiIndicadores/api/regiones"
    );
    dispatch({
      type: GET_ListRegiones_Success,
      payload: res.data,
    });
    localStorage.setItem("regiones", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};
