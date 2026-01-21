import { CardContent } from "../../components";
import { useMountEffect, useTranslate } from "@hooks";
import { useLocalStorage } from "@hooks";
import "./styles.scss";
import { useState } from "react";

const Dashboard = () => {
  const { t } = useTranslate();
  const { getItemWithDecryptionDash } = useLocalStorage();

  const getCurrentDateTime = () => {
    const now = new Date();
    try {
      const formattedDate = now.toLocaleString("es-HN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Tegucigalpa",
      });
      return formattedDate;
    } catch (error) {
      return now.toISOString();
    }
  };

  const [user, setUser] = useState({
    loginDate: getCurrentDateTime(),
  });

  const getDecryptedData = () => {
    try {
      const storedData = getItemWithDecryptionDash("data");
      if (!storedData) {
        setUser({
          name: " ",
          loginDate: getCurrentDateTime(),
        });
        return;
      }

      let userData;

      if (storedData.user && storedData.user.id) {
        userData = storedData;
      } else if (storedData._id && storedData.username) {
        userData = {
          user: {
            id: storedData._id,
            username: storedData.username,
            name: storedData.name,
            lastName: storedData.lastName,
            email: storedData.email,
            lastLogin: storedData.lastLogin,
            active: storedData.active,
            department: storedData.department,
          },
        };
      } else {
        setUser({
          name: " ",
          loginDate: getCurrentDateTime(),
        });
        return;
      }

      let loginDate = getCurrentDateTime();
      if (userData.user.lastLogin) {
        try {
          const lastLoginDate = new Date(userData.user.lastLogin);
          loginDate = lastLoginDate.toLocaleString("es-HN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch (dateError) {}
      }

      const newUserData = {
        name: userData.user.name || userData.user.username || "Usuario",
        loginDate: loginDate,
        rawData: userData,
      };

      setUser(newUserData);
    } catch (err) {
      setUser({
        name: " ",
        loginDate: getCurrentDateTime(),
      });
    }
  };
  useMountEffect({
    effect: () => {
      getDecryptedData();

      setTimeout(() => {
        const rawLocalStorage = localStorage.getItem("data");
      }, 500);
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
          onError={(e) => {
            e.target.style.display = "none";
          }}
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
