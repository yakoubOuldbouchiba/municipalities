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

type NewsItem = {
  id: string;
  title: string; // localized title when listing
  description: string; // localized description
  fileUrl: string;
  hidden?: boolean;
};

const NewsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useRef<any>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [fileUrl, setFileUrl] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeKeyboardField, setActiveKeyboardField] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/news', { params: { lang: i18n.language || 'en', include_hidden: true } });
      setNews(res.data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setTitles({});
    setDescriptions({});
    setFileUrl('');
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
      !fileUrl.trim()
    ) {
      return;
    }

    const payload = {
      title: Object.fromEntries(Object.entries(titles).map(([k, v]) => [k, v.trim()])),
      description: Object.fromEntries(Object.entries(descriptions).map(([k, v]) => [k, v.trim()])),
      fileUrl: fileUrl.trim(),
    };

    try {
      if (editingId) {
        await axiosClient.put(`/news/${editingId}`, payload);
      } else {
        await axiosClient.post('/news', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      console.error('Error saving news:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/news/${id}`);
      const data = res.data;
      setTitles(data.title || {});
      setDescriptions(data.description || {});
      setFileUrl(data.fileUrl || '');
      setEditingId(id);
      setDialogVisible(true);
    } catch (err) {
      console.error('Error loading news:', err);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('news.confirmDelete', 'Delete this news item?'),
      header: t('news.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/news/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          console.error('Error deleting news:', err);
        }
      }
    });
  };

  const toggleHidden = async (id: string) => {
    try {
      await axiosClient.put(`/news/${id}/toggle-hidden`);
      await fetchList();
      toast.current?.show({ severity: 'success', summary: t('news.success', 'Success'), detail: t('news.toggleSuccess', 'News visibility updated'), life: 3000 });
    } catch (err) {
      console.error('Error toggling news hidden status:', err);
      toast.current?.show({ severity: 'error', summary: t('news.error', 'Error'), detail: t('news.toggleError', 'Failed to update news visibility'), life: 3000 });
    }
  };

  const actionBodyTemplate = (rowData: NewsItem) => (
    <div className="flex gap-2">
      <Button icon={rowData.hidden ? "pi pi-eye" : "pi pi-eye-slash"} className="p-button-sm p-button-warning" onClick={() => toggleHidden(rowData.id)} aria-label={rowData.hidden ? "Show" : "Hide"} />
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  const fileUrlBodyTemplate = (rowData: NewsItem) => (
    <a href={rowData.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline truncate">
      {rowData.fileUrl}
    </a>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t('news.title', 'News')}</h1>
        <Button 
          label={t('news.actions.addNew', 'Add News')} 
          icon="pi pi-plus" 
          onClick={() => {
            resetForm();
            setDialogVisible(true);
          }} 
        />
      </div>

      <Dialog
        header={editingId ? t('news.dialog.editTitle', 'Edit News') : t('news.dialog.addTitle', 'Add News')}
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
                <Dropdown value={selectedLang} options={options} onChange={(e) => setSelectedLang(e.value)} optionLabel="name" optionValue="code" placeholder={t('news.addLangPlaceholder', 'Select language')} />
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

        {/* File URL field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('news.fields.fileUrl', 'Image URL')}</label>
          <div className="flex gap-2">
            <InputText
              value={fileUrl}
              onChange={(e) => setFileUrl((e.target as HTMLInputElement).value)}
              className="flex-1 p-inputtext-sm"
              placeholder={t('news.placeholders.fileUrl', 'https://example.com/image.jpg')}
            />
            <label className="p-button p-button-outlined p-button-sm flex items-center gap-2 cursor-pointer">
              <i className="pi pi-upload"></i>
              {t('news.actions.upload', 'Upload')}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await axiosClient.post('/news/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      });
                      setFileUrl(res.data.fileUrl);
                    } catch (err) {
                      console.error('Error uploading file:', err);
                    }
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('news.hints.fileUrlOrUpload', 'Enter a URL or upload an image')}</p>
        </div>

        {/* Title field - multilingual */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(titles)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.length > 0 ? (
            <div className="p-3 border border-gray-200 rounded">
              <h3 className="text-sm font-semibold mb-3">{t('news.fields.title', 'Title')}</h3>
              {renderedLangs.map((lng) => (
                <div key={lng} className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{langNames[lng] ?? lng.toUpperCase()}</label>
                  <InputText
                    value={titles[lng] || ''}
                    onChange={(e) => setTitles((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))}
                    onFocus={() => lng === 'ar' && setActiveKeyboardField(`title-${lng}`)}
                    className="w-full p-inputtext-sm"
                    placeholder={t(`news.placeholders.title_${lng}`, `Title (${lng})`)}
                    dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {lng === 'ar' && activeKeyboardField === `title-${lng}` && (
                    <ArabicKeyboard
                      onInput={(char: string) => setTitles((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                      onBackspace={() => setTitles((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : null;
        })()}

        {/* Description field - multilingual */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(descriptions)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.map((lng) => (
            <div key={lng} className="p-3 border border-gray-200 rounded">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">{t('news.fields.description', 'Description')} - {langNames[lng] ?? lng.toUpperCase()}</h3>
                {!configuredLangs.includes(lng) && (
                  <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-text p-button-danger p-button-sm"
                    onClick={() => {
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

              <label className="block text-xs font-medium text-gray-600 mb-1">{t(`news.fields.description_${lng}`, `Description (${lng})`)}</label>
              <InputTextarea
                value={descriptions[lng] || ''}
                onChange={(e) => setDescriptions((prev) => ({ ...prev, [lng]: (e.target as HTMLTextAreaElement).value }))}
                onFocus={() => lng === 'ar' && setActiveKeyboardField(`description-${lng}`)}
                className="w-full p-inputtextarea-sm"
                placeholder={t(`news.placeholders.description_${lng}`, `Description (${lng})`)}
                rows={3}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
              {lng === 'ar' && activeKeyboardField === `description-${lng}` && (
                <ArabicKeyboard
                  onInput={(char: string) => setDescriptions((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                  onBackspace={() => setDescriptions((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                />
              )}
            </div>
          ));
        })()}

          <div className="flex items-center gap-2">
            <Button type="submit" label={editingId ? t('news.actions.update', 'Update') : t('news.actions.add', 'Add')} icon="pi pi-check" />
            <Button type="button" label={t('news.actions.cancel', 'Cancel')} className="p-button-outlined" onClick={() => setDialogVisible(false)} />
          </div>
        </form>
      </Dialog>

      <div>
        {news.length === 0 ? (
          <div className="text-sm text-gray-500">{t('news.empty', 'No news yet')}</div>
        ) : (
          <DataTable value={news} responsiveLayout="scroll">
            <Column field="title" header={t('news.table.title', 'Title')} />
            <Column field="description" header={t('news.table.description', 'Description')} />
            <Column header={t('news.table.fileUrl', 'Image')} body={fileUrlBodyTemplate} style={{ width: '200px' }} />
            <Column header={t('news.table.hidden', 'Status')} body={(rowData: NewsItem) => (rowData.hidden ? <span className="text-red-600 font-semibold">{t('common.hidden', 'Hidden')}</span> : <span className="text-green-600 font-semibold">{t('common.visible', 'Visible')}</span>)} style={{ width: '100px' }} />
            <Column header={t('news.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '200px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
