import { GlobalOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Layout, Popover } from "antd";
import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { AuthContext } from "../../../admin/context";
import { setLocale } from "../../../config/store";
import "./styles.scss";
const { Header } = Layout;

export const HeaderComponent = () => {
  const dispatch = useDispatch();
  const { logout } = useContext(AuthContext);

  const content = (
    <div>
      <Button
        onClick={() => {
          handleLocale("en-US");
        }}
        type="text"
        block
      >
        EN
      </Button>
      <Button
        onClick={() => {
          handleLocale("es-ES");
        }}
        type="text"
        block
      >
        ES
      </Button>
    </div>
  );

  const handleLocale = (locale) => {
    localStorage.setItem("locale", locale);
    dispatch(setLocale(locale));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Header
        style={{
          background: "#ffff",
        }}
      >
        <div className="nav-container">
          <Popover placement="bottom" content={content} trigger="click">
            <Button icon={<GlobalOutlined />}></Button>
          </Popover>

          <Button onClick={handleLogout} icon={<LogoutOutlined />}>
            {" "}
            <FormattedMessage id="app.userinfo.logout" />
          </Button>
        </div>
      </Header>
    </>
  );
};
