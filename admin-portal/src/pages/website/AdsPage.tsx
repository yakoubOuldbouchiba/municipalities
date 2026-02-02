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
import axiosClient from '../../api/axiosClient';
import ArabicKeyboard from '../../components/ArabicKeyboard';

type Ad = {
  id: string;
  title: string; // localized title when listing
  description: string; // localized description
  link: string;
  file_type: string;
  hidden?: boolean;
};

const AdsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useRef<any>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [link, setLink] = useState('');
  const [fileType, setFileType] = useState<string | null>('image');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeKeyboardField, setActiveKeyboardField] = useState<string | null>(null);

  const fileTypeOptions = [
    { label: t('ads.fileTypes.image', 'Image'), value: 'image' },
    { label: t('ads.fileTypes.pdf', 'PDF'), value: 'pdf' },
  ];

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/ads', { params: { lang: i18n.language || 'en', include_hidden: true } });
      setAds(res.data || []);
    } catch (err) {
      console.error('Error fetching ads:', err);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setTitles({});
    setDescriptions({});
    setLink('');
    setFileType('image');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
    const primary = configuredLangs[0] || 'en';

    if (
      !((titles[primary] || '').trim()) ||
      !link.trim() ||
      !fileType
    ) {
      return;
    }

    const payload = {
      title: Object.fromEntries(Object.entries(titles).map(([k, v]) => [k, v.trim()])),
      description: Object.fromEntries(Object.entries(descriptions).map(([k, v]) => [k, v.trim() || null])),
      link: link.trim(),
      file_type: fileType,
    };

    try {
      if (editingId) {
        await axiosClient.put(`/ads/${editingId}`, payload);
      } else {
        await axiosClient.post('/ads', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      console.error('Error saving ad:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/ads/${id}`);
      const data = res.data;
      setTitles(data.title || {});
      setDescriptions(data.description || {});
      setLink(data.link || '');
      setFileType(data.file_type || 'image');
      setEditingId(id);
    } catch (err) {
      console.error('Error loading ad:', err);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('ads.confirmDelete', 'Delete this ad?'),
      header: t('ads.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/ads/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          console.error('Error deleting ad:', err);
        }
      }
    });
  };

  const toggleHidden = async (id: string) => {
    try {
      await axiosClient.put(`/ads/${id}/toggle-hidden`);
      await fetchList();
      toast.current?.show({ severity: 'success', summary: t('ads.success', 'Success'), detail: t('ads.toggleSuccess', 'Ad visibility updated'), life: 3000 });
    } catch (err) {
      console.error('Error toggling hidden status:', err);
      toast.current?.show({ severity: 'error', summary: t('ads.error', 'Error'), detail: t('ads.toggleError', 'Failed to update ad visibility'), life: 3000 });
    }
  };

  const actionBodyTemplate = (rowData: Ad) => (
    <div className="flex gap-2">
      <Button icon={rowData.hidden ? "pi pi-eye" : "pi pi-eye-slash"} className="p-button-sm p-button-warning" onClick={() => toggleHidden(rowData.id)} aria-label={rowData.hidden ? "Show" : "Hide"} />
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  const linkBodyTemplate = (rowData: Ad) => (
    <a href={rowData.link} target="_blank" rel="noreferrer" className="text-blue-600 underline truncate">
      {rowData.link}
    </a>
  );

  const fileTypeBodyTemplate = (rowData: Ad) => (
    <span>{rowData.file_type === 'image' ? t('ads.fileTypes.image', 'Image') : t('ads.fileTypes.pdf', 'PDF')}</span>
  );

  return (
    <div className="p-4">      <Toast ref={toast} />      <ConfirmDialog />
      <h1 className="text-2xl font-semibold mb-4">{t('ads.title', 'Advertisements')}</h1>

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
                <Dropdown value={selectedLang} options={options} onChange={(e) => setSelectedLang(e.value)} optionLabel="name" optionValue="code" placeholder={t('ads.addLangPlaceholder', 'Select language')} />
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

        {/* Link field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('ads.fields.link', 'Link')}</label>
          <div className="flex gap-2">
            <InputText
              value={link}
              onChange={(e) => setLink((e.target as HTMLInputElement).value)}
              className="flex-1 p-inputtext-sm"
              placeholder={t('ads.placeholders.link', 'https://example.com/ad-file')}
            />
            <label className="p-button p-button-outlined p-button-sm flex items-center gap-2 cursor-pointer">
              <i className="pi pi-upload"></i>
              {t('ads.actions.upload', 'Upload')}
              <input
                type="file"
                accept={fileType === 'pdf' ? '.pdf' : 'image/*'}
                onChange={async (e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await axiosClient.post('/ads/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      });
                      setLink(res.data.link);
                    } catch (err) {
                      console.error('Error uploading file:', err);
                    }
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('ads.hints.linkOrUpload', 'Enter a URL or upload a file')}</p>
        </div>

        {/* File Type field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('ads.fields.fileType', 'File Type')}</label>
          <Dropdown
            value={fileType}
            options={fileTypeOptions}
            onChange={(e) => setFileType(e.value)}
            optionLabel="label"
            optionValue="value"
            placeholder={t('ads.placeholders.fileType', 'Select file type')}
            className="w-full"
          />
        </div>

        {/* Title field - multilingual */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(titles)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.length > 0 ? (
            <div className="p-3 border border-gray-200 rounded">
              <h3 className="text-sm font-semibold mb-3">{t('ads.fields.title', 'Title')}</h3>
              {renderedLangs.map((lng) => (
                <div key={lng} className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{langNames[lng] ?? lng.toUpperCase()}</label>
                  <InputText
                    value={titles[lng] || ''}
                    onChange={(e) => setTitles((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))}
                    onFocus={() => lng === 'ar' && setActiveKeyboardField(`title-${lng}`)}
                    className="w-full p-inputtext-sm"
                    placeholder={t(`ads.placeholders.title_${lng}`, `Title (${lng})`)}
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

        {/* Description field - multilingual (optional) */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(descriptions)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.map((lng) => (
            <div key={lng} className="p-3 border border-gray-200 rounded">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">{t('ads.fields.description', 'Description')} - {langNames[lng] ?? lng.toUpperCase()}</h3>
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

              <label className="block text-xs font-medium text-gray-600 mb-1">{t(`ads.fields.description_${lng}`, `Description (${lng})`)}</label>
              <InputTextarea
                value={descriptions[lng] || ''}
                onChange={(e) => setDescriptions((prev) => ({ ...prev, [lng]: (e.target as HTMLTextAreaElement).value }))}
                onFocus={() => lng === 'ar' && setActiveKeyboardField(`description-${lng}`)}
                className="w-full p-inputtextarea-sm"
                placeholder={t(`ads.placeholders.description_${lng}`, `Description (${lng})`)}
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
          <Button type="submit" label={editingId ? t('ads.actions.update', 'Update') : t('ads.actions.add', 'Add')} icon="pi pi-check" />
          <Button type="button" label={t('ads.actions.clear', 'Clear')} className="p-button-outlined" onClick={resetForm} />
        </div>
      </form>

      <div>
        {ads.length === 0 ? (
          <div className="text-sm text-gray-500">{t('ads.empty', 'No ads yet')}</div>
        ) : (
          <DataTable value={ads} responsiveLayout="scroll">
            <Column field="title" header={t('ads.table.title', 'Title')} />
            <Column field="description" header={t('ads.table.description', 'Description')} />
            <Column header={t('ads.table.link', 'Link')} body={linkBodyTemplate} style={{ width: '200px' }} />
            <Column header={t('ads.table.fileType', 'Type')} body={fileTypeBodyTemplate} style={{ width: '100px' }} />
            <Column header={t('ads.table.hidden', 'Status')} body={(rowData) => (rowData.hidden ? <span className="text-red-600 font-semibold">Hidden</span> : <span className="text-green-600 font-semibold">Visible</span>)} style={{ width: '100px' }} />
            <Column header={t('ads.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '200px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default AdsPage;
