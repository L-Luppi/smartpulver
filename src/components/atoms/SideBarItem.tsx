import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SubItem {
  text: string;
  to: string;
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  to?: string;
  subItems?: SubItem[];
}

export default function SidebarItem({ icon, text, to, subItems }: SidebarItemProps) {
  const [open, setOpen] = useState(false);

  const hasSubItems = subItems && subItems.length > 0;

  const handleClick = () => {
    if (hasSubItems) setOpen(!open);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        component={to && !hasSubItems ? Link : 'button'}
        to={to}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        {hasSubItems ? (open ? <ExpandLess /> : <ExpandMore />) : null}
      </ListItemButton>
      {hasSubItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItems.map((sub) => (
              <ListItemButton
                key={sub.text}
                sx={{ pl: 4 }}
                component={Link}
                to={sub.to}
              >
                <ListItemText primary={sub.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
