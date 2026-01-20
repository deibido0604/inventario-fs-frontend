import { useLocation, matchRoutes } from "react-router-dom";
import _authNavigation from "../auth/routes";
import _mainNavigation from "../router/routes";
import _subNavigation from "../admin/routes";

import { Can, NoAccess } from "../admin/components";

const childrenNavigation = (children, firstLevel) => {
  return children.reduce((acchild, child) => {
    let path = child.path;
    if (path && path !== "*") {
      let subRoute = `${firstLevel}/${path}`;
      acchild.push(subRoute);
      if (child.children) {
        let secondLevel = `${firstLevel}/${path}`;
        let subNavigation = childrenNavigation(child.children, secondLevel);
        acchild.push(...subNavigation);
      }
    }
    return acchild;
  }, []);
};

const generateNavigation = (routes) => {
  return [...routes].reduce((acc, route) => {
    let path = route.path;
    let objectName = "";
    if (path !== "*") {
      if (/(^[/])([A-Za-z])/.test(path)) {
        path = path.split("/")[1];
      }
      objectName = path;
      path = `/${path}`;
      Object.assign(acc, { [objectName]: [path] });
      if (route.children) {
        const prefix = path;
        let subNavigation = childrenNavigation(route.children, prefix);
        Object.assign(acc, { [objectName]: [path, ...subNavigation] });
        generateNavigation(route.children);
      }
    }
    return acc;
  }, {});
};

const mapRoutes = (routes) => {
  return [...routes].map((route) => {
    let element = undefined;
    if (route.element) {
      if (route.subject) {
        element = (
          <Can I={route.action} a={route.subject} passThrough>
            {(allowed) =>
              allowed ? (
                <route.element to={route.to} {...route.props} />
              ) : (
                <NoAccess />
              )
            }
          </Can>
        );
      } else {
        element = <route.element to={route.to} {...route.props} />;
      }
    }
    return {
      ...route,
      element,
      children: route.children ? mapRoutes(route.children) : [],
    };
  });
};

const currentPath = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = useLocation();
  // eslint-disable-next-line no-undef
  const [{ route }] = matchRoutes(routes, location);

  return route.path;
};

const state = {
  mainNavigation: mapRoutes(_mainNavigation),
  subNavigation: mapRoutes(_subNavigation),
  authNavigation: mapRoutes(_authNavigation),
  appRoutes: generateNavigation([
    ..._mainNavigation,
    ..._subNavigation,
    ..._authNavigation,
  ]),
  currentPath,
};

export const useRouter = () => state;
