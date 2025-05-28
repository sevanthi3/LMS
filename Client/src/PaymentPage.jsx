import axios from "axios";

export const creatAccount = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "signup/request" });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post("/api/signup", formData, config);

    dispatch({ type: "signup/success", payload: data });

    return data;
  } catch (error) {
    dispatch({ type: "signup/failure", error: error.message });
    return { success: false };
  }
};
