import {
  EnvironmentOutlined,
  PieChartOutlined,
  ProductOutlined,
  TruckOutlined,
} from "@ant-design/icons";
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
  {
    key: "branch",
    icon: <EnvironmentOutlined />,
    label: <Link to="/main/branch"> {t("app.branch")} </Link>,
    subject: permissions.Subjects.BRANCH,
    action: permissions.Actions.READ,
  },
  {
    key: "outbound",
    icon: <TruckOutlined />,
    label: <Link to="/main/outbound"> {t("app.outbound")} </Link>,
    subject: permissions.Subjects.OUTBOUND,
    action: permissions.Actions.READ,
  },
  {
    key: "outbound-list",
    icon: <TruckOutlined />,
    label: <Link to="/main/outbound-list"> {t("app.outbound_list")} </Link>,
    subject: permissions.Subjects.OUTBOUND_LIST,
    action: permissions.Actions.READ,
  },
];
