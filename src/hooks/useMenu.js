import { AbilityContext } from '../admin/context';
import { useAbility } from '@casl/react';

const useMenu = (menuItems) => {
  const ability = useAbility(AbilityContext);

  const filterMenuItems = (items) =>
    items
      .filter((item) => {
        return ability.can(item.action, item.subject);
      })
      .map((item) => {
        const filteredChildren = item.children ? filterMenuItems(item.children) : null;

        if (filteredChildren) {
          return {
            ...item,
            children: filteredChildren,
          };
        } else {
          return {
            ...item,
          };
        }
      });

  return filterMenuItems(menuItems);
};

export default useMenu;
