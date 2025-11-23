import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import axiosClient from '../api/axiosClient';

type QuickLink = {
  id: string;
  label: string; // localized label when listing (index returns a string for requested lang)
  url: string;
};

const STORAGE_KEY = 'quick_links';

const QuickLinksPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [url, setUrl] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/quick-links', { params: { lang: i18n.language || 'en' } });
      setLinks(res.data || []);
    } catch (err) {
      // ignore/network errors for now
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setLabels({});
    setUrl('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // require at least english label or the first configured language
    const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
    const primary = configuredLangs[0] || 'en';
    if (!((labels[primary] || '').trim()) || !url.trim()) return;

    const payload = {
      label: Object.fromEntries(Object.entries(labels).map(([k, v]) => [k, v.trim()])),
      url: url.trim(),
    };

    try {
      if (editingId) {
        await axiosClient.put(`/quick-links/${editingId}`, payload);
      } else {
        await axiosClient.post('/quick-links', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      // handle error (validation/auth) as needed
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/quick-links/${id}`);
      const data = res.data;
      const labelsObj = data.label || {};
      setLabels(labelsObj);
      setUrl(data.url || '');
      setEditingId(id);
    } catch (err) {
      // ignore
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('quickLinks.confirmDelete', 'Delete this quick link?'),
      header: t('quickLinks.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/quick-links/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          // ignore
        }
      }
    });
  };

  const actionBodyTemplate = (rowData: QuickLink) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  const urlBodyTemplate = (rowData: QuickLink) => (
    <a href={rowData.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
      {rowData.url}
    </a>
  );

  return (
    <div className="p-4">
      <ConfirmDialog />
      <h1 className="text-2xl font-semibold mb-4">{t('quickLinks.title', 'Quick Links')}</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-lg">
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
                <Dropdown value={selectedLang} options={options} onChange={(e) => setSelectedLang(e.value)} optionLabel="name" optionValue="code" placeholder={t('quickLinks.addLangPlaceholder', 'Select language')} />
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
                  className="w-full p-inputtext-sm"
                  placeholder={t(`quickLinks.placeholders.title_${lng}`, `Title (${lng})`)}
                />
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
          <label className="block text-sm font-medium text-gray-700">{t('quickLinks.fields.url', 'URL')}</label>
          <InputText value={url} onChange={(e) => setUrl((e.target as HTMLInputElement).value)} className="w-full p-inputtext-sm" placeholder={t('quickLinks.placeholders.url', 'https://example.com')} />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" label={editingId ? t('quickLinks.actions.update', 'Update') : t('quickLinks.actions.add', 'Add')} icon="pi pi-check" />
          <Button type="button" label={t('quickLinks.actions.clear', 'Clear')} className="p-button-outlined" onClick={resetForm} />
        </div>
      </form>

      <div>
        {links.length === 0 ? (
          <div className="text-sm text-gray-500">{t('quickLinks.empty', 'No quick links yet')}</div>
        ) : (
          <DataTable value={links} responsiveLayout="scroll">
              <Column field="label" header={t('quickLinks.table.title', 'Title')} />
            <Column header={t('quickLinks.table.url', 'URL')} body={urlBodyTemplate} />
            <Column header={t('quickLinks.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '150px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default QuickLinksPage;
