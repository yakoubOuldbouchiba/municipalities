import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import axiosClient from '../api/axiosClient';

type Potential = {
  id: string;
  slug: string;
  title: string; // localized title when listing (index returns a string for requested lang)
  description: string; // localized description
};

const PotentialsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [potentials, setPotentials] = useState<Potential[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [slug, setSlug] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/potentials', { params: { lang: i18n.language || 'en' } });
      setPotentials(res.data || []);
    } catch (err) {
      // ignore/network errors for now
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setTitles({});
    setDescriptions({});
    setSlug('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // require at least english title/description or the first configured language
    const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
    const primary = configuredLangs[0] || 'en';
    
    if (
      !((titles[primary] || '').trim()) ||
      !((descriptions[primary] || '').trim()) ||
      !slug.trim()
    ) {
      return;
    }

    const payload = {
      slug: slug.trim(),
      title: Object.fromEntries(Object.entries(titles).map(([k, v]) => [k, v.trim()])),
      description: Object.fromEntries(Object.entries(descriptions).map(([k, v]) => [k, v.trim()])),
    };

    try {
      if (editingId) {
        await axiosClient.put(`/potentials/${editingId}`, payload);
      } else {
        await axiosClient.post('/potentials', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      // handle error (validation/auth) as needed
      console.error('Error saving potential:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/potentials/${id}`);
      const data = res.data;
      setTitles(data.title || {});
      setDescriptions(data.description || {});
      setSlug(data.slug || '');
      setEditingId(id);
    } catch (err) {
      console.error('Error loading potential:', err);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('potentials.confirmDelete', 'Delete this potential?'),
      header: t('potentials.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/potentials/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          console.error('Error deleting potential:', err);
        }
      }
    });
  };

  const actionBodyTemplate = (rowData: Potential) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  return (
    <div className="p-4">
      <ConfirmDialog />
      <h1 className="text-2xl font-semibold mb-4">{t('potentials.title', 'Potentials')}</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-2xl">
        {/* Language add controls */}
        <div className="flex gap-2 items-center">
          {(() => {
            const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
            const existing = Array.from(new Set([...(configuredLangs || []), ...Object.keys(titles), ...Object.keys(descriptions)]));
            const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
            const allCandidates = Object.entries(langNames).map(([code, name]) => ({ code, name }));
            const options = allCandidates.filter((o) => !existing.includes(o.code));
            return (
              <>
                <Dropdown value={selectedLang} options={options} onChange={(e) => setSelectedLang(e.value)} optionLabel="name" optionValue="code" placeholder={t('potentials.addLangPlaceholder', 'Select language')} />
                <Button icon="pi pi-plus" className="p-button-sm" onClick={() => {
                  const code = (selectedLang || '').trim().toLowerCase();
                  if (!code) return;
                  const rendered = Array.from(new Set([...(configuredLangs || []), ...Object.keys(titles), ...Object.keys(descriptions)]));
                  if (rendered.includes(code)) {
                    setSelectedLang(null);
                    return;
                  }
                  setTitles((prev) => ({ ...prev, [code]: '' }));
                  setDescriptions((prev) => ({ ...prev, [code]: '' }));
                  setSelectedLang(null);
                }} aria-label="Add language" />
              </>
            );
          })()}
        </div>

        {/* Slug field (not language-specific) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('potentials.fields.slug', 'Slug')}</label>
          <InputText 
            value={slug} 
            onChange={(e) => setSlug((e.target as HTMLInputElement).value)} 
            className="w-full p-inputtext-sm" 
            placeholder={t('potentials.placeholders.slug', 'e.g., tourism')} 
          />
        </div>

        {/* Render one title and description input per configured language plus any added languages */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(titles), ...Object.keys(descriptions)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.map((lng) => (
            <div key={lng} className="p-3 border border-gray-200 rounded">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">{langNames[lng] ?? lng.toUpperCase()}</h3>
                {/* allow removing only languages that are not part of configured i18n resources */}
                {!configuredLangs.includes(lng) && (
                  <Button 
                    type="button"
                    icon="pi pi-times" 
                    className="p-button-text p-button-danger p-button-sm" 
                    onClick={() => {
                      setTitles((prev) => {
                        const next = { ...prev };
                        delete next[lng];
                        return next;
                      });
                      setDescriptions((prev) => {
                        const next = { ...prev };
                        delete next[lng];
                        return next;
                      });
                    }} 
                    aria-label={`Remove ${lng}`} 
                  />
                )}
              </div>

              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-600">{t(`potentials.fields.title_${lng}`, `Title (${lng})`)}</label>
                <InputText
                  value={titles[lng] || ''}
                  onChange={(e) => setTitles((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))}
                  className="w-full p-inputtext-sm"
                  placeholder={t(`potentials.placeholders.title_${lng}`, `Title (${lng})`)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">{t(`potentials.fields.description_${lng}`, `Description (${lng})`)}</label>
                <InputTextarea
                  value={descriptions[lng] || ''}
                  onChange={(e) => setDescriptions((prev) => ({ ...prev, [lng]: (e.target as HTMLTextAreaElement).value }))}
                  className="w-full p-inputtextarea-sm"
                  placeholder={t(`potentials.placeholders.description_${lng}`, `Description (${lng})`)}
                  rows={3}
                />
              </div>
            </div>
          ));
        })()}

        <div className="flex items-center gap-2">
          <Button type="submit" label={editingId ? t('potentials.actions.update', 'Update') : t('potentials.actions.add', 'Add')} icon="pi pi-check" />
          <Button type="button" label={t('potentials.actions.clear', 'Clear')} className="p-button-outlined" onClick={resetForm} />
        </div>
      </form>

      <div>
        {potentials.length === 0 ? (
          <div className="text-sm text-gray-500">{t('potentials.empty', 'No potentials yet')}</div>
        ) : (
          <DataTable value={potentials} responsiveLayout="scroll">
            <Column field="slug" header={t('potentials.table.slug', 'Slug')} />
            <Column field="title" header={t('potentials.table.title', 'Title')} />
            <Column field="description" header={t('potentials.table.description', 'Description')} />
            <Column header={t('potentials.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '150px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default PotentialsPage;
