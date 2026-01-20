import { useRouter } from "@hooks";
import { useRoutes } from "react-router-dom";

const Main = () => {
  const { authNavigation } = useRouter();
  const navigation = useRoutes(authNavigation);
  return <>{navigation}</>;
};
export default Main;
