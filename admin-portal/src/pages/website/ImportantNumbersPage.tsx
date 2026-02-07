import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import axiosClient from '../../api/axiosClient';
import ArabicKeyboard from '../../components/ArabicKeyboard';

type ImportantNumber = {
  id: string;
  label: string; // localized label when listing
  value: string;
  hidden?: boolean;
};

const ImportantNumbersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useRef<any>(null);
  const [items, setItems] = useState<ImportantNumber[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [value, setValue] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeKeyboardField, setActiveKeyboardField] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/important-numbers', { params: { lang: i18n.language || 'en', include_hidden: true } });
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching important numbers:', err);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setLabels({});
    setValue('');
    setEditingId(null);
    setDialogVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const payload = {
      label: labels,
      value: value.trim(),
    };

    try {
      if (editingId) {
        await axiosClient.put(`/important-numbers/${editingId}`, payload);
      } else {
        await axiosClient.post('/important-numbers', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      console.error('Error saving important number:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/important-numbers/${id}`);
      const data = res.data;
      const labelsObj = data.label || {};
      setLabels(labelsObj);
      setValue(data.value || '');
      setEditingId(id);
      setDialogVisible(true);
    } catch (err) {
      console.error('Error loading important number:', err);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('importantNumbers.confirmDelete', 'Delete this important number?'),
      header: t('importantNumbers.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/important-numbers/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          console.error('Error deleting important number:', err);
        }
      }
    });
  };

  const toggleHidden = async (id: string) => {
    try {
      await axiosClient.put(`/important-numbers/${id}/toggle-hidden`);
      await fetchList();
      toast.current?.show({ severity: 'success', summary: t('importantNumbers.success', 'Success'), detail: t('importantNumbers.toggleSuccess', 'Important number visibility updated'), life: 3000 });
    } catch (err) {
      console.error('Error toggling hidden status:', err);
      toast.current?.show({ severity: 'error', summary: t('importantNumbers.error', 'Error'), detail: t('importantNumbers.toggleError', 'Failed to update important number visibility'), life: 3000 });
    }
  };

  const actionBodyTemplate = (rowData: ImportantNumber) => (
    <div className="flex gap-2">
      <Button icon={rowData.hidden ? "pi pi-eye" : "pi pi-eye-slash"} className="p-button-sm p-button-warning" onClick={() => toggleHidden(rowData.id)} aria-label={rowData.hidden ? "Show" : "Hide"} />
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  const getLabel = (data: any, lang: string): string => {
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data[lang]) return data[lang];
    if (typeof data === 'object' && data['en']) return data['en'];
    return '';
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t('importantNumbers.title', 'Important Numbers')}</h1>
        <Button 
          label={t('importantNumbers.actions.addNew', 'Add Number')} 
          icon="pi pi-plus" 
          onClick={() => {
            resetForm();
            setDialogVisible(true);
          }} 
        />
      </div>

      <Dialog
        header={editingId ? t('importantNumbers.dialog.editTitle', 'Edit Important Number') : t('importantNumbers.dialog.addTitle', 'Add Important Number')}
        visible={dialogVisible}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        onHide={() => setDialogVisible(false)}
        modal
      >
        <form onSubmit={handleSubmit} className="space-y-2">
        {/* Language add controls */}
        <div className="flex gap-2 items-center">
          {(() => {
            const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
            const existing = Array.from(new Set([...(configuredLangs || []), ...Object.keys(labels)]));
            const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
            const allCandidates = Object.entries(langNames).map(([code, name]) => ({ code, name }));
            const options = allCandidates.filter((o) => !existing.includes(o.code));
            return (
              <>
                <Dropdown value={selectedLang} options={options} onChange={(e) => setSelectedLang(e.value)} optionLabel="name" optionValue="code" placeholder={t('importantNumbers.addLangPlaceholder', 'Select language')} />
                <Button icon="pi pi-plus" className="p-button-sm" onClick={() => {
                  const code = (selectedLang || '').trim().toLowerCase();
                  if (!code) return;
                  const rendered = Array.from(new Set([...(configuredLangs || []), ...Object.keys(labels)]));
                  if (rendered.includes(code)) {
                    setSelectedLang(null);
                    return;
                  }
                  setLabels((prev) => ({ ...prev, [code]: '' }));
                  setSelectedLang(null);
                }} aria-label="Add language" />
              </>
            );
          })()}
        </div>

        {/* Render one input per configured language plus any added languages */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(labels)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.map((lng) => (
            <div key={lng} className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">{langNames[lng] ?? lng.toUpperCase()}</label>
                <InputText
                  value={labels[lng] || ''}
                  onChange={(e) => setLabels((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))}
                  onFocus={() => lng === 'ar' && setActiveKeyboardField(`label-${lng}`)}
                  className="w-full p-inputtext-sm"
                  placeholder={t(`importantNumbers.placeholders.label_${lng}`, `Label (${lng})`)}
                />
                {lng === 'ar' && activeKeyboardField === `label-${lng}` && (
                  <ArabicKeyboard
                    onInput={(char: string) => setLabels((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                    onBackspace={() => setLabels((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                  />
                )}
              </div>
              {/* allow removing only languages that are not part of configured i18n resources */}
              <div>
                <Button icon="pi pi-times" className="p-button-text p-button-danger" onClick={() => {
                  if (configuredLangs.includes(lng)) return; // don't remove configured languages
                  setLabels((prev) => {
                    const next = { ...prev };
                    delete next[lng];
                    return next;
                  });
                }} aria-label={`Remove ${lng}`} disabled={configuredLangs.includes(lng)} />
              </div>
            </div>
          ));
        })()}

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('importantNumbers.fields.value', 'Value')}</label>
          <InputText value={value} onChange={(e) => setValue((e.target as HTMLInputElement).value)} className="w-full p-inputtext-sm" placeholder={t('importantNumbers.placeholders.value', 'e.g., +1234567890')} />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" label={editingId ? t('importantNumbers.actions.update', 'Update') : t('importantNumbers.actions.add', 'Add')} icon="pi pi-check" />
          <Button type="button" label={t('importantNumbers.actions.cancel', 'Cancel')} className="p-button-outlined" onClick={() => setDialogVisible(false)} />
        </div>
      </form>
      </Dialog>

      <div>
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">{t('importantNumbers.empty', 'No important numbers yet')}</div>
        ) : (
          <DataTable value={items} responsiveLayout="scroll">
            <Column field="label" header={t('importantNumbers.table.label', 'Label')} body={(rowData) => getLabel(rowData.label, i18n.language)} />
            <Column field="value" header={t('importantNumbers.table.value', 'Value')} />
            <Column header={t('importantNumbers.table.hidden', 'Status')} body={(rowData) => (rowData.hidden ? <span className="text-red-600 font-semibold">Hidden</span> : <span className="text-green-600 font-semibold">Visible</span>)} style={{ width: '100px' }} />
            <Column header={t('importantNumbers.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '200px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default ImportantNumbersPage;
