import { Spin } from "antd";
import "./styles.scss";
import { LoadingOutlined } from "@ant-design/icons";

const ImageLoader = () => (
  <img
    src="/img/brand_icon_halftone-02.png"
    alt="img_loader"
    className="loading-image"
  />
);

const LoadingOverlay = () => {
  return (
    <div className="loading_overlay">
      <Spin
        indicator={
          <div className="circle">
            <div className="custom-indicator">
              <ImageLoader />
            </div>
            <LoadingOutlined className="loading-icon" spin />
          </div>
        }
      />
    </div>
  );
};

export default LoadingOverlay;
