import { mediaBaseUrl } from "../../redux/api/baseApi";

export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") {
    return "/images/default-avatar.png";
  }
  if (path.startsWith("blob:") || path.startsWith("data:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) return `${mediaBaseUrl}${path}`;
  return `${mediaBaseUrl}/${path}`;
};
