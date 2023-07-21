import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DonutSmallTwoToneIcon from '@mui/icons-material/DonutSmallTwoTone';

export default function ResponsiveAppBar() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <DonutSmallTwoToneIcon  fontSize="large" />
        <div>
          <Button color="inherit" onClick={() => handleNavigation("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleNavigation("/register")}>
            Register
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
