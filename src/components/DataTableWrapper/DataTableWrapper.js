import React from 'react';
import MUIDataTable from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Button,
  IconButton,
  Box,
  Typography,
  MenuItem,
  Menu,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import Loader from '@components/Loader/Loader';
import ConfirmModal from '@components/Modal/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  iconButton: {
    padding: theme.spacing(1.5, 0.5),
  },
}));

const DataTableWrapper = ({
  loading,
  rows,
  columns,
  filename,
  addButtonHeading,
  onAddButtonClick,
  children,
  editAction,
  detailsAction,
  deleteAction,
  openDeleteModal,
  setDeleteModal,
  handleDeleteModal,
  deleteModalTitle,
  tableHeight,
  tableHeader,
  hideAddButton,
  selectable,
  selected,
  customSort,
  noCustomTheme,
  noSpace,
  noOptionsIcon,
}) => {
  const classes = useStyles();
  // dropdown menu variables
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let finalColumns = [];
  if (editAction) {
    finalColumns = [
      ...finalColumns,
      {
        name: 'Edit',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              className={classes.iconButton}
              onClick={() => editAction(rows[dataIndex])}
            >
              <EditIcon />
            </IconButton>
          ),
        },
      },
    ];
  }
  if (deleteAction) {
    finalColumns = [
      ...finalColumns,
      {
        name: 'Delete',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              onClick={() => deleteAction(rows[dataIndex])}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      },
    ];
  }

  finalColumns = [
    ...finalColumns,
    ...columns,
  ];

  if (editAction || deleteAction || detailsAction) {
    finalColumns = [
      ...finalColumns,
      {
        name: 'Actions',
        options: {
          sort: false,
          filter: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => (
            <>
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={
                  {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }
                }
                transformOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
              >
                {
                  editAction && (
                    <MenuItem onClick={() => editAction(rows[dataIndex])}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      Edit
                    </MenuItem>
                  )
                }
                {
                  detailsAction && (
                    <MenuItem onClick={() => detailsAction(rows[dataIndex])}>
                      <ListItemIcon>
                        <MenuIcon fontSize="small" />
                      </ListItemIcon>
                      Details
                    </MenuItem>
                  )
                }
                {
                  deleteAction && (
                    <div>
                      <Divider />
                      <MenuItem onClick={() => deleteAction(rows[dataIndex])}>
                        <ListItemIcon>
                          <DeleteIcon color="red" fontSize="small" />
                        </ListItemIcon>
                        Delete
                      </MenuItem>
                    </div>
                  )
                }
              </Menu>
            </>
          ),
        },
      },
    ];
  }

  const options = {
    download: !noOptionsIcon,
    print: !noOptionsIcon,
    search: !noOptionsIcon,
    viewColumns: !noOptionsIcon,
    filter: !noOptionsIcon,
    filterType: 'multiselect',
    responsive: 'standard',
    tableBodyHeight: tableHeight || '',
    selectableRows: selectable && selectable.rows
      ? selectable.rows
      : 'none',
    selectToolbarPlacement: 'none',
    selectableRowsHeader: selectable && selectable.rowsHeader
      ? selectable.rowsHeader
      : true,
    selectableRowsHideCheckboxes: selectable && selectable.rowsHideCheckboxes
      ? selectable.rowsHideCheckboxes
      : false,
    rowsSelected: selected || [],
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: noOptionsIcon
      ? {
        filename: 'nothing.csv',
        separator: ',',
      }
      : {
        filename: `${filename}.csv`,
        separator: ',',
      },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => !noCustomTheme && ({
      className: classes.dataTableBody,
    }),
    customSort,
  };

  return (
    <Box mt={noSpace ? 0 : 5} mb={noSpace ? 0 : 5}>
      {loading && <Loader open={loading} />}
      <div>
        {!hideAddButton && (
          <Box mb={3} mt={2}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={onAddButtonClick}
            >
              <AddIcon />
              {` ${addButtonHeading}`}
            </Button>
          </Box>
        )}

        {tableHeader && (
          <Typography className={classes.dashboardHeading} variant="h4">
            {tableHeader}
          </Typography>
        )}

        <Grid className={`${!noCustomTheme && classes.dataTable}`} container spacing={2}>
          <Grid item xs={12}>
            <MUIDataTable
              data={rows}
              columns={finalColumns}
              options={options}
            />
          </Grid>
        </Grid>

        {children}
      </div>

      {deleteAction && openDeleteModal && setDeleteModal && handleDeleteModal
      && deleteModalTitle && (
        <ConfirmModal
          open={openDeleteModal}
          setOpen={setDeleteModal}
          submitAction={handleDeleteModal}
          title={deleteModalTitle}
          submitText="Delete"
        />
      )}
    </Box>
  );
};

export default DataTableWrapper;
