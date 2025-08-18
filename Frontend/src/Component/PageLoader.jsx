import { LoaderIcon } from "lucide-react";
import { usethemeStore } from "../store/useThemeStore"

const PageLoader = () => {
  const { theme } = usethemeStore();
  return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};
export default PageLoader;