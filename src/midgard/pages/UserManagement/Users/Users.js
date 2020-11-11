import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FjButton, FjTable, FjContentSwitcher, FjMenu } from 'freyja-react'
import Crud, { CrudContext } from 'midgard/modules/crud/Crud';
import { getCoreGroups } from 'midgard/redux/coregroup/actions/coregroup.actions'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import { makeStyles } from '@material-ui/core/styles';
import { rem } from 'polished';

const UsersWrapper = styled.div`
  width: 100%;
`;

const useStyles = makeStyles((theme) => ({
  btnPermission: {
    fontSize: rem(10)
  },
}));

/**
 * Current users list
 */
function Users({ location, history, data, dispatch }) {
  const classes = useStyles();
  // state to toggle actions menus
  const [menu, setMenu] = useState({ row: null, element: null });
  const [coreGroupsLoaded, setCoreGroupsLoaded] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (!coreGroupsLoaded) {
      dispatch(getCoreGroups());
      setCoreGroupsLoaded(true);
    } else {
      // define permissions
      setPermissions(data.map(coregroup => {
        return {label: coregroup.name, value: coregroup.id}
      }))
    }
  }, [data]);


  // table templates
  const permissionsTemplate = (row, crud, classes) => {
    if (coreGroupsLoaded) {
      const [active, setActive] = useState(row.core_groups[0] && row.core_groups[0].id || row.core_groups[0]);
      return <ButtonGroup disableElevation color="primary" size="small" disabled={!row.is_active}>
        {permissions.map((permission, index) => (
          <Button
            className={classes.btnPermission}
            key={'btn-group-'+index}
            variant={permission.value === active ? "contained" : "outlined"}
            onClick={() => {
              setActive(permission.value);
              crud.updateItem({id: row.id, core_groups: [permission.value]});
            }}>
            {permission.label}
          </Button>
        ))}
      </ButtonGroup>
    }
  }

  const actionsTemplate = (row, crud) => {
    const handleMenuClick = (event) => {
      setMenu({ row: row, element: event.currentTarget });
    };

    const handleMenuItemClick = (action) => {
      if (action === 'delete') {
        crud.deleteItem(menu.row);
      } else if (action === 'deactivate') {
        crud.updateItem({id: menu.row.id, is_active: false});
      } else {
        crud.updateItem({id: menu.row.id, is_active: true});
      }
      setMenu({ row: null, element: null });
    };

    const handleMenuClose = () => {
      setMenu({ row: null, element: null });
    };
  
    return (
      <React.Fragment>
        <IconButton
          aria-label="more"
          aria-controls={'user-actions-menu-' + row.id}
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          id={'user-actions-menu-' + row.id}
          anchorEl={menu.element}
          keepMounted
          open={Boolean(menu.row && (menu.row.id === row.id))}
          onClose={handleMenuClose}
        >
          {row.actions.map((option) => (
          <MenuItem
            key={'user-actions-' + row.id + '-' + option.value}
            onClick={() => handleMenuItemClick(option.value)}
          >
            {option.label}
          </MenuItem>))}
        </Menu>
      </React.Fragment>
    );
  };

  return (
    <UsersWrapper>
      <Crud
        deleteAction="DELETE_COREUSER"
        updateAction="UPDATE_COREUSER"
        createAction="CREATE_COREUSER"
        loadAction="LOAD_DATA_COREUSER"
        reducer="coreuserReducer"
      >
        { crud => {
          if (crud.getData()) {
            crud.getData().forEach(row => {
              if(row.is_active) {
                row.actions = [
                  { value: 'deactivate', label: 'Deactivate' },
                  { value: 'delete', label: 'Delete' }
                ];
              } else {
                row.actions = [
                  { value: 'activate', label: 'Activate' },
                  { value: 'delete', label: 'Delete' }
                ];
              }
            });
          }
          return (
          <FjTable
            columns={[
              { label: 'Full name', prop: 'name', template: (row) => {return <b style={!row.is_active? {'color': '#aaa'}: null}>{row.first_name} {row.last_name}</b>}, flex: '1' },
              { label: 'Email', prop: 'email', flex: '2', template: (row) => {return <span style={!row.is_active? {'color': '#aaa'}: null}> {row.email} </span>}},
              { label: 'Last activity', prop: 'activity', template: (row) => {return <small style={{'color': '#aaa'}}>Today</small>}, flex: '1' },
              { label: 'Permissions', prop: 'permission', template: (row) => permissionsTemplate(row, crud, classes), flex: '2' },
              { label: 'Actions', prop: 'options', template: (row) => actionsTemplate(row, crud), flex: '1' },
            ]}
            rows={crud.getData()}
          />)
        }}
      </Crud>
  </UsersWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({...state.coreGroupReducer, ...ownProps});

export default connect(mapStateToProps)(Users);
