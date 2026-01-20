import { useDispatch } from "react-redux";
import { setLogged } from "../../config/store";
import { useApi, useLocalStorage } from "../../hooks";
import { endpoints } from "../../utils";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AbilityBuilder } from "@casl/ability";
import { AbilityContext } from "./AbilityContext";
import { openNotification } from "../layout/store/layoutSlice";
import { persistor, resetStore } from "../../store/store";

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

  const [user, setUser] = useState(defaultProvider.user);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = getItemWithDecryption("data");
        if (!data) throw new Error("No data in localStorage");

        const parsed = JSON.parse(data);

        if (parsed?.user?.id) {
          setUser(parsed);
          dispatch(setLogged(true));

          const role = parsed.role || { permissions: [] };

          handlePermissions({
            permissions: role.permissions,
            goToMain: true,
            route: "/main/dashboard",
          });
        } else {
          navigate("/auth/login");
        }
      } catch (error) {
        clearStorage();
        navigate("/auth/login");
      }
    };

    initAuth();
  }, []);

  /* ================= ABILITY ================= */
  const handleUpdateAbility = ({ permissions = [] }) => {
    const { can, rules } = new AbilityBuilder(ability);

    permissions.forEach((permission) => {
      can(permission.action, permission.subject);
    });

    ability.update(rules);
  };

  /* ================= HELPERS ================= */
  const handleSetUser = (data) => setUser(data);

  const clearStorage = () => {
    setUser(null);
    removeItem("data");
  };

  const handlePermissions = ({ permissions = [], route, goToMain = false }) => {
    handleUpdateAbility({ permissions });

    if (goToMain) {
      navigate(route || "/main", { replace: true });
    }
  };

  const setUserRoles = (roles = []) => {
    let name = "";
    let type = "";
    let permissions = [];

    roles.forEach((role) => {
      type += (type ? "-" : "") + role.type;
      name += (name ? "-" : "") + role.name;
      permissions = permissions.concat(role.permissions || []);
    });

    const seenIds = new Set();
    permissions = permissions.filter((p) => {
      if (seenIds.has(p._id)) return false;
      seenIds.add(p._id);
      return true;
    });

    return { type, name, permissions };
  };

  /* ================= LOGIN ================= */
  const handleLogin = (userCredentials) => {
    axios
      .callService({ url: endpoints.authUrl.login })
      .post(userCredentials)
      .then((resp) => {
        const { data } = resp;

        if (data) {
          const role = setUserRoles(data.roles);
          data.role = role;
          handleSetUser(data);
          setItemWithEncryption("data", JSON.stringify(data));

          const options = {
            rolename: role.type,
            goToMain: true,
            permissions: role.permissions,
            route: "/main",
          };

          handlePermissions(options);
          dispatch(setLogged(true));
        } else {
          dispatch(
            openNotification({
              message: "Atención",
              description: resp.error || "Usuario inactivo",
              placement: "bottom",
              type: "error",
              show: true,
            }),
          );
          navigate("/auth/login");
        }
      })
      .catch((err) => {
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
    persistor.purge();
    dispatch(setLogged(false));
    dispatch(resetStore());
    clearStorage();
    navigate("/auth/login");
  };

  const values = {
    user,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
