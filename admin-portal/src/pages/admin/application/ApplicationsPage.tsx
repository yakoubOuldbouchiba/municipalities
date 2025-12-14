import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axiosClient from '../../../api/axiosClient';
import './ApplicationsPage.css';
import ApplicationDialog from './ApplicationDialog';

type Application = {
  id: number;
  code: string;
  label: Record<string, string>;
  color: string;
  icon: string;
  navItems?: Array<{ id: number; label: Record<string, string>; icon: string; path: string }>;
  created_at?: string;
  updated_at?: string;
};

const ApplicationsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toastRef = React.useRef<Toast>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    label: {} as Record<string, string>,
    color: '#3B82F6',
    icon: 'pi pi-window-maximize',
  });

  const [editingAppId, setEditingAppId] = useState<number | null>(null);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const getLabel = (label: any, lang: string = 'en'): string => {
    if (typeof label === 'string') return label;
    if (typeof label === 'object' && label) {
      return label[lang] || label['en'] || Object.values(label)[0] || '-';
    }
    return '-';
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/modules', { params: { lang: i18n.language } });
      setApplications(res.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: t('applications.errorFetch', 'Failed to fetch applications'),
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const openDialog = async (app?: Application) => {
    if (app) {
      try {
        setIsEditing(true);
        setEditingAppId(app.id);
        // Fetch the full application object
        const response = await axiosClient.get(`/modules/${app.id}`);
        const fullApp = response.data;
        setFormData({
          code: fullApp.code,
          label: fullApp.label || {},
          color: fullApp.color || '#3B82F6',
          icon: fullApp.icon || 'pi pi-window-maximize',
        });
      } catch (err) {
        console.error('Error loading application:', err);
        toastRef.current?.show({
          severity: 'error',
          summary: t('common.error', 'Error'),
          detail: t('applications.errorLoading', 'Failed to load application'),
          life: 3000
        });
        return;
      }
    } else {
      setIsEditing(false);
      setEditingAppId(null);
      setFormData({
        code: '',
        label: {},
        color: '#3B82F6',
        icon: 'pi pi-window-maximize',
      });
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setFormData({
      code: '',
      label: {},
      color: '#3B82F6',
      icon: 'pi pi-window-maximize',
    });
    setSelectedLang(null);
    setEditingAppId(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Validate
    if (!formData.code.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('applications.codeRequired', 'Code is required'),
        life: 3000
      });
      return;
    }

    if (Object.keys(formData.label).length === 0) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('applications.labelRequired', 'At least one language label is required'),
        life: 3000
      });
      return;
    }

    try {
      const payload = {
        code: formData.code.trim(),
        label: formData.label,
        color: formData.color,
        icon: formData.icon,
      };

      if (isEditing && editingAppId) {
        await axiosClient.put(`/modules/${editingAppId}`, payload);
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success', 'Success'),
          detail: t('applications.updateSuccess', 'Application updated successfully'),
          life: 3000
        });
      } else {
        await axiosClient.post('/modules', payload);
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success', 'Success'),
          detail: t('applications.createSuccess', 'Application created successfully'),
          life: 3000
        });
      }

      await fetchApplications();
      closeDialog();
    } catch (err: any) {
      console.error('Error saving application:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: err.response?.data?.message || t('applications.errorSave', 'Failed to save application'),
        life: 3000
      });
    }
  };

  const handleDelete = (app: Application) => {
    confirmDialog({
      message: t('applications.confirmDelete', 'Are you sure you want to delete this application?'),
      header: t('common.confirm', 'Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/modules/${app.id}`);
          toastRef.current?.show({
            severity: 'success',
            summary: t('common.success', 'Success'),
            detail: t('applications.deleteSuccess', 'Application deleted successfully'),
            life: 3000
          });
          await fetchApplications();
        } catch (err: any) {
          console.error('Error deleting application:', err);
          toastRef.current?.show({
            severity: 'error',
            summary: t('common.error', 'Error'),
            detail: err.response?.data?.message || t('applications.errorDelete', 'Failed to delete application'),
            life: 3000
          });
        }
      }
    });
  };

  const actionBodyTemplate = (rowData: Application) => (
    <div className="flex gap-1 justify-center">
      <Button
        icon="pi pi-pencil"
        className="p-button-sm"
        onClick={() => openDialog(rowData)}
        aria-label="Edit"
        tooltip={t('common.edit', 'Edit')}
        tooltipOptions={{ position: 'top' }}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-sm p-button-danger"
        onClick={() => handleDelete(rowData)}
        aria-label="Delete"
        tooltip={t('common.delete', 'Delete')}
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  const codeBodyTemplate = (rowData: Application) => (
    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
      {rowData.code}
    </span>
  );

  const labelBodyTemplate = (rowData: Application) => (
    <span>{getLabel(rowData.label, i18n.language)}</span>
  );

  const iconBodyTemplate = (rowData: Application) => (
    <div className="flex items-center gap-2">
      <i className={`text-xl ${rowData.icon}`}></i>
      <span className="text-gray-600 text-sm">{rowData.icon}</span>
    </div>
  );

  const colorBodyTemplate = (rowData: Application) => (
    <div className="flex items-center gap-2">
      <span
        className="w-6 h-6 rounded border"
        style={{ backgroundColor: rowData.color }}
      ></span>
      <span className="text-gray-600 text-sm">{rowData.color}</span>
    </div>
  );

  const dateBodyTemplate = (rowData: Application) => (
    <span className="text-sm text-gray-600">
      {rowData.updated_at ? new Date(rowData.updated_at).toLocaleDateString() : '-'}
    </span>
  );

  return (
    <div className="p-4">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{t('applications.title', 'Applications')}</h1>
          <p className="text-gray-600 mt-1">{t('applications.description', 'Manage system applications and modules')}</p>
        </div>
        <Button
          icon="pi pi-plus"
          label={t('common.add', 'Add')}
          onClick={() => openDialog()}
        />
      </div>

      {/* DataTable */}
      <div className="card">
        <DataTable
          value={applications}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          responsiveLayout="scroll"
          className="p-datatable-striped"
          stripedRows
          emptyMessage={t('common.noData', 'No data found')}
          sortField="code"
          sortOrder={1}
        >
          <Column
            field="code"
            header={t('applications.fields.code', 'Code')}
            sortable
            body={codeBodyTemplate}
            style={{ width: '15%' }}
          />
          <Column
            field="label"
            header={t('applications.fields.label', 'Label')}
            body={labelBodyTemplate}
            sortable={false}
            style={{ width: '25%' }}
          />
          <Column
            field="icon"
            header={t('applications.fields.icon', 'Icon')}
            body={iconBodyTemplate}
            sortable={false}
            style={{ width: '20%' }}
          />
          <Column
            field="color"
            header={t('applications.fields.color', 'Color')}
            body={colorBodyTemplate}
            sortable={false}
            style={{ width: '15%' }}
          />
          <Column
            field="updated_at"
            header={t('common.lastUpdated', 'Last Updated')}
            sortable
            body={dateBodyTemplate}
            style={{ width: '15%' }}
          />
          <Column
            body={actionBodyTemplate}
            header={t('common.actions', 'Actions')}
            style={{ width: '10%' }}
            bodyClassName="text-center"
          />
        </DataTable>
      </div>

      {/* Dialog */}
      <ApplicationDialog
        visible={showDialog}
        isEditing={isEditing}
        formData={formData}
        selectedLang={selectedLang}
        onHide={closeDialog}
        onSave={handleSave}
        onFormDataChange={setFormData}
        onSelectedLangChange={setSelectedLang}
      />
    </div>
  );
};

export default ApplicationsPage;
