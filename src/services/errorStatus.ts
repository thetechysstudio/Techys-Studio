import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useErrorStatus = () => {
  const navigate = useNavigate();

  const errorStatus = useCallback(
    (error: any) => {
      const status =
        error?.response?.status ?? // ✅ axios
        error?.status ?? // ✅ custom
        error?.request?.status; // ✅ some cases

      // ✅ if backend sends message/string/object
      const data = error?.response?.data;
      const message =
        (typeof data === "string" ? data : data?.message) ||
        error?.message ||
        "Something went wrong";

      // ✅ Debug once (remove later)
      // console.log("ERROR STATUS:", status, error);

      if (status === 401) {
        localStorage.clear();

        // IMPORTANT: navigate should be called on next tick
        // to avoid being blocked by other renders/effects.
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 0);

        return;
      }

      const alertStatuses = [400, 403, 404, 409, 422, 429, 500, 502, 503, 504];
      // if (alertStatuses.includes(status)) {
      //   alert(message);
      // }
    },
    [navigate]
  );

  return { errorStatus };
};
