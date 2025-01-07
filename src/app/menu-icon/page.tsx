import { iconsDictionary } from "@/components/store/icon";
import React from "react";

const Menu = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      <ul className="space-y-4">
        {Object.entries(iconsDictionary).map(([key, iconData]) => {
          const IconComponent = iconData.component;
          return (
            <li key={key} className="flex items-center space-x-3">
              <IconComponent size={24} />
              <span>{iconData.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Menu;
