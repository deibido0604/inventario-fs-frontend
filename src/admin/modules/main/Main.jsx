import { Layout } from "antd";
import { useRoutes } from "react-router-dom";
import {
  BreadCrumbComponent,
  HeaderComponent,
  SiderBarComponent,
} from "../../../ui/index";
const { Content } = Layout;
import { Notification, LoadingOverlay } from "@components";
import { useRouter, useSessionStorage, useSession } from "@hooks";
import { useEffect, useState } from "react";

const Main = () => {
  const { subNavigation } = useRouter();
  const navigation = useRoutes(subNavigation);
  const { getItem } = useSessionStorage();
  const [processingRequest, setProcessingRequest] = useState(false);
  const { listenEvents } = useSession();

  listenEvents();
  useEffect(() => {
    setProcessingRequest(getItem("processing") || false);
    window.addEventListener("storage", storageEventHandler, false);
  }, []);

  const storageEventHandler = () => {
    setProcessingRequest(sessionStorage.getItem("processing") || false);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        height: "auto",
        overflow: "auto",
      }}
    >
      {processingRequest && <LoadingOverlay />}
      <Notification />
      <SiderBarComponent />
      <Layout>
        <HeaderComponent />

        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <BreadCrumbComponent />

          {/* ======================================== Render pages ======================================== */}
          {navigation}
          {/* ======================================== Render pages ======================================== */}
        </Content>

        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div></div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
