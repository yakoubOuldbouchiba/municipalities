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
import { getIconOptions, getColorOptions } from '../../lib/eventOptions';
import ArabicKeyboard from '../../components/ArabicKeyboard';

type Event = {
  id: string;
  status: string;
  date: string;
  description: string;
  icon: string;
  color: string;
  hidden?: boolean;
};

const EventsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useRef<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [date, setDate] = useState('');
  const [icon, setIcon] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeKeyboardField, setActiveKeyboardField] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Fetch list from backend (localized)
  const fetchList = async () => {
    try {
      const res = await axiosClient.get('/events', { params: { lang: i18n.language || 'en', include_hidden: true } });
      setEvents(res.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const resetForm = () => {
    setStatuses({});
    setDescriptions({});
    setDate('');
    setIcon(null);
    setColor(null);
    setEditingId(null);
    setDialogVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
    const primary = configuredLangs[0] || 'en';

    if (
      !((statuses[primary] || '').trim()) ||
      !((descriptions[primary] || '').trim()) ||
      !date.trim() ||
      !icon ||
      !color
    ) {
      return;
    }

    const payload = {
      status: Object.fromEntries(Object.entries(statuses).map(([k, v]) => [k, v.trim()])),
      date: date.trim(),
      description: Object.fromEntries(Object.entries(descriptions).map(([k, v]) => [k, v.trim()])),
      icon,
      color,
    };

    try {
      if (editingId) {
        await axiosClient.put(`/events/${editingId}`, payload);
      } else {
        await axiosClient.post('/events', payload);
      }
      await fetchList();
      resetForm();
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosClient.get(`/events/${id}`);
      const data = res.data;
      setStatuses(data.status || {});
      setDescriptions(data.description || {});
      setDate(data.date || '');
      setIcon(data.icon || null);
      setColor(data.color || null);
      setEditingId(id);
      setDialogVisible(true);
    } catch (err) {
      console.error('Error loading event:', err);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('events.confirmDelete', 'Delete this event?'),
      header: t('events.confirmHeader', 'Please Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/events/${id}`);
          await fetchList();
          if (editingId === id) resetForm();
        } catch (err) {
          console.error('Error deleting event:', err);
        }
      }
    });
  };

  const toggleHidden = async (id: string) => {
    try {
      await axiosClient.put(`/events/${id}/toggle-hidden`);
      await fetchList();
      toast.current?.show({ severity: 'success', summary: t('events.success', 'Success'), detail: t('events.toggleSuccess', 'Event visibility updated'), life: 3000 });
    } catch (err) {
      console.error('Error toggling event hidden status:', err);
      toast.current?.show({ severity: 'error', summary: t('events.error', 'Error'), detail: t('events.toggleError', 'Failed to update event visibility'), life: 3000 });
    }
  };

  const actionBodyTemplate = (rowData: Event) => (
    <div className="flex gap-2">
      <Button icon={rowData.hidden ? "pi pi-eye" : "pi pi-eye-slash"} className="p-button-sm p-button-warning" onClick={() => toggleHidden(rowData.id)} aria-label={rowData.hidden ? "Show" : "Hide"} />
      <Button icon="pi pi-pencil" className="p-button-sm" onClick={() => handleEdit(rowData.id)} aria-label="Edit" />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => confirmDelete(rowData.id)} aria-label="Delete" />
    </div>
  );

  const iconBodyTemplate = (rowData: Event) => (
    <div className="flex items-center gap-2">
      <i className={rowData.icon}></i>
      <span>{rowData.icon}</span>
    </div>
  );

  const colorBodyTemplate = (rowData: Event) => (
    <div className="flex items-center gap-2">
      <div className="w-1 rounded" style={{ backgroundColor: rowData.color }}></div>
      <span>{rowData.color}</span>
    </div>
  );

  // Icon item template for dropdown
  const iconItemTemplate = (option: any) => {
    if (!option.value) return option.label;
    return (
      <div className="flex items-center gap-2">
        <i className={`${option.value} text-lg`}></i>
        <span>{option.label}</span>
      </div>
    );
  };

  // Color item template for dropdown
  const colorItemTemplate = (option: any) => {
    if (!option.value) return option.label;
    return (
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded border border-gray-300" style={{ backgroundColor: option.value }}></div>
        <span>{option.label}</span>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t('events.title', 'Events')}</h1>
        <Button 
          label={t('events.actions.addNew', 'Add Event')} 
          icon="pi pi-plus" 
          onClick={() => {
            resetForm();
            setDialogVisible(true);
          }} 
        />
      </div>

      <Dialog
        header={editingId ? t('events.dialog.editTitle', 'Edit Event') : t('events.dialog.addTitle', 'Add Event')}
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
            const existing = Array.from(new Set([...(configuredLangs || []), ...Object.keys(statuses), ...Object.keys(descriptions)]));
            const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
            const allCandidates = Object.entries(langNames).map(([code, name]) => ({ code, name }));
            const options = allCandidates.filter((o) => !existing.includes(o.code));
            return (
              <>
                <Dropdown value={selectedLang} options={options} onChange={(e) => setSelectedLang(e.value)} optionLabel="name" optionValue="code" placeholder={t('events.addLangPlaceholder', 'Select language')} />
                <Button icon="pi pi-plus" className="p-button-sm" onClick={() => {
                  const code = (selectedLang || '').trim().toLowerCase();
                  if (!code) return;
                  const rendered = Array.from(new Set([...(configuredLangs || []), ...Object.keys(statuses), ...Object.keys(descriptions)]));
                  if (rendered.includes(code)) {
                    setSelectedLang(null);
                    return;
                  }
                  setStatuses((prev) => ({ ...prev, [code]: '' }));
                  setDescriptions((prev) => ({ ...prev, [code]: '' }));
                  setSelectedLang(null);
                }} aria-label="Add language" />
              </>
            );
          })()}
        </div>

        {/* Status field - multilingual */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(statuses)]));
          const langNames: Record<string, string> = { en: 'English', fr: 'Français', ar: 'العربية', de: 'Deutsch', es: 'Español' };
          return renderedLangs.length > 0 ? (
            <div className="p-3 border border-gray-200 rounded">
              <h3 className="text-sm font-semibold mb-3">{t('events.fields.status', 'Status')}</h3>
              {renderedLangs.map((lng) => (
                <div key={lng} className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{langNames[lng] ?? lng.toUpperCase()}</label>
                  <InputText
                    value={statuses[lng] || ''}
                    onChange={(e) => setStatuses((prev) => ({ ...prev, [lng]: (e.target as HTMLInputElement).value }))}
                    onFocus={() => lng === 'ar' && setActiveKeyboardField(`status-${lng}`)}
                    className="w-full p-inputtext-sm"
                    placeholder={t(`events.placeholders.status_${lng}`, `Status (${lng})`)}
                    dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {lng === 'ar' && activeKeyboardField === `status-${lng}` && (
                    <ArabicKeyboard
                      onInput={(char: string) => setStatuses((prev) => ({ ...prev, [lng]: (prev[lng] || '') + char }))}
                      onBackspace={() => setStatuses((prev) => ({ ...prev, [lng]: (prev[lng] || '').slice(0, -1) }))}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : null;
        })()}

        {/* Date field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('events.fields.date', 'Date')}</label>
          <InputText
            value={date}
            onChange={(e) => setDate((e.target as HTMLInputElement).value)}
            className="w-full p-inputtext-sm"
            placeholder={t('events.placeholders.date', 'e.g., 18th Century')}
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Icon dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('events.fields.icon', 'Icon')}</label>
          <div className="flex gap-2">
            <Dropdown
              value={icon}
              options={getIconOptions()}
              onChange={(e) => setIcon(e.value)}
              optionLabel="label"
              optionValue="value"
              itemTemplate={iconItemTemplate}
              valueTemplate={(option) => option ? iconItemTemplate(option) : <span>{t('events.placeholders.icon', 'Select icon')}</span>}
              placeholder={t('events.placeholders.icon', 'Select icon')}
              className="flex-1"
            />
            {icon && <i className={`${icon} text-xl`}></i>}
          </div>
        </div>

        {/* Color dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('events.fields.color', 'Color')}</label>
          <div className="flex gap-2 items-center">
            <Dropdown
              value={color}
              options={getColorOptions()}
              onChange={(e) => setColor(e.value)}
              optionLabel="label"
              optionValue="value"
              itemTemplate={colorItemTemplate}
              valueTemplate={(option) => option ? colorItemTemplate(option) : <span>{t('events.placeholders.color', 'Select color')}</span>}
              placeholder={t('events.placeholders.color', 'Select color')}
              className="flex-1"
            />
          </div>
        </div>

        {/* Render one description input per configured language plus any added languages */}
        {(() => {
          const configuredLangs = Object.keys((i18n as any).options.resources || { en: {} });
          const renderedLangs = Array.from(new Set([...(configuredLangs || []), ...Object.keys(descriptions)]));
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

              <label className="block text-xs font-medium text-gray-600 mb-1">{t(`events.fields.description_${lng}`, `Description (${lng})`)}</label>
              <InputTextarea
                value={descriptions[lng] || ''}
                onChange={(e) => setDescriptions((prev) => ({ ...prev, [lng]: (e.target as HTMLTextAreaElement).value }))}
                onFocus={() => lng === 'ar' && setActiveKeyboardField(`description-${lng}`)}
                className="w-full p-inputtextarea-sm"
                placeholder={t(`events.placeholders.description_${lng}`, `Description (${lng})`)}
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
            <Button type="submit" label={editingId ? t('events.actions.update', 'Update') : t('events.actions.add', 'Add')} icon="pi pi-check" />
            <Button type="button" label={t('events.actions.cancel', 'Cancel')} className="p-button-outlined" onClick={() => setDialogVisible(false)} />
          </div>
        </form>
      </Dialog>

      <div>
        {events.length === 0 ? (
          <div className="text-sm text-gray-500">{t('events.empty', 'No events yet')}</div>
        ) : (
          <DataTable value={events} responsiveLayout="scroll">
            <Column field="status" header={t('events.table.status', 'Status')} />
            <Column field="date" header={t('events.table.date', 'Date')} />
            <Column field="description" header={t('events.table.description', 'Description')} />
            <Column header={t('events.table.icon', 'Icon')} body={iconBodyTemplate} style={{ width: '150px' }} />
            <Column header={t('events.table.color', 'Color')} body={colorBodyTemplate} style={{ width: '150px' }} />
            <Column header={t('events.table.hidden', 'Status')} body={(rowData: Event) => (rowData.hidden ? <span className="text-red-600 font-semibold">{t('common.hidden', 'Hidden')}</span> : <span className="text-green-600 font-semibold">{t('common.visible', 'Visible')}</span>)} style={{ width: '100px' }} />
            <Column header={t('events.table.actions', 'Actions')} body={actionBodyTemplate} style={{ width: '200px' }} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
