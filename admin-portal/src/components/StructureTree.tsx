import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { structureService, Structure, StructureLabel } from '../api/structureService';
import styles from './StructureTree.module.css';

interface FormData {
  label: StructureLabel;
  code: string;
  id_parent: number | null;
}

interface TreeItem extends Structure {
  children?: TreeItem[];
  isExpanded?: boolean;
}

export const StructureTree: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useRef<Toast>(null);
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    label: { en: '', fr: '', ar: '', es: '' },
    code: '',
    id_parent: null,
  });
  const [structures, setStructures] = useState<Structure[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Set<number>>(new Set());

  const buildTree = useCallback((structures: Structure[], parentId: number | null = null): TreeItem[] => {
    return structures
      .filter(s => s.id_parent === parentId)
      .map(s => ({
        ...s,
        children: buildTree(structures, s.id),
        isExpanded: true,
      }));
  }, []);

  const loadStructures = useCallback(async () => {
    try {
      setLoading(true);
      const allStructures = await structureService.getAll();
      setStructures(allStructures);

      // Build tree structure
      const tree = buildTree(allStructures);
      setTreeData(tree);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: t('common.error'),
        detail: t('structures.errorFetch'),
      });
    } finally {
      setLoading(false);
    }
  }, [buildTree, t]);

  useEffect(() => {
    loadStructures();
  }, [loadStructures]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedKeys(newExpanded);
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({ label: { en: '', fr: '', ar: '', es: '' }, code: '', id_parent: null });
    setShowDialog(true);
  };

  const openEditDialog = (structure: Structure) => {
    setEditingId(structure.id);
    setFormData({
      label: structure.label,
      code: structure.code,
      id_parent: structure.id_parent,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.label.en.trim() || !formData.code.trim()) {
        toast.current?.show({
          severity: 'warn',
          summary: t('common.validation'),
          detail: t('structures.labelRequired'),
        });
        return;
      }

      // Convert label object to JSON string for API
      const dataToSend = {
        ...formData,
        label: JSON.stringify(formData.label),
      };

      if (editingId) {
        await structureService.update(editingId, dataToSend);
        toast.current?.show({
          severity: 'success',
          summary: t('common.success'),
          detail: t('structures.updateSuccess'),
        });
      } else {
        await structureService.create(dataToSend);
        toast.current?.show({
          severity: 'success',
          summary: t('common.success'),
          detail: t('structures.createSuccess'),
        });
      }

      setShowDialog(false);
      loadStructures();
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: t('common.error'),
        detail: error.response?.data?.message || t('structures.errorSave'),
      });
    }
  };

  const handleDelete = (structure: Structure) => {
    const labelText = structureService.getLabel(structure.label, i18n.language);
    confirmDialog({
      message: `${t('structures.confirmDelete')} "${labelText}"?`,
      header: t('common.confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await structureService.delete(structure.id);
          toast.current?.show({
            severity: 'success',
            summary: t('common.success'),
            detail: t('structures.deleteSuccess'),
          });
          loadStructures();
        } catch (error: any) {
          toast.current?.show({
            severity: 'error',
            summary: t('common.error'),
            detail: error.response?.data?.message || t('structures.errorDelete'),
          });
        }
      },
    });
  };

  const renderTreeNode = (item: TreeItem, level: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedKeys.has(item.id);
    const labelText = structureService.getLabel(item.label, i18n.language);

    return (
      <div key={item.id} className={styles.treeNode}>
        <div className={styles.nodeContent} style={{ paddingLeft: `${level * 24}px` }}>
          {hasChildren && (
            <button
              className={styles.expandButton}
              onClick={() => toggleExpand(item.id)}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <i className={`pi ${isExpanded ? 'pi-chevron-down' : 'pi-chevron-right'}`}></i>
            </button>
          )}
          {!hasChildren && <span className={styles.noExpandButton}></span>}

          <div className={styles.nodeLabel}>
            <span className={styles.label}>{labelText}</span>
            <span className={styles.code}>{item.code}</span>
          </div>

          <div className={styles.nodeActions}>
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-warning p-button-sm"
              onClick={() => openEditDialog(item)}
              tooltip="Edit"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger p-button-sm"
              onClick={() => handleDelete(item)}
              tooltip="Delete"
              tooltipOptions={{ position: 'top' }}
            />
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className={styles.childrenContainer}>
            {item.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const toolbar = (
    <Toolbar
      left={
        <Button
          label={t('structures.newStructure')}
          icon="pi pi-plus"
          onClick={openCreateDialog}
        />
      }
    />
  );

  const parentOptions = structures
    .filter((s) => s.id !== editingId)
    .map((s) => ({
      label: structureService.getLabel(s.label, i18n.language),
      value: s.id,
    }));

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className={styles.header}>
        <h1>{t('structures.title')}</h1>
        <p>{t('structures.description')}</p>
      </div>

      {toolbar}

      <div className={styles.treeContainer}>
        {loading ? (
          <p className={styles.loading}>{t('common.loading')}</p>
        ) : treeData.length === 0 ? (
          <p className={styles.empty}>{t('common.noData')}</p>
        ) : (
          treeData.map(item => renderTreeNode(item))
        )}
      </div>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={editingId ? t('structures.editTitle') : t('structures.createTitle')}
        modal
        className={styles.dialog}
        footer={
          <>
            <Button
              label={t('structures.cancel')}
              icon="pi pi-times"
              onClick={() => setShowDialog(false)}
              className="p-button-text"
            />
            <Button
              label={t('structures.save')}
              icon="pi pi-check"
              onClick={handleSave}
              className="p-button-success"
            />
          </>
        }
      >
        <div className={styles.formGroup}>
          <label htmlFor="label-en">{t('structures.fields.label')} (English) *</label>
          <InputText
            id="label-en"
            value={formData.label.en}
            onChange={(e) =>
              setFormData({ ...formData, label: { ...formData.label, en: e.target.value } })
            }
            placeholder="Enter English label"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="label-fr">{t('structures.fields.label')} (Français)</label>
          <InputText
            id="label-fr"
            value={formData.label.fr}
            onChange={(e) =>
              setFormData({ ...formData, label: { ...formData.label, fr: e.target.value } })
            }
            placeholder="Entrez l'étiquette française"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="label-ar">{t('structures.fields.label')} (العربية)</label>
          <InputText
            id="label-ar"
            value={formData.label.ar}
            onChange={(e) =>
              setFormData({ ...formData, label: { ...formData.label, ar: e.target.value } })
            }
            placeholder="أدخل التسمية العربية"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="label-es">{t('structures.fields.label')} (Español)</label>
          <InputText
            id="label-es"
            value={formData.label.es}
            onChange={(e) =>
              setFormData({ ...formData, label: { ...formData.label, es: e.target.value } })
            }
            placeholder="Ingrese la etiqueta española"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="code">{t('structures.fields.code')} *</label>
          <InputText
            id="code"
            value={formData.code}
            onChange={(e) =>
              setFormData({
                ...formData,
                code: e.target.value.toUpperCase(),
              })
            }
            placeholder={t('structures.placeholders.code')}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="parent">{t('structures.fields.id_parent')}</label>
          <Dropdown
            id="parent"
            value={formData.id_parent}
            onChange={(e) =>
              setFormData({ ...formData, id_parent: e.value })
            }
            options={parentOptions}
            optionLabel="label"
            optionValue="value"
            placeholder={t('structures.selectParent')}
            showClear
            className={styles.dropdown}
          />
        </div>
      </Dialog>
    </div>
  );
};
