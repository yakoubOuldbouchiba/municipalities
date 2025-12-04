import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import axiosClient from '../../api/axiosClient';
import './RolesPage.css';

type Role = {
  id: number;
  code: string;
  label: string | Record<string, string>;
  created_at?: string;
  updated_at?: string;
};

const RolesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toastRef = React.useRef<Toast>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    label: {} as Record<string, string>
  });

  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);

  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ];

  const getLanguageName = (code: string): string => {
    return languageOptions.find(l => l.code === code)?.name || code;
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/roles', { params: { lang: i18n.language } });
      setRoles(res.data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: t('roles.errorFetch', 'Failed to fetch roles'),
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const openDialog = async (role?: Role) => {
    if (role) {
      try {
        setIsEditing(true);
        setEditingRoleId(role.id);
        // Fetch the full role object which includes the complete label object
        const response = await axiosClient.get(`/roles/${role.id}`);
        const fullRole = response.data;
        setFormData({
          code: fullRole.code,
          label: fullRole.label || {}
        });
      } catch (err) {
        console.error('Error loading role:', err);
        toastRef.current?.show({
          severity: 'error',
          summary: t('common.error', 'Error'),
          detail: t('roles.errorLoading', 'Failed to load role'),
          life: 3000
        });
        return;
      }
    } else {
      setIsEditing(false);
      setEditingRoleId(null);
      setFormData({
        code: '',
        label: {}
      });
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setFormData({ code: '', label: {} });
    setSelectedLang(null);
    setEditingRoleId(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Validate
    if (!formData.code.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('roles.codeRequired', 'Code is required'),
        life: 3000
      });
      return;
    }

    if (Object.keys(formData.label).length === 0) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('roles.labelRequired', 'At least one language label is required'),
        life: 3000
      });
      return;
    }

    try {
      const payload = {
        code: formData.code.trim(),
        label: formData.label
      };

      if (isEditing && editingRoleId) {
        await axiosClient.put(`/roles/${editingRoleId}`, payload);
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success', 'Success'),
          detail: t('roles.updateSuccess', 'Role updated successfully'),
          life: 3000
        });
      } else {
        await axiosClient.post('/roles', payload);
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success', 'Success'),
          detail: t('roles.createSuccess', 'Role created successfully'),
          life: 3000
        });
      }

      await fetchRoles();
      closeDialog();
    } catch (err: any) {
      console.error('Error saving role:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: err.response?.data?.message || t('roles.errorSave', 'Failed to save role'),
        life: 3000
      });
    }
  };

  const handleDelete = (role: Role) => {
    confirmDialog({
      message: t('roles.confirmDelete', 'Are you sure you want to delete this role?'),
      header: t('common.confirm', 'Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/roles/${role.id}`);
          toastRef.current?.show({
            severity: 'success',
            summary: t('common.success', 'Success'),
            detail: t('roles.deleteSuccess', 'Role deleted successfully'),
            life: 3000
          });
          await fetchRoles();
        } catch (err: any) {
          console.error('Error deleting role:', err);
          toastRef.current?.show({
            severity: 'error',
            summary: t('common.error', 'Error'),
            detail: err.response?.data?.message || t('roles.errorDelete', 'Failed to delete role'),
            life: 3000
          });
        }
      }
    });
  };

  const actionBodyTemplate = (rowData: Role) => (
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

  const codeBodyTemplate = (rowData: Role) => (
    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
      {rowData.code}
    </span>
  );

  const labelBodyTemplate = (rowData: Role) => {
    let displayLabel = '';
    if (typeof rowData.label === 'string') {
      displayLabel = rowData.label;
    } else if (typeof rowData.label === 'object' && rowData.label) {
      displayLabel = rowData.label[i18n.language] || rowData.label['en'] || Object.values(rowData.label)[0] || '-';
    } else {
      displayLabel = '-';
    }
    return <span>{displayLabel}</span>;
  };

  const dateBodyTemplate = (rowData: Role) => (
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
          <h1 className="text-3xl font-bold text-gray-800">{t('roles.title', 'Roles')}</h1>
          <p className="text-gray-600 mt-1">{t('roles.description', 'Manage system roles and permissions')}</p>
        </div>
        <Button
          icon="pi pi-plus"
          label={t('common.add', 'Add')}
          className="p-button-success"
          onClick={() => openDialog()}
        />
      </div>

      {/* DataTable */}
      <div className="card">
        <DataTable
          value={roles}
          loading={loading}
          paginator
          rows={15}
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
            header={t('roles.fields.code', 'Code')}
            sortable
            body={codeBodyTemplate}
            style={{ width: '20%' }}
          />
          <Column
            field="label"
            header={t('roles.fields.label', 'Label')}
            body={labelBodyTemplate}
            sortable={false}
            style={{ width: '50%' }}
          />
          <Column
            field="updated_at"
            header={t('common.lastUpdated', 'Last Updated')}
            sortable
            body={dateBodyTemplate}
            style={{ width: '20%' }}
          />
          <Column
            body={actionBodyTemplate}
            header={t('common.actions', 'Actions')}
            style={{ width: '20%' }}
            bodyClassName="text-center"
          />
        </DataTable>
      </div>

      {/* Dialog */}
      <Dialog
        visible={showDialog}
        style={{ width: '50vw' }}
        header={isEditing ? t('roles.editTitle', 'Edit Role') : t('roles.createTitle', 'Create Role')}
        modal
        onHide={closeDialog}
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              label={t('common.cancel', 'Cancel')}
              icon="pi pi-times"
              onClick={closeDialog}
              className="p-button-text"
            />
            <Button
              label={t('common.save', 'Save')}
              icon="pi pi-check"
              onClick={handleSave}
              className="p-button-success"
            />
          </div>
        }
      >
        <div className="space-y-4">
          {/* Code Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('roles.fields.code', 'Code')} *
            </label>
            <InputText
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full"
              placeholder={t('roles.placeholders.code', 'e.g., NAV:admin, MODULE:users, ACTION:create')}
              disabled={isEditing}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('roles.codeHint', 'Use format: NAV: (Navigation), MODULE: (Module), or ACTION: (Action)')}
            </p>
          </div>

          {/* Multilingual Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('roles.fields.label', 'Label')} *
            </label>

            {/* Add Language */}
            <div className="flex gap-2 mb-3">
              <Dropdown
                value={selectedLang}
                options={languageOptions.filter(
                  lang => !Object.keys(formData.label).includes(lang.code)
                )}
                onChange={(e) => setSelectedLang(e.value)}
                optionLabel="name"
                optionValue="code"
                placeholder={t('roles.addLanguage', 'Select language to add')}
                className="flex-1"
              />
              <Button
                icon="pi pi-plus"
                className="p-button-sm"
                onClick={() => {
                  if (selectedLang) {
                    setFormData({
                      ...formData,
                      label: { ...formData.label, [selectedLang]: '' }
                    });
                    setSelectedLang(null);
                  }
                }}
                disabled={!selectedLang}
              />
            </div>

            {/* Language Fields */}
            <div className="space-y-3">
              {Object.entries(formData.label).map(([lang, value]) => (
                <div key={lang} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      {getLanguageName(lang)}
                    </label>
                    <InputText
                      value={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          label: { ...formData.label, [lang]: e.target.value }
                        })
                      }
                      className="w-full"
                      placeholder={`${t('roles.labelPlaceholder', 'Enter label')} (${getLanguageName(lang)})`}
                    />
                  </div>
                  <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-danger"
                    onClick={() => {
                      const newLabel = { ...formData.label };
                      delete newLabel[lang];
                      setFormData({ ...formData, label: newLabel });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default RolesPage;
