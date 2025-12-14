import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

interface ApplicationDialogProps {
  visible: boolean;
  isEditing: boolean;
  formData: {
    code: string;
    label: Record<string, string>;
    color: string;
    icon: string;
  };
  selectedLang: string | null;
  onHide: () => void;
  onSave: () => void;
  onFormDataChange: (data: {
    code: string;
    label: Record<string, string>;
    color: string;
    icon: string;
  }) => void;
  onSelectedLangChange: (lang: string | null) => void;
}

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
];

const iconOptions = [
  { label: 'Lock', value: 'pi pi-lock' },
  { label: 'Globe', value: 'pi pi-globe' },
  { label: 'File Export', value: 'pi pi-file-export' },
  { label: 'File PDF', value: 'pi pi-file-pdf' },
  { label: 'Window Maximize', value: 'pi pi-window-maximize' },
  { label: 'Users', value: 'pi pi-users' },
  { label: 'Shield', value: 'pi pi-shield' },
  { label: 'Sitemap', value: 'pi pi-sitemap' },
];

const ApplicationDialog: React.FC<ApplicationDialogProps> = ({
  visible,
  isEditing,
  formData,
  selectedLang,
  onHide,
  onSave,
  onFormDataChange,
  onSelectedLangChange
}) => {
  const { t } = useTranslation();

  const getLanguageName = (code: string): string => {
    return languageOptions.find(l => l.code === code)?.name || code;
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: '50vw' }}
      header={isEditing ? t('applications.editTitle', 'Edit Application') : t('applications.createTitle', 'Create Application')}
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
            {t('applications.fields.code', 'Code')} *
          </label>
          <InputText
            value={formData.code}
            onChange={(e) => onFormDataChange({ ...formData, code: e.target.value })}
            className="w-full"
            placeholder={t('applications.placeholders.code', 'e.g., admin, website, claims')}
            disabled={isEditing}
          />
        </div>

        {/* Multilingual Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('applications.fields.label', 'Label')} *
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
              placeholder={t('applications.addLanguage', 'Select language to add')}
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
                    placeholder={`${t('applications.labelPlaceholder', 'Enter label')} (${getLanguageName(lang)})`}
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

        {/* Icon Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('applications.fields.icon', 'Icon')}
          </label>
          <Dropdown
            value={formData.icon}
            options={iconOptions}
            onChange={(e) => onFormDataChange({ ...formData, icon: e.value })}
            optionLabel="label"
            optionValue="value"
            placeholder={t('applications.selectIcon', 'Select an icon')}
            className="w-full"
          />
        </div>

        {/* Color Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('applications.fields.color', 'Color')}
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => onFormDataChange({ ...formData, color: e.target.value })}
              className="w-20 h-10 cursor-pointer rounded"
            />
            <InputText
              value={formData.color}
              onChange={(e) => onFormDataChange({ ...formData, color: e.target.value })}
              className="flex-1"
              placeholder="#3B82F6"
            />
            <div
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: formData.color }}
            ></div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ApplicationDialog;
