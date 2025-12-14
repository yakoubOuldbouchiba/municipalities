import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axiosClient from '../../../api/axiosClient';
import './GroupsPage.css';
import GroupDialog from './GroupDialog';

type Group = {
  id: number;
  code: string;
  label: Record<string, string>;
  roles: Array<{ id: number; code: string; label: string | Record<string, string> }>;
  created_at?: string;
  updated_at?: string;
};

type Role = {
  id: number;
  code: string;
  label: string;
};

const GroupsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toastRef = React.useRef<Toast>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    label: {} as Record<string, string>,
    roles: [] as number[]
  });

  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/groups', { params: { lang: i18n.language } });
      setGroups(res.data || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: t('groups.errorFetch', 'Failed to fetch groups'),
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await axiosClient.get('/roles', { params: { lang: i18n.language } });
      setRoles(res.data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const openDialog = async (group?: Group) => {
    if (group) {
      try {
        setIsEditing(true);
        setEditingGroupId(group.id);
        // Fetch the full group object which includes the complete label object
        const response = await axiosClient.get(`/groups/${group.id}`);
        const fullGroup = response.data;
        setFormData({
          code: fullGroup.code,
          label: fullGroup.label || {},
          roles: fullGroup.roles?.map((r: any) => r.id) || []
        });
      } catch (err) {
        console.error('Error loading group:', err);
        toastRef.current?.show({
          severity: 'error',
          summary: t('common.error', 'Error'),
          detail: t('groups.errorLoading', 'Failed to load group'),
          life: 3000
        });
        return;
      }
    } else {
      setIsEditing(false);
      setEditingGroupId(null);
      setFormData({
        code: '',
        label: {},
        roles: []
      });
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setFormData({ code: '', label: {}, roles: [] });
    setSelectedLang(null);
    setEditingGroupId(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Validate
    if (!formData.code.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('groups.codeRequired', 'Code is required'),
        life: 3000
      });
      return;
    }

    if (Object.keys(formData.label).length === 0) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('groups.labelRequired', 'At least one language label is required'),
        life: 3000
      });
      return;
    }

    try {
      const payload = {
        code: formData.code.trim(),
        label: formData.label,
        roles: formData.roles
      };

      if (isEditing && editingGroupId) {
        await axiosClient.put(`/groups/${editingGroupId}`, payload);
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success', 'Success'),
          detail: t('groups.updateSuccess', 'Group updated successfully'),
          life: 3000
        });
      } else {
        await axiosClient.post('/groups', payload);
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success', 'Success'),
          detail: t('groups.createSuccess', 'Group created successfully'),
          life: 3000
        });
      }

      await fetchGroups();
      closeDialog();
    } catch (err: any) {
      console.error('Error saving group:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: err.response?.data?.message || t('groups.errorSave', 'Failed to save group'),
        life: 3000
      });
    }
  };

  const handleDelete = (group: Group) => {
    confirmDialog({
      message: t('groups.confirmDelete', 'Are you sure you want to delete this group?'),
      header: t('common.confirm', 'Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/groups/${group.id}`);
          toastRef.current?.show({
            severity: 'success',
            summary: t('common.success', 'Success'),
            detail: t('groups.deleteSuccess', 'Group deleted successfully'),
            life: 3000
          });
          await fetchGroups();
        } catch (err: any) {
          console.error('Error deleting group:', err);
          toastRef.current?.show({
            severity: 'error',
            summary: t('common.error', 'Error'),
            detail: err.response?.data?.message || t('groups.errorDelete', 'Failed to delete group'),
            life: 3000
          });
        }
      }
    });
  };

  const actionBodyTemplate = (rowData: Group) => (
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

  const codeBodyTemplate = (rowData: Group) => (
    <span className="font-semibold text-blue-600">{rowData.code}</span>
  );

  const rolesBodyTemplate = (rowData: Group) => (
    <div className="flex flex-wrap gap-2">
      {rowData.roles?.slice(0, 3).map(role => (
        <span key={role.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {typeof role.label === 'object' ? role.label[i18n.language] || role.label['en'] : role.label}
        </span>
      ))}
      {rowData.roles && rowData.roles.length > 3 && (
        <span className="text-gray-500 text-xs px-2 py-1">
          +{rowData.roles.length - 3}
        </span>
      )}
    </div>
  );

  const dateBodyTemplate = (rowData: Group) => (
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
          <h1 className="text-3xl font-bold text-gray-800">{t('groups.title', 'Groups')}</h1>
          <p className="text-gray-600 mt-1">{t('groups.description', 'Manage user groups and their role assignments')}</p>
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
          value={groups}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          responsiveLayout="scroll"
          className="p-datatable-striped"
          stripedRows
          emptyMessage={t('common.noData', 'No data found')}
        >
          <Column
            field="code"
            header={t('groups.fields.code', 'Code')}
            sortable
            body={codeBodyTemplate}
            style={{ width: '15%' }}
          />
          <Column
            field="label"
            header={t('groups.fields.label', 'Label')}
            body={(rowData) => {
              if (typeof rowData.label === 'string') {
                return rowData.label || '-';
              } else if (typeof rowData.label === 'object' && rowData.label) {
                return rowData.label[i18n.language] || rowData.label['en'] || Object.values(rowData.label)[0] || '-';
              }
              return '-';
            }}
            style={{ width: '25%' }}
          />
          <Column
            field="roles"
            header={t('groups.fields.roles', 'Roles')}
            body={rolesBodyTemplate}
            style={{ width: '35%' }}
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
      <GroupDialog
        visible={showDialog}
        isEditing={isEditing}
        formData={formData}
        selectedLang={selectedLang}
        roles={roles}
        onHide={closeDialog}
        onSave={handleSave}
        onFormDataChange={setFormData}
        onSelectedLangChange={setSelectedLang}
      />
    </div>
  );
};

export default GroupsPage;
