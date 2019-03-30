import React from 'react';
import {TableRow} from "@material-ui/core";
import * as PropTypes from 'prop-types'; // * as because of default export being undefined.
import DataTableCell from './DataTableCell';

class DataTableRow extends React.Component {

    render() {
        const { colNames, row, rowIndex, handleMapsClick, handleDeleteRow } = this.props;

        return <TableRow>
            {colNames.map((col, idx) => {
                return <DataTableCell
                    key={idx}
                    rowIndex={rowIndex}
                    handleMapsClick={handleMapsClick}
                    handleDeleteRow={handleDeleteRow}
                    colName={col.name}
                    colValue={row[col.name] ? row[col.name] : ''}>
                </DataTableCell>
            })}
        </TableRow>
    }
}

DataTableRow.propTypes = {
  colNames: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  handleMapsClick: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired
};

export default DataTableRow;