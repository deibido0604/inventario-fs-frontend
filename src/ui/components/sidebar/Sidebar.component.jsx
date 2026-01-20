import { Layout, Menu } from "antd";
import { useTranslate, useMenu } from "@hooks";
import { useState } from "react";
const { Sider } = Layout;
import { sideBarMenu } from "@lists/sideBarMenu";
import "./styles.scss";

export const SiderBarComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslate();
  const menu = sideBarMenu({ t });
  const items = useMenu(menu);

  return (
    <Sider
      className="sidenav"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className={`profile-container ${collapsed ? "collapsed" : ""}`}>
        <img
          src="/img/brand_icon_halftone-02.png"
          alt="Logo"
          className="sidebar-logo"
        />
      </div>
      <Menu
        theme="light"
        mode="inline"
        items={items}
        className="sidebar_menu"
      />
    </Sider>
  );
};
