import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState([]);
  const doRequest = async () => {
    try {
      setErrors([]);
      const res = await axios[method](url, { ...body });
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (err) {
      {
        setErrors(
          <div className="alert alert-danger mt-2">
            <h4>Ooops</h4>
            <ul className="my-0">
              {err.response.data.errors.map((err) => (
                <li key={err.message}>{err.message}</li>
              ))}
            </ul>
          </div>
        );
      }
    }
  };
  return { doRequest, errors };
};

export default useRequest;
