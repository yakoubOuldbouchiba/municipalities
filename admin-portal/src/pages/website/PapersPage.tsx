import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import axiosClient from '../../api/axiosClient';
import ArabicKeyboard from '../../components/ArabicKeyboard';

type Paper = {
  id: string;
  slug: string;
  title: string; // localized title when listing
  description: string; // localized description
  hidden?: boolean;
};

const PapersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useRef<any>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [slug, setSlug] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeKeyboardField, setActiveKeyboardField] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/papers', { params: { lang: i18n.language || 'en', include_hidden: true } });
      setPapers(res.data || []);
    } catch (err) {
      console.error('Error fetching papers:', err);
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
    setDialogVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        await axiosClient.put(`/papers/${editingId}`, payload);
      } else {
        await axiosClient.post('/papers', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      console.error('Error saving paper:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/papers/${id}`);
      const data = res.data;
      setTitles(data.title || {});
      setDescriptions(data.description || {});
      setSlug(data.slug || '');
      setEditingId(id);
      setDialogVisible(true);
    } catch (err) {
      console.error('Error loading paper:', err);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('papers.confirmDelete', 'Delete this paper?'),
      header: t('papers.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/papers/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          console.error('Error deleting paper:', err);
        }
      }
    });
  };

  const toggleHidden = async (id: string) => {
    try {
      await axiosClient.put(`/papers/${id}/toggle-hidden`);
      await fetchList();
      toast.current?.show({ severity: 'success', summary: t('papers.success', 'Success'), detail: t('papers.toggleSuccess', 'Paper visibility updated'), life: 3000 });
    } catch (err) {
      console.error('Error toggling hidden status:', err);
      toast.current?.show({ severity: 'error', summary: t('papers.error', 'Error'), detail: t('papers.toggleError', 'Failed to update paper visibility'), life: 3000 });
    }
  };

  const actionBodyTemplate = (rowData: Paper) => (
    <div className="flex gap-2">
      <Button icon={rowData.hidden ? "pi pi-eye" : "pi pi-eye-slash"} className="p-button-sm p-button-warning" onClick={() => toggleHidden(rowData.id)} aria-label={rowData.hidden ? "Show" : "Hide"} />
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t('papers.title', 'Papers')}</h1>
        <Button 
          label={t('papers.actions.addNew', 'Add Paper')} 
          icon="pi pi-plus" 
          onClick={() => {
            resetForm();
            setDialogVisible(true);
          }} 
        />
      </div>

      <Dialog
        header={editingId ? t('papers.dialog.editTitle', 'Edit Paper') : t('papers.dialog.addTitle', 'Add Paper')}
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
            const existing = Array.from(new Set([...(configuredLangs || []), ...Object.keys(titles), ...Object.keys(descriptions)]));
            const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
            const allCandidates = Object.entries(langNames).map(([code, name]) => ({ code, name }));
            const options = allCandidates.filter((o) => !existing.includes(o.code));
            return (
              <>
                <Dropdown value={selectedLang} options={options} onChange={(e) => setSelectedLang(e.value)} optionLabel="name" optionValue="code" placeholder={t('papers.addLangPlaceholder', 'Select language')} />
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
          <label className="block text-sm font-medium text-gray-700">{t('papers.fields.slug', 'Slug')}</label>
          <InputText
            value={slug}
            onChange={(e) => setSlug((e.target as HTMLInputElement).value)}
            className="w-full p-inputtext-sm"
            placeholder={t('papers.placeholders.slug', 'e.g., environmental-policy')}
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
                <label className="block text-xs font-medium text-gray-600">{t(`papers.fields.title_${lng}`, `Title (${lng})`)}</label>
                <InputText
                  value={titles[lng] || ''}
                  onChange={(e) => setTitles((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))}
                  onFocus={() => lng === 'ar' && setActiveKeyboardField(`title-${lng}`)}
                  className="w-full p-inputtext-sm"
                  placeholder={t(`papers.placeholders.title_${lng}`, `Title (${lng})`)}
                />
                {lng === 'ar' && activeKeyboardField === `title-${lng}` && (
                  <ArabicKeyboard
                    onInput={(char: string) => setTitles((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                    onBackspace={() => setTitles((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">{t(`papers.fields.description_${lng}`, `Description (${lng})`)}</label>
                <InputTextarea
                  value={descriptions[lng] || ''}
                  onChange={(e) => setDescriptions((prev) => ({ ...prev, [lng]: (e.target as HTMLTextAreaElement).value }))}
                  onFocus={() => lng === 'ar' && setActiveKeyboardField(`description-${lng}`)}
                  className="w-full p-inputtextarea-sm"
                  placeholder={t(`papers.placeholders.description_${lng}`, `Description (${lng})`)}
                  rows={4}
                />
                {lng === 'ar' && activeKeyboardField === `description-${lng}` && (
                  <ArabicKeyboard
                    onInput={(char: string) => setDescriptions((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                    onBackspace={() => setDescriptions((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                  />
                )}
              </div>
            </div>
          ));
        })()}

          <div className="flex items-center gap-2">
            <Button type="submit" label={editingId ? t('papers.actions.update', 'Update') : t('papers.actions.add', 'Add')} icon="pi pi-check" />
            <Button type="button" label={t('papers.actions.cancel', 'Cancel')} className="p-button-outlined" onClick={() => setDialogVisible(false)} />
          </div>
        </form>
      </Dialog>

      <div>
        {papers.length === 0 ? (
          <div className="text-sm text-gray-500">{t('papers.empty', 'No papers yet')}</div>
        ) : (
          <DataTable value={papers} responsiveLayout="scroll">
            <Column field="slug" header={t('papers.table.slug', 'Slug')} />
            <Column field="title" header={t('papers.table.title', 'Title')} />
            <Column field="description" header={t('papers.table.description', 'Description')} />
            <Column header={t('papers.table.hidden', 'Status')} body={(rowData) => (rowData.hidden ? <span className="text-red-600 font-semibold">Hidden</span> : <span className="text-green-600 font-semibold">Visible</span>)} style={{ width: '100px' }} />
            <Column header={t('papers.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '200px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default PapersPage;
