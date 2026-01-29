// toast.ts
import { toast } from "react-toastify";

type ToastType = "success" | "info" | "alert";

export const showToast = (message: string, type: ToastType = "info") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "alert":
      toast.error(message);
      break;
    case "info":
    default:
      toast.info(message);
  }
};
