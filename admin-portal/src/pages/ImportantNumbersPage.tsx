import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import axiosClient from '../api/axiosClient';

type ImportantNumber = {
  id: string;
  label: string;
  value: string;
};

const ImportantNumbersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<ImportantNumber[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [value, setValue] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/important-numbers', { params: { lang: i18n.language || 'en' } });
      setItems(res.data || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setLabels({});
    setValue('');
    setSelectedLang(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
    const primary = configuredLangs[0] || 'en';
    if (!((labels[primary] || '').trim()) || !value.trim()) return;

    const payload = {
      label: Object.fromEntries(Object.entries(labels).map(([k, v]) => [k, v.trim()])),
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
      // ignore
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/important-numbers/${id}`);
      const data = res.data;
      setLabels(data.label || {});
      setValue(data.value || '');
      setEditingId(id);
    } catch (err) {
      // ignore
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('importantNumbers.confirmDelete', 'Delete this number?'),
      header: t('importantNumbers.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/important-numbers/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          // ignore
        }
      }
    });
  };

  const actionBody = (rowData: ImportantNumber) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} />
    </div>
  );

  return (
    <div className="p-4">
      <ConfirmDialog />
      <h1 className="text-2xl font-semibold mb-4">{t('importantNumbers.title', 'Important Numbers')}</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-lg">
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
                  if (rendered.includes(code)) { setSelectedLang(null); return; }
                  setLabels((prev) => ({ ...prev, [code]: '' }));
                  setSelectedLang(null);
                }} />
              </>
            );
          })()}
        </div>

        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(labels)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.map((lng) => (
            <div key={lng} className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">{langNames[lng] ?? lng.toUpperCase()}</label>
                <InputText value={labels[lng] || ''} onChange={(e) => setLabels((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))} className="w-full p-inputtext-sm" placeholder={t(`importantNumbers.placeholders.title_${lng}`, `Title (${lng})`)} />
              </div>
              <div>
                <Button icon="pi pi-times" className="p-button-text p-button-danger" onClick={() => {
                  if (configuredLangs.includes(lng)) return;
                  setLabels((prev) => { const next = { ...prev }; delete next[lng]; return next; });
                }} disabled={configuredLangs.includes(lng)} />
              </div>
            </div>
          ));
        })()}

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('importantNumbers.fields.value', 'Value')}</label>
          <InputText value={value} onChange={(e) => setValue((e.target as HTMLInputElement).value)} className="w-full p-inputtext-sm" placeholder={t('importantNumbers.placeholders.value', 'E.g. +213 21 00 00')} />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" label={editingId ? t('importantNumbers.actions.update', 'Update') : t('importantNumbers.actions.add', 'Add')} icon="pi pi-check" />
          <Button type="button" label={t('importantNumbers.actions.clear', 'Clear')} className="p-button-outlined" onClick={resetForm} />
        </div>
      </form>

      <div>
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">{t('importantNumbers.empty', 'No important numbers yet')}</div>
        ) : (
          <DataTable value={items} responsiveLayout="scroll">
            <Column field="label" header={t('importantNumbers.table.title', 'Title')} />
            <Column field="value" header={t('importantNumbers.table.value', 'Value')} />
            <Column header={t('importantNumbers.table.actions', 'Actions')} body={actionBody} style={{ width: '150px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default ImportantNumbersPage;
