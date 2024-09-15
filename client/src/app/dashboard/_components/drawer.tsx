"use client";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "@/store/store";
import { toggleDrawer } from "@/store/slices/drawerSlice";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from "next/link"

interface DrawerComponentProps {
  items: { slug: string, text: string, icon: React.ReactNode; active?: boolean }[];
}

export default function DrawerComponent({ items }: DrawerComponentProps) {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.drawer);

  const toggle = () => {
    dispatch(toggleDrawer(false));
  }

  return (
    <Drawer
      anchor={'left'}
      open={isOpen.isOpen}
      onClose={() => toggle()}
    >
      <Box sx={{
        width: 250,
        backgroundColor: "#f0f0f0",
        height: "100%",
        color: "#0f0f0f"
      }}>
        <div className="">
          <img
            src="/logo.svg"
            alt="Ray Enterprises Logo"
            className="mx-auto"
            width={180}
            height={90}
          />
        </div>
        <List>
          {items.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton component="a" href={item.slug}
                className={`
                  ${item.active
                    ? "bg-[#0a1d35] text-white"
                    : "hover:bg-indigo-50 text-gray-600"}
                `}
              >

                <ListItemText primary={
                  <div className="flex items-center w-full">
                    {item.icon}
                    <span className="ml-2">{item.text}</span>
                  </div>
                } />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
