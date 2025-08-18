import { LoaderIcon } from "lucide-react";
import ThemeStore from "../store/ThemeStore";

const PageLoader = () => {
  const { mytheme } = ThemeStore();
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      data-theme={mytheme}
    >
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};
export default PageLoader;
