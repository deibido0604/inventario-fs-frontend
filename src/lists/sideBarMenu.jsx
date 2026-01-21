import { PieChartOutlined, ProductOutlined } from "@ant-design/icons";
import { permissions } from "@utils";
import { Link } from "react-router-dom";

export const sideBarMenu = ({ t }) => [
  {
    key: "dashboard",
    icon: <PieChartOutlined />,
    label: <Link to="/main"> {t("app.dashboard")} </Link>,
    subject: permissions.Subjects.DASHBOARD,
    action: permissions.Actions.READ,
  },
  {
    key: "products",
    icon: <ProductOutlined />,
    label: <Link to="/main/products"> {t("app.products")} </Link>,
    subject: permissions.Subjects.PRODUCTS,
    action: permissions.Actions.READ,
  },
];
