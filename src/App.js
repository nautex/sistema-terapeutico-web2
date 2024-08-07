import * as React from 'react';
import { Box, Container, CssBaseline, Divider, IconButton
  , List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Tooltip, Hidden } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { Menu as MenuIcon, Inbox as InboxIcon, Person as PersonIcon, RecordVoiceOver as RecordVoiceOverIcon
  , EmojiPeople as EmojiPeopleIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon
  , CalendarMonth as CalendarMonthIcon, AssignmentInd as AssignmentIndIcon, EscalatorWarning as EscalatorWarningIcon
  , ContentPasteSearch as ContentPasteSearchIcon, Badge as BadgeIcon, AddCard as AddCardIcon, NoteAlt as NoteAltIcon
  , Calculate as CalculateIcon, BarChart as BarChartIcon } from "@mui/icons-material";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Person from "./containers/Person/Index";
import PersonEdit from "./containers/Person/Edit";
import Member from "./containers/Member/Index";
import MemberEdit from "./containers/Member/Edit";
import Therapy from './containers/Therapy/Index';
import TherapyEdit from './containers/Therapy/Edit';
import TherapyPlan from './containers/TherapyPlan/Index';
import TherapyPlanEdit from './containers/TherapyPlan/Edit';
import TherapyPeriod from './containers/TherapyPeriod/Index';
import Period from './containers/Period/Index';
import PeriodEdit from './containers/Period/Edit';
import TherapyPeriodOpen from './containers/TherapyPeriod/Open';
import SessionTherapist from './containers/Session/IndexTherapist';
import SessionEdit from './containers/Session/Edit';
import Session from './containers/Session/Index';
import useWindowSize from './components/useWindowSize';
import Fee from './containers/Fee/Index';
import FeeEdit from './containers/Fee/Edit';

var drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const windowSize = useWindowSize();

  drawerWidth = (windowSize >= 480 && 240) || 60;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navLinks = [
    {
      title: "Inicio",
      path: "/",
      icon:
      <Tooltip title="Inicio" placement="right-end">
        <InboxIcon aria-label="Inicio" />
      </Tooltip>
    },
    {
      title: "Personas",
      path: "/person",
      icon: 
      <Tooltip title="Personas" placement="right-end">
        <PersonIcon aria-label="Personas" />
      </Tooltip>
    },
    {
      title: "Participantes",
      path: "/member",
      icon:
      <Tooltip title="Participantes" placement="right-end">
        <EmojiPeopleIcon aria-label="Participantes" />
      </Tooltip>
    },
    {
      title: "Tarifa",
      path: "/fee",
      icon:
      <Tooltip title="Tarifas" placement="right-end">
        <CalculateIcon aria-label="Tarifas" />
      </Tooltip>
    },
    {
      title: "Terapias",
      path: "/therapy",
      icon:
      <Tooltip title="Terapias" placement="right-end">
        <AssignmentIndIcon aria-label="Terapias" />
      </Tooltip>
    },
    {
      title: "Planes de Terapia",
      path: "/therapyplan",
      icon:
      <Tooltip title="Planes de Terapia" placement="right-end">
        <BarChartIcon aria-label="Planes de Terapia" />
      </Tooltip>
    },
    {
      title: "Periodos",
      path: "/period",
      icon:
      <Tooltip title="Periodos" placement="right-end">
        <CalendarMonthIcon aria-label="Periodos" />
      </Tooltip>
    },
    {
      title: "Periodos de Terapias",
      path: "/therapyPeriod",
      icon:
      <Tooltip title="Periodos de Terapias" placement="right-end">
        <AddCardIcon aria-label="Periodos de Terapias" />
      </Tooltip>
    },
    {
      title: "Sesiones de Terapeuta",
      path: "/session/24",
      icon:
      <Tooltip title="Sesiones" placement="right-end">
        <EscalatorWarningIcon aria-label="Sesiones" />
      </Tooltip>
    },
    {
      title: "Sesiones",
      path: "/session",
      icon:
      <Tooltip title="Sesiones" placement="right-end">
        <NoteAltIcon aria-label="Sesiones" />
      </Tooltip>
    },
    {
      title: "Control",
      path: "/",
      icon:
      <Tooltip title="Control" placement="right-end">
        <ContentPasteSearchIcon aria-label="Control" />
      </Tooltip>
    },
    {
      title: "Personal",
      path: "/",
      icon:
      <Tooltip title="Personal" placement="right-end">
        <BadgeIcon aria-label="Personal" />
      </Tooltip>
    }
  ]

  return (
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerOpen}
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{flexGrow: 1}}>
                Sistema Terapeutico
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open} sx={{ display: { xs: open ? 'block' : 'none', md: 'block' }}}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
              <List>
                {navLinks.map((item) => (
                  <ListItem key={item.title} component={Link} to={item.path} 
                    disablePadding sx={{ display: 'block' }} style={{color: 'black'}} >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                          {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        sx={{ display: { xs: 'none', md: 'block' }, opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            <Divider />
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, paddingTop: 2, paddingLeft: 0, paddingRight: 0 }}>
            <DrawerHeader />
            <Container>
              <Routes>
                <Route path="/contactanos"></Route>
                <Route path="/person" element={<Person />} ></Route>
                <Route path="/person/edit/:id" element={<PersonEdit />}></Route>
                <Route path="/member" element={<Member />} ></Route>
                <Route path="/member/edit/:id" element={<MemberEdit />}></Route>
                <Route path="/therapy" element={<Therapy />} ></Route>
                <Route path="/therapy/edit/:id" element={<TherapyEdit />} ></Route>
                <Route path="/therapyplan" element={<TherapyPlan />} ></Route>
                <Route path="/therapyplan/edit/:id/:idTerapia" element={<TherapyPlanEdit />} ></Route>
                <Route path="/period" element={<Period />} ></Route>
                <Route path="/period/edit/:id" element={<PeriodEdit />} ></Route>
                <Route path="/therapyPeriod" element={<TherapyPeriod />} ></Route>
                <Route path="/therapyPeriod/open" element={<TherapyPeriodOpen />} ></Route>
                <Route path="/session" element={<Session />} ></Route>
                <Route path="/session/:id" element={<SessionTherapist />} ></Route>
                <Route path="/session/edit/:id/:idTerapiaPeriodo" element={<SessionEdit />} ></Route>
                <Route path="/fee" element={<Fee />} ></Route>
                <Route path="/fee/edit/:id" element={<FeeEdit />} ></Route>
                <Route path="/nosotros"></Route>
                <Route path="/"></Route>
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
  );
}

export default App;
