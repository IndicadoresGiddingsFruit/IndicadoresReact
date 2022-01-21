import axios from "axios";

//constants
const dataInicial = {
  arrayZonas: [],
};

const GET_ListZonas_Success = "GET_ListZonas_Success";

//reducer
export default function zonasReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListZonas_Success:
      return { ...state, arrayZonas: action.payload };

    default:
      return state;
  }
}

//action
export const getListZonasAction = () => async (dispatch, getState) => {
    if (localStorage.getItem("zonas")) {
      dispatch({
        type: GET_ListZonas_Success,
        payload: JSON.parse(localStorage.getItem("zonas")),
      });
      return;
    }
    try {
      const res = await axios.get(
        "https://giddingsfruit.mx/ApiIndicadores/api/json"
      );
      dispatch({
        type: GET_ListZonas_Success,
        payload: res.data,
      });
      localStorage.setItem("zonas", JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };
  