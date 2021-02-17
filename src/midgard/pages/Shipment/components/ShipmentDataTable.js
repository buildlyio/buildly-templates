import React, { useContext, useState } from "react";
import MUIDataTable from "mui-datatables";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/RemoveRedEye";
import DeleteIcon from "@material-ui/icons/Delete";
import { SHIPMENT_DATA_TABLE_COLUMNS } from "../ShipmentConstants";
import { checkForGlobalAdmin } from "midgard/utils/utilMethods";
import { UserContext } from "midgard/context/User.context";

const CustomCheckbox = (props) => {
  let newProps = Object.assign({}, props);
  newProps.color = props['data-description'] === 'row-select' ? 'secondary' : 'primary';

  if (props['data-description'] === 'row-select') {
    return (<Radio {...newProps} />);
  } else {
    return (<Checkbox {...newProps} />);
  }
};

const ShipmentDataTable = ({ rows, editAction, deleteAction, setSelectedShipment }) => {
  const [selected, setSelected] = useState(0);
  const user = useContext(UserContext);
  const isAdmin = checkForGlobalAdmin(user);
  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    tableBodyHeight: "400px",
    tableBodyMaxHeight: "",
    selectableRows: "single",
    selectToolbarPlacement: "none",
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: { filename: "ShipmentData.csv", separator: "," },
    rowsSelected: [selected],
    onRowSelectionChange: (rowsSelected) => {
      const index = rowsSelected[0].dataIndex;
      setSelected(index);
      setSelectedShipment(rows[index]);
    },
    textLabels: {
      body: {
        noMatch: "No data to display",
      },
    },
  };
  const columns = [
    {
      name: "Edit",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          return (
            <IconButton onClick={() => editAction(row)}>
              {!isAdmin && row && row.status && 
              row.status.toLowerCase() !== 'planned' 
                ? <ViewIcon /> 
                : <EditIcon />
              }
            </IconButton>
          );
        }
      }
    },
    {
      name: "Delete",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <IconButton onClick={() => deleteAction(rows[dataIndex])}>
              <DeleteIcon />
            </IconButton>
          );
        }
      }
    },
    ...SHIPMENT_DATA_TABLE_COLUMNS
  ];

  return (
    <MUIDataTable
      data={rows}
      columns={columns}
      options={options}
      components={{
        Checkbox: CustomCheckbox,
      }}
    />
  )
}

export default ShipmentDataTable;