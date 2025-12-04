import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { MultiSelect } from 'primereact/multiselect';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axiosClient from '../../api/axiosClient';
import './UsersPage.css';
import { Dropdown } from 'primereact/dropdown';

type User = {
  id: number;
  firstname: Record<string, string>;
  lastname: Record<string, string>;
  name: string;
  email: string;
  phone: string;
  iphone: string;
  birthdate: string;
  birthplace: Record<string, string>;
  nin: string;
  gender: string;
  address: Record<string, any>;
  active: boolean;
  photo?: string;
  groups?: Array<{ id: number; code: string }>;
  roles?: Array<{ id: number; code: string }>;
  structures?: Array<{ id: number; code: string }>;
  created_at?: string;
  updated_at?: string;
};

type Group = {
  id: number;
  code: string;
  label: string | Record<string, string>;
};

type Role = {
  id: number;
  code: string;
  label: string | Record<string, string>;
};

type Structure = {
  id: number;
  code: string;
  label: string | Record<string, string>;
  id_parent?: number | null;
};

const UsersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toastRef = React.useRef<Toast>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    firstname: { en: '', fr: '', ar: '' },
    lastname: { en: '', fr: '', ar: '' },
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    iphone: '',
    birthdate: null as Date | null,
    birthplace: { en: '', fr: '', ar: '' },
    nin: '',
    gender: '',
    address: { en: { city: '', country: '' }, fr: { city: '', country: '' }, ar: { city: '', country: '' } },
    active: true,
    groups: [] as number[],
    roles: [] as number[],
    structures: [] as number[]
  });


  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/users', {
        params: {
          lang: i18n.language,
          search: searchValue
        }
      });
      setUsers(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: t('users.errorFetch', 'Failed to fetch users'),
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch groups
  const fetchMetadata = async () => {
    try {
      const [groupsRes, rolesRes, structuresRes] = await Promise.all([
        axiosClient.get('/groups', { params: { lang: i18n.language } }),
        axiosClient.get('/roles', { params: { lang: i18n.language } }),
        axiosClient.get('/structures', { params: { lang: i18n.language } })
      ]);
      setGroups(groupsRes.data.data || groupsRes.data || []);
      setRoles(rolesRes.data.data || rolesRes.data || []);
      const structuresData = structuresRes.data.data || structuresRes.data || [];
      console.log('Structures data received:', structuresData);
      setStructures(structuresData);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const openDialog = async (user?: User) => {
    if (user) {
      try {
        setIsEditing(true);
        setEditingUserId(user.id);
        // Fetch the full user object
        const response = await axiosClient.get(`/users/${user.id}`);
        const fullUser = response.data;
        setFormData({
          firstname: fullUser.firstname,
          lastname: fullUser.lastname,
          phone: fullUser.phone,
          iphone: fullUser.iphone,
          birthdate: fullUser.birthdate ? new Date(fullUser.birthdate) : null,
          birthplace: fullUser.birthplace,
          nin: fullUser.nin,
          gender: fullUser.gender,
          address: fullUser.address,
          active: fullUser.active,
          name: fullUser.name,
          email: fullUser.email,
          password: '',
          confirmPassword: '',
          groups: fullUser.groups?.map((g: any) => g.id) || [],
          roles: fullUser.roles?.map((r: any) => r.id) || [],
          structures: fullUser.structures?.map((s: any) => s.id) || []
        });
      } catch (err) {
        console.error('Error loading user:', err);
        toastRef.current?.show({
          severity: 'error',
          summary: t('common.error', 'Error'),
          detail: t('users.errorLoading', 'Failed to load user'),
          life: 3000
        });
        return;
      }
    } else {
      setIsEditing(false);
      setEditingUserId(null);
      setFormData({
        firstname: { en: '', fr: '', ar: '' },
        lastname: { en: '', fr: '', ar: '' },
        birthdate: null,
        birthplace: { en: '', fr: '', ar: '' },
        nin: '',
        gender: '',
        address: { en: { city: '', country: '' }, fr: { city: '', country: '' }, ar: { city: '', country: '' } },
        active: true,
        phone: '',
        iphone: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        groups: [],
        roles: [],
        structures: []
      });
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setFormData({
      firstname: { en: '', fr: '', ar: '' },
      lastname: { en: '', fr: '', ar: '' },
      birthdate: null,
      birthplace: { en: '', fr: '', ar: '' },
      nin: '',
      gender: '',
      address: { en: { city: '', country: '' }, fr: { city: '', country: '' }, ar: { city: '', country: '' } },
      active: true,
      phone: '',
      iphone: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      groups: [],
      roles: [],
      structures: []
    });
    setEditingUserId(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Validate
    if (!formData.name.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('users.nameRequired', 'Name is required'),
        life: 3000
      });
      return;
    }

    if (!formData.email.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('users.emailRequired', 'Email is required'),
        life: 3000
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('users.invalidEmail', 'Invalid email format'),
        life: 3000
      });
      return;
    }

    if (!isEditing && !formData.password.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('users.passwordRequired', 'Password is required'),
        life: 3000
      });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.validation', 'Validation'),
        detail: t('users.passwordMismatch', 'Passwords do not match'),
        life: 3000
      });
      return;
    }

    try {
      const payload: any = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: typeof formData.phone === 'string' ? formData.phone.trim() : formData.phone,
        iphone: typeof formData.iphone === 'string' ? formData.iphone.trim() : formData.iphone,
        birthdate: formData.birthdate ? formData.birthdate.toISOString().split('T')[0] : null,
        birthplace: formData.birthplace,
        nin: formData.nin.trim(),
        gender: formData.gender,
        address: formData.address, // Send as object (will be JSON stringified by axios)
        active: formData.active,
        name: formData.name.trim(),
        email: formData.email.trim(),
        groups: formData.groups,
        roles: formData.roles,
        structures: formData.structures
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.confirmPassword;
      }

      if (isEditing && editingUserId) {
        await axiosClient.put(`/users/${editingUserId}`, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success', 'Success'),
          detail: t('users.updateSuccess', 'User updated successfully'),
          life: 3000
        });
      } else {
        await axiosClient.post('/users', payload, {
          headers: { 'Content-Type': 'application/json' }
        });
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success', 'Success'),
          detail: t('users.createSuccess', 'User created successfully'),
          life: 3000
        });
      }

      await fetchUsers();
      closeDialog();
    } catch (err: any) {
      console.error('Error saving user:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error', 'Error'),
        detail: err.response?.data?.message || t('users.errorSave', 'Failed to save user'),
        life: 3000
      });
    }
  };

  const handleDelete = (user: User) => {
    confirmDialog({
      message: t('users.confirmDelete', 'Are you sure you want to delete this user?'),
      header: t('common.confirm', 'Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/users/${user.id}`);
          toastRef.current?.show({
            severity: 'success',
            summary: t('common.success', 'Success'),
            detail: t('users.deleteSuccess', 'User deleted successfully'),
            life: 3000
          });
          await fetchUsers();
        } catch (err: any) {
          console.error('Error deleting user:', err);
          toastRef.current?.show({
            severity: 'error',
            summary: t('common.error', 'Error'),
            detail: err.response?.data?.message || t('users.errorDelete', 'Failed to delete user'),
            life: 3000
          });
        }
      }
    });
  };

  const actionBodyTemplate = (rowData: User) => (
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

  const emailBodyTemplate = (rowData: User) => (
    <span className="text-blue-600 underline">{rowData.email}</span>
  );

  const activeBodyTemplate = (rowData: User) => (
    <span className={rowData.active ? 'text-green-600' : 'text-red-600'}>
      {rowData.active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
    </span>
  );

  const groupsBodyTemplate = (rowData: User) => {
    const groupCodes = rowData.groups?.map(g => g.code) || [];
    const displayCodes = groupCodes.slice(0, 3);
    const remainingCount = groupCodes.length - 3;
    return (
      <div className="flex flex-wrap gap-1">
        {displayCodes.map(code => (
          <span key={code} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {code}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium">
            +{remainingCount} more
          </span>
        )}
        {groupCodes.length === 0 && <span className="text-gray-400 text-sm">-</span>}
      </div>
    );
  };

  const rolesBodyTemplate = (rowData: User) => {
    const roleCodes = rowData.roles?.map(r => r.code) || [];
    const displayCodes = roleCodes.slice(0, 3);
    const remainingCount = roleCodes.length - 3;
    return (
      <div className="flex flex-wrap gap-1">
        {displayCodes.map(code => (
          <span key={code} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {code}
          </span>

        ))}
        {remainingCount > 0 && (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium">
            +{remainingCount} more
          </span>
        )}
        {roleCodes.length === 0 && <span className="text-gray-400 text-sm">-</span>}
      </div>
    );
  };

  const structuresBodyTemplate = (rowData: User) => {
    const structCodes = rowData.structures?.map(s => s.code) || [];
    const displayCodes = structCodes.slice(0, 3);
    const remainingCount = structCodes.length - 3;
    return (
      <div className="flex flex-wrap gap-1">
        {displayCodes.map(code => (
          <span key={code} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {code}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium">
            +{remainingCount} more
          </span>
        )}
        {structCodes.length === 0 && <span className="text-gray-400 text-sm">-</span>}
      </div>
    );
  };


  const getLabel = (data: any, lang: string): string => {
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data[lang]) return data[lang];
    if (typeof data === 'object' && data['en']) return data['en'];
    return '';
  };

  const rolesOptions = roles.map(role => ({
    label: getLabel(role.label, i18n.language),
    value: role.id
  }));


  // Helper function to get all substructure IDs recursively
  const getAllSubstructureIds = (structureId: number, allStructures: Structure[]): number[] => {
    const ids: number[] = [structureId];
    const children = allStructures.filter(s => s.id_parent === structureId);
    console.log(`Finding children for structure ${structureId}, found:`, children);
    
    children.forEach(child => {
      ids.push(...getAllSubstructureIds(child.id, allStructures));
    });
    
    return ids;
  };

  // Handle structure selection with automatic substructure selection
  const handleStructureChange = (e: any) => {
    const selectedIds = e.value || [];
    const previousIds = formData.structures || [];
    const uniqueIds = new Set<number>();

    // Find newly added items (selected now but not before)
    const newlyAdded = selectedIds.filter((id: number) => !previousIds.includes(id));
    // Find removed items (were selected but not anymore)
    const removed = previousIds.filter((id: number) => !selectedIds.includes(id));

    // Start with newly added items
    newlyAdded.forEach((structId: number) => {
      const hasChildren = structures.some(s => s.id_parent === structId);
      
      if (hasChildren) {
        // If it has children, select all its substructures
        const substructureIds = getAllSubstructureIds(structId, structures);
        substructureIds.forEach(id => uniqueIds.add(id));
      } else {
        // If it's a leaf node (no children), just add it
        uniqueIds.add(structId);
      }
    });

    // Add remaining selected items that weren't added
    selectedIds.forEach((id: number) => {
      if (!newlyAdded.includes(id)) {
        uniqueIds.add(id);
      }
    });

    // Remove the removed items and their children from selection
    removed.forEach((removedId: number) => {
      uniqueIds.delete(removedId);
      // Also remove all children of removed parents
      const childrenToRemove = getAllSubstructureIds(removedId, structures);
      childrenToRemove.forEach(childId => uniqueIds.delete(childId));
    });

    console.log('Selected structures:', Array.from(uniqueIds));
    setFormData({ ...formData, structures: Array.from(uniqueIds) });
  };

  const structuresOptions = structures.map(structure => ({
    label: getLabel(structure.label, i18n.language),
    value: structure.id
  }));


  const groupsOptions = groups.map(group => ({
    label: typeof group.label === 'string' ? group.label : (group.label?.[i18n.language] || group.label?.['en'] || group.code),
    value: group.id
  }));

  const languages = [{
    code: 'en', label: 'English'
  }, {
    code: 'fr', label: 'Français'
  }, {
    code: 'ar', label: 'العربية'
  }];

  return (
    <div className="p-4">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{t('users.title', 'Users')}</h1>
          <p className="text-gray-600 mt-1">{t('users.description', 'Manage system users and their group assignments')}</p>
        </div>
        <div>
          <div className="mb-4 flex justify-between items-center">
            <Button
              icon="pi pi-plus"
              label={t('common.add', 'Add')}
              className="p-button-success"
              onClick={() => openDialog()} />
          </div>
          <div>
            <InputText
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  fetchUsers();
                }
              }}
              placeholder={t('users.searchPlaceholder', 'Search users...')}
              className="w-full"
            />
          </div>
        </div>


      </div>

      {/* DataTable */}
      <div className="card">
        <DataTable
          value={users}
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
            field="name"
            header={t('users.fields.name', 'Name')}
            sortable
            style={{ width: '20%' }}
          />
          <Column
            field="firstname"
            header={t('users.fields.firstName', 'First Name')}
            body={(rowData) => getLabel(rowData.firstname, i18n.language)}
            sortable
            style={{ width: '15%' }}
          />
          <Column
            field="lastname"
            header={t('users.fields.lastName', 'Last Name')}
            body={(rowData) => getLabel(rowData.lastname, i18n.language)}
            sortable
            style={{ width: '15%' }}
          />
          <Column
            field="email"
            header={t('users.fields.email', 'Email')}
            sortable
            body={emailBodyTemplate}
            style={{ width: '25%' }}
          />
          <Column
            field="active"
            header={t('users.fields.status', 'Status')}
            body={activeBodyTemplate}
            sortable
            style={{ width: '10%' }}
          />
          <Column
            field="groups"
            header={t('users.fields.groups', 'Groups')}
            body={groupsBodyTemplate}
            style={{ width: '30%' }}
          />
          <Column
            field="roles"
            header={t('users.fields.roles', 'Roles')}
            body={rolesBodyTemplate}
            style={{ width: '30%' }}
          />
          <Column
            field="structures"
            header={t('users.fields.structures', 'Structures')}
            body={structuresBodyTemplate}
            style={{ width: '30%' }}
          />
          <Column
            body={actionBodyTemplate}
            header={t('common.actions', 'Actions')}
            style={{ width: '15%' }}
            bodyClassName="text-center"
          />

        </DataTable>
      </div>

      {/* Dialog */}
      <Dialog
        visible={showDialog}
        style={{ width: '50vw' }}
        header={isEditing ? t('users.editTitle', 'Edit User') : t('users.createTitle', 'Create User')}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.name', 'Name')}</label>
              <InputText
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.email', 'Email')}</label>
              <InputText
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          {/* Multilingual First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {
              languages.map(lang => (
                <div key={lang.code}>
                  <div>
                    <label className="block mb-1 font-medium">
                      {t('users.fields.firstName', 'First Name')} ({lang.label})
                    </label>
                    <InputText
                      value={formData.firstname[lang.code as 'en' | 'fr' | 'ar'] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstname: {
                            ...formData.firstname,
                            [lang.code]: e.target.value
                          }
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-1 font-medium">
                      {t('users.fields.lastName', 'Last Name')} ({lang.label})
                    </label>
                    <InputText
                      value={formData.lastname[lang.code as 'en' | 'fr' | 'ar'] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastname: {
                            ...formData.lastname,
                            [lang.code]: e.target.value
                          }
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              ))
            }

          </div>

          {/* Nin and Gender and birthday */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.nin', 'NIN')}</label>
              <InputText
                value={formData.nin || ''}
                onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.gender', 'Gender')}</label>
              <Dropdown
                value={formData.gender}
                options={[
                  { label: t('users.gender.male', 'Male'), value: 'male' },
                  { label: t('users.gender.female', 'Female'), value: 'female' }
                ]}
                onChange={(e) => setFormData({ ...formData, gender: e.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.birthdate', 'Birthdate')}</label>
              <InputText
                type="date"
                value={formData.birthdate ? formData.birthdate.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value ? new Date(e.target.value) : null })}
                className="w-full"
              />
            </div>
          </div>
          {/** multilanguage birthplace */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {
              languages.map(lang => (
                <div key={lang.code}>
                  <label className="block mb-1 font-medium">
                    {t('users.fields.birthplace', 'Birthplace')} ({lang.label})
                  </label>
                  <InputText
                    value={formData.birthplace[lang.code as 'en' | 'fr' | 'ar'] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        birthplace: {
                          ...formData.birthplace,
                          [lang.code]: e.target.value
                        }
                      })
                    }
                    className="w-full"
                  />
                </div>
              ))
            }
          </div>
          {/** Mutli Address */}
          {
            languages.map(lang => {
              const langCode = lang.code as 'en' | 'fr' | 'ar';
              const addressData = formData.address[langCode] || { city: '', country: '' };
              return (
                <div key={lang.code} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {t('users.fields.address', 'Address')} ({lang.label})
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">{t('users.fields.city', 'City')}</label>
                      <InputText
                        value={addressData.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              [lang.code]: {
                                ...addressData,
                                city: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">{t('users.fields.country', 'Country')}</label>
                      <InputText
                        value={addressData.country}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              [lang.code]: {
                                ...addressData,
                                country: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          }

          {/** password  and confirmation */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.password', 'Password')}</label>
              <Password
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                feedback={false}
                toggleMask
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.confirmPassword', 'Confirm Password')}</label>
              <Password
                value={formData.confirmPassword || ''}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                feedback={false}
                toggleMask
                className="w-full"
              />
            </div>
          </div>



          {/* phonee and iphone */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.phone', 'Phone')}</label>
              <InputText
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.iphone', 'iPhone')}</label>
              <InputText
                value={formData.iphone || ''}
                onChange={(e) => setFormData({ ...formData, iphone: e.target.value })}
                className="w-full"
              />
            </div>
          </div>



          {/* Additional form fields  roles, groups, etc. would go here */}
          <div className="grid grid-cols-1 mt-4 gap-4">  
            <div> 
              <label className="block mb-1 font-medium">{t('users.fields.groups', 'Groups')}</label>
              <MultiSelect
                value={formData.groups || []}
                options={groupsOptions}
                onChange={(e) => setFormData({ ...formData, groups: e.value || [] })}
                className="w-full"
                placeholder={t('users.selectGroups', 'Select Groups')}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.roles', 'Roles')}</label>
              <MultiSelect
                value={formData.roles || []}
                options={rolesOptions}
                onChange={(e) => setFormData({ ...formData, roles: e.value || [] })}
                className="w-full"
                placeholder={t('users.selectRoles', 'Select Roles')}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t('users.fields.structures', 'Structures')}</label>
              <MultiSelect
                value={formData.structures || []}
                options={structuresOptions}
                onChange={handleStructureChange}
                className="w-full"
                placeholder={t('users.selectStructures', 'Select Structures')}
              />
            </div>
          </div>


        </div>
      </Dialog>
    </div>
  );
};

export default UsersPage;
