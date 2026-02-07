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

type HomeImage = {
  id: string;
  url: string;
  caption: string; // localized caption when listing
  hidden?: boolean;
};

const SlidersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useRef<any>(null);
  const [sliders, setSliders] = useState<HomeImage[]>([]);
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeKeyboardField, setActiveKeyboardField] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/home-images', { params: { lang: i18n.language || 'en', include_hidden: true } });
      setSliders(res.data || []);
    } catch (err) {
      console.error('Error fetching sliders:', err);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setCaptions({});
    setImageUrl('');
    setEditingId(null);
    setDialogVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
    const primary = configuredLangs[0] || 'en';

    if (
      !((captions[primary] || '').trim()) ||
      !imageUrl.trim()
    ) {
      return;
    }

    const payload = {
      url: imageUrl.trim(),
      captions: Object.fromEntries(Object.entries(captions).map(([k, v]) => [k, v.trim() || null])),
    };

    try {
      if (editingId) {
        await axiosClient.put(`/home-images/${editingId}`, payload);
      } else {
        await axiosClient.post('/home-images', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      console.error('Error saving slider:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/home-images/${id}`);
      const data = res.data;
      setCaptions(data.caption || {});
      setImageUrl(data.url || '');
      setEditingId(id);
      setDialogVisible(true);
    } catch (err) {
      console.error('Error loading slider:', err);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('sliders.confirmDelete', 'Delete this slider?'),
      header: t('sliders.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/home-images/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          console.error('Error deleting slider:', err);
        }
      }
    });
  };

  const toggleHidden = async (id: string) => {
    try {
      await axiosClient.put(`/home-images/${id}/toggle-hidden`);
      await fetchList();
      toast.current?.show({ severity: 'success', summary: t('sliders.success', 'Success'), detail: t('sliders.toggleSuccess', 'Slider visibility updated'), life: 3000 });
    } catch (err) {
      console.error('Error toggling hidden status:', err);
      toast.current?.show({ severity: 'error', summary: t('sliders.error', 'Error'), detail: t('sliders.toggleError', 'Failed to update slider visibility'), life: 3000 });
    }
  };

  const actionBodyTemplate = (rowData: HomeImage) => (
    <div className="flex gap-2">
      <Button icon={rowData.hidden ? "pi pi-eye" : "pi pi-eye-slash"} className="p-button-sm p-button-warning" onClick={() => toggleHidden(rowData.id)} aria-label={rowData.hidden ? "Show" : "Hide"} />
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  const imageBodyTemplate = (rowData: HomeImage) => (
    <div className="flex flex-col gap-1">
      <img
        src={rowData.url}
        alt={rowData.caption}
        className="w-8 h-8 object-cover rounded"
      />
      <a href={rowData.url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs truncate">
        {rowData.url}
      </a>
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t('sliders.title', 'Sliders')}</h1>
        <Button 
          label={t('sliders.actions.addNew', 'Add Slider')} 
          icon="pi pi-plus" 
          onClick={() => {
            resetForm();
            setDialogVisible(true);
          }} 
        />
      </div>

      <Dialog
        header={editingId ? t('sliders.dialog.editTitle', 'Edit Slider') : t('sliders.dialog.addTitle', 'Add Slider')}
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
            const existing = Array.from(new Set([...(configuredLangs || []), ...Object.keys(captions)]));
            const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
            const allCandidates = Object.entries(langNames).map(([code, name]) => ({ code, name }));
            const options = allCandidates.filter((o) => !existing.includes(o.code));
            return (
              <>
                <Dropdown value={selectedLang} options={options} onChange={(e) => setSelectedLang(e.value)} optionLabel="name" optionValue="code" placeholder={t('sliders.addLangPlaceholder', 'Select language')} />
                <Button icon="pi pi-plus" className="p-button-sm" onClick={() => {
                  const code = (selectedLang || '').trim().toLowerCase();
                  if (!code) return;
                  const rendered = Array.from(new Set([...(configuredLangs || []), ...Object.keys(captions)]));
                  if (rendered.includes(code)) {
                    setSelectedLang(null);
                    return;
                  }
                  setCaptions((prev) => ({ ...prev, [code]: '' }));
                  setSelectedLang(null);
                }} aria-label="Add language" />
              </>
            );
          })()}
        </div>

        {/* Image URL field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('sliders.fields.image', 'Image URL')}</label>
          <div className="flex gap-2">
            <InputText
              value={imageUrl}
              onChange={(e) => setImageUrl((e.target as HTMLInputElement).value)}
              className="flex-1 p-inputtext-sm"
              placeholder={t('sliders.placeholders.image', 'https://example.com/image.jpg')}
            />
            <label className="p-button p-button-outlined p-button-sm flex items-center gap-2 cursor-pointer">
              <i className="pi pi-upload"></i>
              {t('sliders.actions.upload', 'Upload')}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
                    try {
                      const res = await axiosClient.post('/home-images/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      });
                      setImageUrl(res.data.link);
                    } catch (err) {
                      console.error('Error uploading image:', err);
                    }
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('sliders.hints.imageOrUpload', 'Enter an image URL or upload an image')}</p>
        </div>

        {/* Caption field - multilingual */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(captions)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.length > 0 ? (
            <div className="p-3 border border-gray-200 rounded">
              <h3 className="text-sm font-semibold mb-3">{t('sliders.fields.caption', 'Caption')}</h3>
              {renderedLangs.map((lng) => (
                <div key={lng} className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{langNames[lng] ?? lng.toUpperCase()}</label>
                  <InputText
                    value={captions[lng] || ''}
                    onChange={(e) => setCaptions((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))}
                    onFocus={() => lng === 'ar' && setActiveKeyboardField(`caption-${lng}`)}
                    className="w-full p-inputtext-sm"
                    placeholder={t(`sliders.placeholders.caption_${lng}`, `Caption (${lng})`)}
                    dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {lng === 'ar' && activeKeyboardField === `caption-${lng}` && (
                    <ArabicKeyboard
                      onInput={(char: string) => setCaptions((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                      onBackspace={() => setCaptions((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : null;
        })()}

          <div className="flex items-center gap-2">
            <Button type="submit" label={editingId ? t('sliders.actions.update', 'Update') : t('sliders.actions.add', 'Add')} icon="pi pi-check" />
            <Button type="button" label={t('sliders.actions.cancel', 'Cancel')} className="p-button-outlined" onClick={() => setDialogVisible(false)} />
          </div>
        </form>
      </Dialog>

      <div>
        {sliders.length === 0 ? (
          <div className="text-sm text-gray-500">{t('sliders.empty', 'No sliders yet')}</div>
        ) : (
          <DataTable value={sliders} responsiveLayout="scroll">
            <Column header={t('sliders.table.image', 'Image')} body={imageBodyTemplate} style={{ width: '100px' }} />
            <Column field="caption" header={t('sliders.table.caption', 'Caption')} />
            <Column header={t('sliders.table.hidden', 'Status')} body={(rowData) => (rowData.hidden ? <span className="text-red-600 font-semibold">Hidden</span> : <span className="text-green-600 font-semibold">Visible</span>)} style={{ width: '100px' }} />
            <Column header={t('sliders.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '200px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default SlidersPage;
