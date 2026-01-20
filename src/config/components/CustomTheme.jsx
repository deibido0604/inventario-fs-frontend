import { ConfigProvider } from "antd";
import { palette } from "@config/palette";

const CustomTheme = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: palette.primary.main,
          colorBgContainer: "#FFF",
          fontFamily: "Geologica",
        },
        components: {
          Menu: {
            itemHoverColor: "#0703F7",
            itemActiveBg: "rgba(0, 0, 0, 0.06)",
            itemSelectedColor: "#0703F7",
            itemSelectedBg: "rgba(176, 195, 216)",
            colorBgElevated: "#D0E7FF",
            colorText: "#0703F7",
          },
          Table: {
            rowSelectedBg: "#D0E7FF",
            rowSelectedHoverBg: "#EFF7FC",
          },
          Select: {
            optionSelectedBg: "#D0E7FF",
          },
          Layout: {
            triggerBg: "rgba(176, 195, 216)",
            triggerColor: "#0703F7",
            siderBg: "#D0E7FF",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default CustomTheme;
