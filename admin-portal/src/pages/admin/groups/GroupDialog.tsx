import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';

interface Role {
  id: number;
  code: string;
  label: string;
}

interface GroupDialogProps {
  visible: boolean;
  isEditing: boolean;
  formData: {
    code: string;
    label: Record<string, string>;
    roles: number[];
  };
  selectedLang: string | null;
  roles: Role[];
  onHide: () => void;
  onSave: () => void;
  onFormDataChange: (data: { code: string; label: Record<string, string>; roles: number[] }) => void;
  onSelectedLangChange: (lang: string | null) => void;
}

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
];

const GroupDialog: React.FC<GroupDialogProps> = ({
  visible,
  isEditing,
  formData,
  selectedLang,
  roles,
  onHide,
  onSave,
  onFormDataChange,
  onSelectedLangChange
}) => {
  const { t, i18n } = useTranslation();

  const getLanguageName = (code: string): string => {
    return languageOptions.find(l => l.code === code)?.name || code;
  };

  const rolesOptions = roles.map(role => ({
    label: typeof role.label === 'object' ? (role.label[i18n.language] || role.label['en'] || role.code) : role.label,
    value: role.id
  }));

  return (
    <Dialog
      visible={visible}
      style={{ width: '50vw' }}
      header={isEditing ? t('groups.editTitle', 'Edit Group') : t('groups.createTitle', 'Create Group')}
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
        {/* Code Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('groups.fields.code', 'Code')} *
          </label>
          <InputText
            value={formData.code}
            onChange={(e) => onFormDataChange({ ...formData, code: e.target.value })}
            className="w-full"
            placeholder={t('groups.placeholders.code', 'e.g., ADMIN, EDITOR')}
            disabled={isEditing}
          />
        </div>

        {/* Multilingual Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('groups.fields.label', 'Label')} *
          </label>

          {/* Add Language */}
          <div className="flex gap-2 mb-3">
            <Dropdown
              value={selectedLang}
              options={languageOptions.filter(
                lang => !Object.keys(formData.label).includes(lang.code)
              )}
              onChange={(e) => onSelectedLangChange(e.value)}
              optionLabel="name"
              optionValue="code"
              placeholder={t('groups.addLanguage', 'Select language to add')}
              className="flex-1"
            />
            <Button
              icon="pi pi-plus"
              className="p-button-sm"
              onClick={() => {
                if (selectedLang) {
                  onFormDataChange({
                    ...formData,
                    label: { ...formData.label, [selectedLang]: '' }
                  });
                  onSelectedLangChange(null);
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
                      onFormDataChange({
                        ...formData,
                        label: { ...formData.label, [lang]: e.target.value }
                      })
                    }
                    className="w-full"
                    placeholder={`${t('groups.labelPlaceholder', 'Enter label')} (${getLanguageName(lang)})`}
                  />
                </div>
                <Button
                  icon="pi pi-trash"
                  className="p-button-sm p-button-danger"
                  onClick={() => {
                    const newLabel = { ...formData.label };
                    delete newLabel[lang];
                    onFormDataChange({ ...formData, label: newLabel });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Roles Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('groups.fields.roles', 'Roles')}
          </label>
          <MultiSelect
            value={formData.roles}
            options={rolesOptions}
            onChange={(e) => onFormDataChange({ ...formData, roles: e.value })}
            optionLabel="label"
            optionValue="value"
            placeholder={t('groups.selectRoles', 'Select roles')}
            className="w-full"
            display="chip"
            maxSelectedLabels={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('groups.rolesHint', 'Assign roles to this group. Users in this group will have these roles.')}
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default GroupDialog;
