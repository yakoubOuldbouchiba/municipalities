import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Panel } from 'primereact/panel';
import axiosClient from '../../api/axiosClient';
import './DatabaseViewer.css';

interface Table {
  name: string;
  rows: number;
  engine: string;
  size: string;
}

interface DatabaseInfo {
  tables: Table[];
  size: string;
  charset: string;
}

const DatabaseViewer: React.FC = () => {
  const { t } = useTranslation();
  const toastRef = React.useRef<Toast>(null);
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [tables, setTables] = useState<Table[]>([]);
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTableData, setShowTableData] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch available databases
  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/superadmin/databases');
      setDatabases(response.data.databases);
      if (response.data.databases.length > 0) {
        setSelectedDatabase(response.data.databases[0]);
      }
    } catch (error) {
      console.error('Failed to fetch databases:', error);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: t('superadmin.fetchError', 'Failed to fetch databases'),
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch tables when database changes
  useEffect(() => {
    if (selectedDatabase) {
      fetchTables();
    }
  }, [selectedDatabase]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/api/superadmin/databases/${selectedDatabase}/tables`);
      setTables(response.data.tables);
      setDbInfo(response.data.info);
      setSelectedTable('');
      setTableData([]);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: t('superadmin.fetchTablesError', 'Failed to fetch tables'),
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName: string, offset: number = 0) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/api/superadmin/databases/${selectedDatabase}/tables/${tableName}/data`,
        { params: { limit: rows, offset } }
      );
      setTableData(response.data.data);
      setTableColumns(response.data.columns);
      setTotalRecords(response.data.total);
      setShowTableData(true);
    } catch (error) {
      console.error('Failed to fetch table data:', error);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: t('superadmin.fetchDataError', 'Failed to fetch table data'),
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewTableData = (tableName: string) => {
    setSelectedTable(tableName);
    fetchTableData(tableName, 0);
  };

  const onPageChange = (event: any) => {
    setFirst(event.first);
    fetchTableData(selectedTable, event.first);
  };

  const actionTemplate = (rowData: Table) => {
    return (
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-success p-button-sm"
        onClick={() => handleViewTableData(rowData.name)}
        tooltip={t('superadmin.viewData', 'View Data')}
        tooltipOptions={{ position: 'top' }}
      />
    );
  };

  const sizeTemplate = (rowData: Table) => {
    return <span>{rowData.size}</span>;
  };

  return (
    <div className="database-viewer">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      {/* Database and Table Selection */}
      <Panel header={t('superadmin.selectDatabase', 'Database Selection')} className="mb-3">
        <div className="selection-grid">
          <div className="selection-item">
            <label>{t('superadmin.database', 'Database')}:</label>
            <Dropdown
              value={selectedDatabase}
              options={databases.map(db => ({ label: db, value: db }))}
              onChange={(e) => setSelectedDatabase(e.value)}
              placeholder={t('superadmin.selectDb', 'Select database')}
              className="w-full"
            />
          </div>

          {dbInfo && (
            <>
              <div className="selection-item">
                <label>{t('superadmin.charset', 'Charset')}:</label>
                <InputText value={dbInfo.charset} readOnly className="w-full" />
              </div>
              <div className="selection-item">
                <label>{t('superadmin.size', 'Size')}:</label>
                <InputText value={dbInfo.size} readOnly className="w-full" />
              </div>
            </>
          )}
        </div>
      </Panel>

      {/* Tables List */}
      <Panel header={t('superadmin.tables', 'Tables')} className="mb-3">
        <DataTable
          value={tables}
          loading={loading}
          paginator
          rows={10}
          first={0}
          className="p-datatable-striped"
          emptyMessage={t('superadmin.noTables', 'No tables found')}
        >
          <Column field="name" header={t('superadmin.tableName', 'Table Name')} />
          <Column field="rows" header={t('superadmin.rows', 'Rows')} />
          <Column field="engine" header={t('superadmin.engine', 'Engine')} />
          <Column field="size" header={t('superadmin.size', 'Size')} body={sizeTemplate} />
          <Column body={actionTemplate} style={{ width: '4rem' }} />
        </DataTable>
      </Panel>

      {/* Table Data Dialog */}
      <Dialog
        visible={showTableData}
        style={{ width: '90vw' }}
        header={`${t('superadmin.tableData', 'Table Data')}: ${selectedTable}`}
        modal
        onHide={() => setShowTableData(false)}
        maximizable
      >
        <div className="table-data-container">
          <DataTable
            value={tableData}
            loading={loading}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            totalRecords={totalRecords}
            className="p-datatable-striped p-datatable-sm"
            scrollable
            scrollHeight="flex"
            emptyMessage={t('superadmin.noData', 'No data found')}
          >
            {tableColumns.map((col) => (
              <Column
                key={col.name}
                field={col.name}
                header={col.name}
                sortable
                body={(rowData: any) => {
                  const value = rowData[col.name];
                  if (value === null || value === undefined) {
                    return <span className="null-value">NULL</span>;
                  }
                  if (typeof value === 'object') {
                    return <span>{JSON.stringify(value)}</span>;
                  }
                  if (typeof value === 'string' && value.length > 100) {
                    return <span title={value}>{value.substring(0, 100)}...</span>;
                  }
                  return <span>{value}</span>;
                }}
              />
            ))}
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default DatabaseViewer;
