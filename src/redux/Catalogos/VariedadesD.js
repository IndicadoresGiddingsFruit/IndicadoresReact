import axios from "axios";

//constants
const dataInicial = {
  arrayVariedades: []
};

const GET_ListVariedades_Success = "GET_ListVariedades_Success";

//reducer
export default function variedadesReducer(state = dataInicial, action) {
  switch (action.type) {
    case GET_ListVariedades_Success:
      return { ...state, arrayVariedades: action.payload };

    default:
      return state;
  }
}

//actions
export const getListVariedadesAction = () => async (dispatch, getState) => {
  if (localStorage.getItem("variedades")) {
    dispatch({
      type: GET_ListVariedades_Success,
      payload: JSON.parse(localStorage.getItem("variedades")),
    });
    return;
  }
  try {
    const res = await axios.get(
      "https://localhost:44344/api/catproductos"
    );
    dispatch({
      type: GET_ListVariedades_Success,
      payload: res.data,
    });
    localStorage.setItem("variedades", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};
