import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axiosClient from '../../api/axiosClient';
import ArabicKeyboard from '../../components/ArabicKeyboard';

const DEFAULT_LANGUAGES = ['en', 'ar', 'fr'];
const LANGUAGE_NAMES: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية' };

type Person = {
  id: string;
  type: string;
  name: string; // localized name when listing
  message: string | null;
  achievements: string | null;
  image_url: string;
  period: string;
  is_current: boolean;
  hidden?: boolean;
};

const PersonsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useRef<any>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [achievements, setAchievements] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState('');
  const [period, setPeriod] = useState('');
  const [type, setType] = useState<string | null>('mayor');
  const [isCurrent, setIsCurrent] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeKeyboardField, setActiveKeyboardField] = useState<string | null>(null);

  // Type options - defined inside component to react to language changes
  const typeOptions = [
    { label: t('persons.types.mayor', 'Mayor'), value: 'mayor' },
    { label: t('persons.types.secretary_general', 'Secretary General'), value: 'secretary_general' },
  ];

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/persons', { params: { lang: i18n.language || 'en', include_hidden: true } });
      setPersons(res.data || []);
    } catch (err) {
      console.error('Error fetching persons:', err);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setNames(Object.fromEntries(DEFAULT_LANGUAGES.map(lang => [lang, ''])));
    setMessages(Object.fromEntries(DEFAULT_LANGUAGES.map(lang => [lang, ''])));
    setAchievements(Object.fromEntries(DEFAULT_LANGUAGES.map(lang => [lang, ''])));
    setImageUrl('');
    setPeriod('');
    setType('mayor');
    setIsCurrent(false);
    setSelectedLang(null);
    setEditingId(null);
    setActiveKeyboardField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const primary = DEFAULT_LANGUAGES[0] || 'en';

    if (!((names[primary] || '').trim()) || !type) {
      return;
    }

    const payload = {
      type,
      names: Object.fromEntries(Object.entries(names).map(([k, v]) => [k, v.trim()])),
      messages: Object.fromEntries(Object.entries(messages).map(([k, v]) => [k, v.trim() || null])),
      achievements: Object.fromEntries(Object.entries(achievements).map(([k, v]) => [k, v.trim() || null])),
      image_url: imageUrl.trim() || null,
      period: period.trim() || null,
      is_current: isCurrent,
    };

    try {
      if (editingId) {
        await axiosClient.put(`/persons/${editingId}`, payload);
      } else {
        await axiosClient.post('/persons', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      console.error('Error saving person:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/persons/${id}`, { params: { full: true } });
      const data = res.data;
      setNames(data.names || {});
      setMessages(data.messages || {});
      setAchievements(data.achievements || {});
      setImageUrl(data.image_url || '');
      setPeriod(data.period || '');
      setType(data.type || 'mayor');
      setIsCurrent(data.is_current || false);
      setEditingId(id);
    } catch (err) {
      console.error('Error loading person:', err);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('persons.confirmDelete', 'Delete this person?'),
      header: t('persons.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/persons/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          console.error('Error deleting person:', err);
        }
      }
    });
  };

  const toggleHidden = async (id: string) => {
    try {
      await axiosClient.put(`/persons/${id}/toggle-hidden`);
      await fetchList();
      toast.current?.show({ severity: 'success', summary: t('persons.success', 'Success'), detail: t('persons.toggleSuccess', 'Person visibility updated'), life: 3000 });
    } catch (err) {
      console.error('Error toggling person hidden status:', err);
      toast.current?.show({ severity: 'error', summary: t('persons.error', 'Error'), detail: t('persons.toggleError', 'Failed to update person visibility'), life: 3000 });
    }
  };

  const actionBodyTemplate = (rowData: Person) => (
    <div className="flex gap-2">
      <Button icon={rowData.hidden ? "pi pi-eye" : "pi pi-eye-slash"} className="p-button-sm p-button-warning" onClick={() => toggleHidden(rowData.id)} aria-label={rowData.hidden ? "Show" : "Hide"} />
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  const typeBodyTemplate = (rowData: Person) => (
    <span>{rowData.type === 'mayor' ? t('persons.types.mayor', 'Mayor') : t('persons.types.secretary_general', 'Secretary General')}</span>
  );

  const currentBodyTemplate = (rowData: Person) => (
    <i className={rowData.is_current ? 'pi pi-check text-green-600' : 'pi pi-times text-red-600'}></i>
  );

  const imageBodyTemplate = (rowData: Person) => (
    rowData.image_url ? (
      <a href={rowData.image_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
        View Image
      </a>
    ) : (
      <span className="text-gray-500">-</span>
    )
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <h1 className="text-2xl font-semibold mb-4">{t('persons.title', 'Persons')}</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-2xl">
        {/* Type field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('persons.fields.type', 'Type')}</label>
          <Dropdown
            value={type}
            options={typeOptions}
            onChange={(e) => setType(e.value)}
            optionLabel="label"
            optionValue="value"
            placeholder={t('persons.placeholders.type', 'Select type')}
            className="w-full"
          />
        </div>

        {/* Image URL field with upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('persons.fields.imageUrl', 'Image URL')}</label>
          <div className="flex gap-2">
            <InputText
              value={imageUrl}
              onChange={(e) => setImageUrl((e.target as HTMLInputElement).value)}
              className="flex-1 p-inputtext-sm"
              placeholder={t('persons.placeholders.imageUrl', 'https://example.com/image.jpg')}
            />
            <label className="p-button p-button-outlined p-button-sm flex items-center gap-2 cursor-pointer">
              <i className="pi pi-upload"></i>
              {t('persons.actions.upload', 'Upload')}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await axiosClient.post('/persons/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      });
                      setImageUrl(res.data.image_url);
                    } catch (err) {
                      console.error('Error uploading image:', err);
                    }
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('persons.hints.linkOrUpload', 'Enter a URL or upload an image')}</p>
        </div>

        {/* Period field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('persons.fields.period', 'Period')}</label>
          <InputText
            value={period}
            onChange={(e) => setPeriod((e.target as HTMLInputElement).value)}
            className="w-full p-inputtext-sm"
            placeholder={t('persons.placeholders.period', 'e.g., 2020-2024')}
          />
        </div>

        {/* Is Current toggle */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">{t('persons.fields.isCurrent', 'Is Current')}</label>
          <InputSwitch checked={isCurrent} onChange={(e) => setIsCurrent(e.value)} />
        </div>

        {/* Name field - multilingual */}
        {(() => {
          return (
            <div className="p-3 border border-gray-200 rounded">
              <h3 className="text-sm font-semibold mb-3">{t('persons.fields.name', 'Name')}</h3>
              {DEFAULT_LANGUAGES.map((lng) => (
                <div key={lng} className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{LANGUAGE_NAMES[lng] ?? lng.toUpperCase()}</label>
                  <InputText
                    value={names[lng] || ''}
                    onChange={(e) => setNames((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))}
                    onFocus={() => lng === 'ar' && setActiveKeyboardField(`name-${lng}`)}
                    className="w-full p-inputtext-sm"
                    placeholder={t(`persons.placeholders.name_${lng}`, `Name (${lng})`)} 
                    dir={lng === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {lng === 'ar' && activeKeyboardField === `name-${lng}` && (
                    <ArabicKeyboard
                      onInput={(char: string) => setNames((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                      onBackspace={() => setNames((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                    />
                  )}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Message field - multilingual */}
        {(() => {
          return (
            <>
              {DEFAULT_LANGUAGES.map((lng) => (
                <div key={lng} className="p-3 border border-gray-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">{t('persons.fields.message', 'Message')} - {LANGUAGE_NAMES[lng] ?? lng.toUpperCase()}</h3>
                  </div>

                  <label className="block text-xs font-medium text-gray-600 mb-1">{t(`persons.fields.message_${lng}`, `Message (${lng})`)}</label>
                  <InputTextarea
                    value={messages[lng] || ''}
                    onChange={(e) => setMessages((prev) => ({ ...prev, [lng]: (e.target as HTMLTextAreaElement).value }))}
                    onFocus={() => lng === 'ar' && setActiveKeyboardField(`message-${lng}`)}
                    className="w-full p-inputtextarea-sm"
                    placeholder={t(`persons.placeholders.message_${lng}`, `Message (${lng})`)}
                    rows={3}
                    dir={lng === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {lng === 'ar' && activeKeyboardField === `message-${lng}` && (
                    <ArabicKeyboard
                      onInput={(char: string) => setMessages((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                      onBackspace={() => setMessages((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                    />
                  )}
                </div>
              ))}
            </>
          );
        })()}

        {/* Achievements field - multilingual */}
        {(() => {
          return (
            <>
              {DEFAULT_LANGUAGES.map((lng) => (
                <div key={lng} className="p-3 border border-gray-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">{t('persons.fields.achievements', 'Achievements')} - {LANGUAGE_NAMES[lng] ?? lng.toUpperCase()}</h3>
                  </div>

                  <label className="block text-xs font-medium text-gray-600 mb-1">{t(`persons.fields.achievements_${lng}`, `Achievements (${lng})`)}</label>
                  <InputTextarea
                    value={achievements[lng] || ''}
                    onChange={(e) => setAchievements((prev) => ({ ...prev, [lng]: (e.target as HTMLTextAreaElement).value }))}
                    onFocus={() => lng === 'ar' && setActiveKeyboardField(`achievements-${lng}`)}
                    className="w-full p-inputtextarea-sm"
                    placeholder={t(`persons.placeholders.achievements_${lng}`, `Achievements (${lng})`)}
                    rows={3}
                    dir={lng === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {lng === 'ar' && activeKeyboardField === `achievements-${lng}` && (
                    <ArabicKeyboard
                      onInput={(char: string) => setAchievements((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                      onBackspace={() => setAchievements((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                    />
                  )}
                </div>
              ))}
            </>
          );
        })()}

        <div className="flex items-center gap-2">
          <Button type="submit" label={editingId ? t('persons.actions.update', 'Update') : t('persons.actions.add', 'Add')} icon="pi pi-check" />
          <Button type="button" label={t('persons.actions.clear', 'Clear')} className="p-button-outlined" onClick={resetForm} />
        </div>
      </form>

      <div>
        {persons.length === 0 ? (
          <div className="text-sm text-gray-500">{t('persons.empty', 'No persons yet')}</div>
        ) : (
          <DataTable value={persons} responsiveLayout="scroll">
            <Column field="type" header={t('persons.table.type', 'Type')} body={typeBodyTemplate} />
            <Column field="name" header={t('persons.table.name', 'Name')} />
            <Column field="period" header={t('persons.table.period', 'Period')} />
            <Column header={t('persons.table.image', 'Image')} body={imageBodyTemplate} style={{ width: '120px' }} />
            <Column header={t('persons.table.isCurrent', 'Current')} body={currentBodyTemplate} style={{ width: '80px' }} />
            <Column header={t('persons.table.hidden', 'Status')} body={(rowData: Person) => (rowData.hidden ? <span className="text-red-600 font-semibold">{t('common.hidden', 'Hidden')}</span> : <span className="text-green-600 font-semibold">{t('common.visible', 'Visible')}</span>)} style={{ width: '100px' }} />
            <Column header={t('persons.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '200px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default PersonsPage;
