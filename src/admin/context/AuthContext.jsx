/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux";
import { setLogged } from "../../config/store";
import { useApi, useLocalStorage } from "@hooks";
import { endpoints } from "@utils";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AbilityBuilder } from "@casl/ability";
import { AbilityContext } from "./AbilityContext";
import { openNotification } from "../layout/store/layoutSlice";
import { persistor, resetStore } from "../../store/store";
import LoadingPage from "../components/Loader/LoadingPage";

const defaultProvider = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const ability = useContext(AbilityContext);
  const axios = useApi();
  const { setItemWithEncryption, removeItem, getItemWithDecryption } =
    useLocalStorage();
  const navigate = useNavigate();

  // STATES
  const [user, setUser] = useState(defaultProvider.user);
  const [initializing, setInitializing] = useState(true);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getItemWithDecryption("data");

        let userData = storedUser;
        if (typeof storedUser === "string") {
          try {
            userData = JSON.parse(storedUser);
          } catch (parseError) {
            console.error("❌ Error parseando string:", parseError);
            throw new Error("Datos corruptos");
          }
        }

        if (userData && userData.user && userData.user.id) {
          if (!userData.role && userData.roles) {
            const role = setUserRoles(userData.roles);
            userData.role = role;
            setItemWithEncryption("data", userData);
          }

          setUser(userData);
          dispatch(setLogged(true));

          const role = userData.role || { permissions: [] };
          handleUpdateAbility({ permissions: role.permissions || [] });

          const currentPath = window.location.pathname;

          if (
            !currentPath.startsWith("/main") &&
            !currentPath.includes("/auth/login") &&
            !currentPath.includes("/auth/register")
          ) {
            navigate("/main", { replace: true });
          }
        } else {
          const publicPaths = ["/auth/login", "/auth/register"];
          const currentPath = window.location.pathname;

          if (!publicPaths.includes(currentPath)) {
            navigate("/auth/login", { replace: true });
          }
        }
      } catch (error) {
        console.error("💥 Error crítico en initAuth:", error);
        clearStorage();

        const currentPath = window.location.pathname;
        if (!currentPath.includes("/auth/")) {
          navigate("/auth/login", { replace: true });
        }
      } finally {
        setInitializing(false);
      }
    };

    // Pequeño delay
    setTimeout(() => {
      initAuth();
    }, 100);
  }, []);

  /* ================= ABILITY ================= */
  const handleUpdateAbility = ({ permissions = [] }) => {
    const { can, rules } = new AbilityBuilder(ability);
    if (permissions && Array.isArray(permissions)) {
      permissions.forEach((permission) => {
        if (permission.action && permission.subject) {
          can(permission.action, permission.subject);
        }
      });
    }
    ability.update(rules);
  };

  /* ================= HELPERS ================= */
  const handleSetUser = (data) => setUser(data);

  const clearStorage = () => {
    setUser(null);
    removeItem("data");
    dispatch(setLogged(false));
  };

  const setUserRoles = (roles = []) => {
    let name = "";
    let type = "";
    let permissions = [];

    if (Array.isArray(roles)) {
      roles.forEach((role) => {
        type += (type ? "-" : "") + (role.type || "");
        name += (name ? "-" : "") + (role.name || "");
        permissions = permissions.concat(role.permissions || []);
      });
    }

    // Eliminar duplicados
    const seenIds = new Set();
    permissions = permissions.filter((permission) => {
      if (!permission || !permission._id) return false;
      if (seenIds.has(permission._id)) return false;
      seenIds.add(permission._id);
      return true;
    });

    return { type, name, permissions };
  };

  /* ================= LOGIN ================= */
  const handleLogin = (credentials) => {
    axios
      .callService({ url: endpoints.authUrl.login })
      .post(credentials)
      .then((resp) => {
        let { data } = resp;

        if (data) {
          if (data.active === true) {
            const role = setUserRoles(data.roles || []);

            const userData = {
              user: {
                id: data._id,
                username: data.username,
                email: data.email,
                name: data.name,
                lastName: data.lastName,
                department: data.department,
                active: data.active,
                lastLogin: data.lastLogin,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              },
              token: data.token,
              branch: data.branch,
              role: role,
              permissions: data.permissions || [],
            };

            setItemWithEncryption("data", userData);

            handleSetUser(userData);
            dispatch(setLogged(true));
            handleUpdateAbility({ permissions: role.permissions || [] });

            navigate("/main", { replace: true });
          } else {
            dispatch(
              openNotification({
                message: "Atención",
                description: "Usuario inactivo",
                placement: "bottom",
                type: "error",
                show: true,
              }),
            );
          }
        } else {
          dispatch(
            openNotification({
              message: "Atención",
              description: resp.error || "Error en credenciales",
              placement: "bottom",
              type: "error",
              show: true,
            }),
          );
        }
      })
      .catch(() => {
        dispatch(
          openNotification({
            message: "Atención",
            description: "Error de autenticación",
            placement: "bottom",
            type: "error",
            show: true,
          }),
        );
      });
  };
  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    axios
      .callService({ url: endpoints.authUrl.logout })
      .post()
      .then(async ({ data }) => {
        if (data) {
          console.log("✅ Logout exitoso en servidor");
        }
      })
      .catch((error) => {
        console.error("⚠️ Error en logout del servidor:", error);
      })
      .finally(() => {
        persistor.purge();
        dispatch(setLogged(false));
        dispatch(resetStore());
        clearStorage();
        navigate("/auth/login", { replace: true });
      });
  };

  const values = {
    user,
    login: handleLogin,
    logout: handleLogout,
  };

  if (initializing) {
    return <LoadingPage />;
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
