import { CardContent } from "../../components";
import { useMountEffect, useTranslate } from "@hooks";
import { useLocalStorage } from "@hooks";
import "./styles.scss";
import { useState } from "react";

const Dashboard = () => {
  const { t } = useTranslate();
  const { getItemWithDecryption } = useLocalStorage();

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("es-HN", {
      weekday: 'long',
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [user, setUser] = useState({
    name: "David Torres",
    loginDate: getCurrentDateTime(),
  });

  const getDecryptedData = () => {
    try {
      const encryptedData = getItemWithDecryption('data');
      
      if (encryptedData) {
        const data = JSON.parse(encryptedData);
        
        if (data && data.user) {
          setUser({
            name: data.user.name || data.user.username || "Usuario",
            loginDate: data.user.lastLogin || getCurrentDateTime(),
          });
        } else {
          setUser({
            name: "David Torres",
            loginDate: getCurrentDateTime(),
          });
        }
      } else {
        setUser({
          name: "David Torres",
          loginDate: getCurrentDateTime(),
        });
      }
    } catch (err) {
      console.error("Error al leer datos del usuario:", err);
      setUser({
        name: "David Torres",
        loginDate: getCurrentDateTime(),
      });
    }
  };

  useMountEffect({
    effect: () => {
      getDecryptedData();
    },
    deps: [],
  });

  return (
    <CardContent className="card-content-dashboard">
      <div className="welcome-container">
        <img 
          src="/img/brand_icon_halftone-03.png" 
          alt="Brand Icon" 
          className="dashboard-logo"
        />
        <div className="session-info">
          <h1 className="welcome-message">
            {t("dashboard.hello")}, {user.name}
          </h1>
          <p className="session-time">
            {t("dashboard.welcome")} <br />
            {t("dashboard.time")} <strong>{user.loginDate}</strong>
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default Dashboard;