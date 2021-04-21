import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  useTheme
} from '@material-ui/core';
import { NAVIGATION_ITEMS } from './NavBarConstants';
import { isMobile } from '@utils/mediaQuery';

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: 240,
      flexShrink: 0,
    },
    backgroundColor: '#646262',
  },
  drawerContainer: {
    overflow: 'auto',
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${240}px)`,
      marginLeft: 240,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
    backgroundColor: '#383636',
    color: '#fff',
  },
  active: {
    backgroundColor: '#887C5E !important',
    borderRightColor: theme.palette.primary.main,
    borderRightWidth: 10,
    borderRightStyle: 'solid',
    fontWeight: 'bold',
  },
  navLink: {
    display: 'block',
    textDecoration: 'none',
    color: '#fff',
  },
  navItems: {
    padding: theme.spacing(3, 4),
    textAlign: 'left',
  },
}));

/**
 * Component for the side navigation.
 */
const NavBar = ({ navHidden, setNavHidden, location, history }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileDevice = isMobile();

  const handleListItemClick = (event, index, item) => {
    if (isMobileDevice) {
      setNavHidden(!navHidden);
    };
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {NAVIGATION_ITEMS.map((item, index) => (
          <React.Fragment key={`navItem${index}${item.id}`}>
            <NavLink
              to={item.link}
              activeClassName={classes.active}
              title={item.name}
              className={classes.navLink}
            >
              <ListItem
                button
                className={classes.navItems}
                onClick={(event) => {
                  handleListItemClick(event, index, item)
                }}
              >
                <ListItemText primary={item.name} />
              </ListItem>
            </NavLink>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
  
  const handleDrawerToggle = () => {
    setNavHidden(!navHidden);
  };

  return (
    <nav className={classes.drawer} aria-label='mailbox folders'>
      <Hidden smUp implementation='css'>
        <Drawer
          variant='temporary'
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={navHidden}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation='css'>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant='permanent'
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default NavBar;
