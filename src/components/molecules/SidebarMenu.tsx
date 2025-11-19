import { List } from "@mui/material";
import SidebarItem from "../atoms/SideBarItem";
import { SIDEBAR_MENU } from "../../routes/menuConfig";

export default function SidebarMenu() {
  return (
    <List sx={{ flexGrow: 1 }}>
      {SIDEBAR_MENU.map((item) => (
        <SidebarItem
          key={item.text}
          icon={item.icon}
          text={item.text}
          to={item.to}
          subItems={item.subItems}
        />
      ))}
    </List>
  );
}
