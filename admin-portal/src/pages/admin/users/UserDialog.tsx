import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

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

interface UserFormData {
  firstname: Record<string, string>;
  lastname: Record<string, string>;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  iphone: string;
  birthdate: Date | null;
  birthplace: Record<string, string>;
  nin: string;
  gender: string;
  address: Record<string, { city: string; country: string }>;
  active: boolean;
  groups: number[];
  roles: number[];
  structures: number[];
}

interface UserDialogProps {
  visible: boolean;
  isEditing: boolean;
  formData: UserFormData;
  onHide: () => void;
  onSave: () => void;
  onFormDataChange: (data: UserFormData) => void;
  groups: Group[];
  roles: Role[];
  structures: Structure[];
  toastRef: React.RefObject<Toast | null>;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' }
];

const UserDialog: React.FC<UserDialogProps> = ({
  visible,
  isEditing,
  formData,
  onHide,
  onSave,
  onFormDataChange,
  groups,
  roles,
  structures,
  toastRef
}) => {
  const { t, i18n } = useTranslation();

  const getLabel = (data: any, lang: string): string => {
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data[lang]) return data[lang];
    if (typeof data === 'object' && data['en']) return data['en'];
    return '';
  };

  const getAllSubstructureIds = (structureId: number, allStructures: Structure[]): number[] => {
    const ids: number[] = [structureId];
    const children = allStructures.filter(s => s.id_parent === structureId);
    children.forEach(child => {
      ids.push(...getAllSubstructureIds(child.id, allStructures));
    });
    return ids;
  };

  const handleStructureChange = (e: any) => {
    const selectedIds = e.value || [];
    const previousIds = formData.structures || [];
    const uniqueIds = new Set<number>();

    const newlyAdded = selectedIds.filter((id: number) => !previousIds.includes(id));
    const removed = previousIds.filter((id: number) => !selectedIds.includes(id));

    newlyAdded.forEach((structId: number) => {
      const hasChildren = structures.some(s => s.id_parent === structId);
      if (hasChildren) {
        const substructureIds = getAllSubstructureIds(structId, structures);
        substructureIds.forEach(id => uniqueIds.add(id));
      } else {
        uniqueIds.add(structId);
      }
    });

    selectedIds.forEach((id: number) => {
      if (!newlyAdded.includes(id)) {
        uniqueIds.add(id);
      }
    });

    removed.forEach((removedId: number) => {
      uniqueIds.delete(removedId);
      const childrenToRemove = getAllSubstructureIds(removedId, structures);
      childrenToRemove.forEach(childId => uniqueIds.delete(childId));
    });

    onFormDataChange({ ...formData, structures: Array.from(uniqueIds) });
  };

  const rolesOptions = roles.map(role => ({
    label: getLabel(role.label, i18n.language),
    value: role.id
  }));

  const structuresOptions = structures.map(structure => ({
    label: getLabel(structure.label, i18n.language),
    value: structure.id
  }));

  const groupsOptions = groups.map(group => ({
    label: typeof group.label === 'string' ? group.label : (group.label?.[i18n.language] || group.label?.['en'] || group.code),
    value: group.id
  }));

  return (
    <Dialog
      visible={visible}
      style={{ width: '50vw' }}
      header={isEditing ? t('users.editTitle', 'Edit User') : t('users.createTitle', 'Create User')}
      modal
      onHide={onHide}
      footer={
        <div className="flex gap-2 justify-end">
          <Button
            label={t('common.cancel', 'Cancel')}
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
          <Button
            label={t('common.save', 'Save')}
            icon="pi pi-check"
            onClick={onSave}
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
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.email', 'Email')}</label>
            <InputText
              value={formData.email || ''}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
              className="w-full"
            />
          </div>
        </div>

        {/* Multilingual First Name and Last Name */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {languages.map(lang => (
            <div key={lang.code}>
              <div>
                <label className="block mb-1 font-medium">
                  {t('users.fields.firstName', 'First Name')} ({lang.label})
                </label>
                <InputText
                  value={formData.firstname[lang.code as 'en' | 'fr' | 'ar'] || ''}
                  onChange={(e) =>
                    onFormDataChange({
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
                    onFormDataChange({
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
          ))}
        </div>

        {/* Nin and Gender and birthday */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.nin', 'NIN')}</label>
            <InputText
              value={formData.nin || ''}
              onChange={(e) => onFormDataChange({ ...formData, nin: e.target.value })}
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
              onChange={(e) => onFormDataChange({ ...formData, gender: e.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.birthdate', 'Birthdate')}</label>
            <InputText
              type="date"
              value={formData.birthdate ? formData.birthdate.toISOString().split('T')[0] : ''}
              onChange={(e) => onFormDataChange({ ...formData, birthdate: e.target.value ? new Date(e.target.value) : null })}
              className="w-full"
            />
          </div>
        </div>

        {/* Multilanguage birthplace */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {languages.map(lang => (
            <div key={lang.code}>
              <label className="block mb-1 font-medium">
                {t('users.fields.birthplace', 'Birthplace')} ({lang.label})
              </label>
              <InputText
                value={formData.birthplace[lang.code as 'en' | 'fr' | 'ar'] || ''}
                onChange={(e) =>
                  onFormDataChange({
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
          ))}
        </div>

        {/* Multi Address */}
        {languages.map(lang => {
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
                      onFormDataChange({
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
                      onFormDataChange({
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
        })}

        {/* Password and confirmation */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.password', 'Password')}</label>
            <Password
              value={formData.password || ''}
              onChange={(e) => onFormDataChange({ ...formData, password: e.target.value })}
              feedback={false}
              toggleMask
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.confirmPassword', 'Confirm Password')}</label>
            <Password
              value={formData.confirmPassword || ''}
              onChange={(e) => onFormDataChange({ ...formData, confirmPassword: e.target.value })}
              feedback={false}
              toggleMask
              className="w-full"
            />
          </div>
        </div>

        {/* Phone and iphone */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.phone', 'Phone')}</label>
            <InputText
              value={formData.phone || ''}
              onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.iphone', 'iPhone')}</label>
            <InputText
              value={formData.iphone || ''}
              onChange={(e) => onFormDataChange({ ...formData, iphone: e.target.value })}
              className="w-full"
            />
          </div>
        </div>

        {/* Roles, groups, structures */}
        <div className="grid grid-cols-1 mt-4 gap-4">
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.groups', 'Groups')}</label>
            <MultiSelect
              value={formData.groups || []}
              options={groupsOptions}
              onChange={(e) => onFormDataChange({ ...formData, groups: e.value || [] })}
              className="w-full"
              placeholder={t('users.selectGroups', 'Select Groups')}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t('users.fields.roles', 'Roles')}</label>
            <MultiSelect
              value={formData.roles || []}
              options={rolesOptions}
              onChange={(e) => onFormDataChange({ ...formData, roles: e.value || [] })}
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
  );
};

export default UserDialog;
