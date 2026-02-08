import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputTextarea } from 'primereact/inputtextarea';
import axiosClient from '../../api/axiosClient';

interface CitizenClaim {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  nin: string;
  address: string;
  content: string;
  status: 'pending' | 'answered' | 'archived';
  answer?: string;
  files?: string[];
  created_at: string;
  answered_at?: string;
}

const CitizenClaimPage: React.FC = () => {
  const { t } = useTranslation();
  const [claims, setClaims] = useState<CitizenClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAnswerDialog, setShowAnswerDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<CitizenClaim | null>(null);
  const [answer, setAnswer] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  const toastRef = useRef<Toast>(null);

  const fetchClaims = async (status?: string) => {
    try {
      setLoading(true);
      const url = status ? `/admin/claims/citizen?status=${status}` : '/admin/claims/citizen';
      const response = await axiosClient.get(url);
      setClaims(response.data.data);
    } catch (error) {
      toastRef.current?.show({
        severity:t('common.error'),
        detail: t('claims.fetchError')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims(selectedStatus || undefined);
  }, [selectedStatus]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleViewDetails = (claim: CitizenClaim) => {
    setSelectedClaim(claim);
    setShowDetailDialog(true);
  };

  const handleAnswerClick = (claim: CitizenClaim) => {
    setSelectedClaim(claim);
    setAnswer('');
    setShowAnswerDialog(true);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedClaim || !answer.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: t('common.warning'),
        detail: t('claims.pleaseProvideAnswer'),
      });
      return;
    }

    try {
      setAnswerLoading(true);
      await axiosClient.put(`/admin/claims/citizen/${selectedClaim.id}/answer`, {
        answer: answer.trim(),
      });

      toastRef.current?.show({
        severity: 'success',
        summary: t('common.success'),
        detail: t('claims.answerSuccess'),
      });

      setShowAnswerDialog(false);
      fetchClaims(selectedStatus || undefined);
    } catch (error) {
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error'),
        detail: t('claims.answerError'),
      });
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleDelete = (claim: CitizenClaim) => {
    confirmDialog({
      message: t('claims.deleteConfirm'),
      header: t('common.confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/admin/claims/citizen/${claim.id}`);
          toastRef.current?.show({
            severity: 'success',
            summary: t('common.success'),
            detail: t('claims.deleteSuccess'),
          });
          fetchClaims(selectedStatus || undefined);
        } catch (error) {
          toastRef.current?.show({
            severity: 'error',
            summary: t('common.error'),
            detail: t('claims.deleteError'),
          });
        }
      },
    });
  };

  const statusTemplate = (rowData: CitizenClaim) => {
    const statusOptions = {
      pending: 'warning',
      answered: 'success',
      archived: 'info',
    };
    return <Tag value={rowData.status} severity={statusOptions[rowData.status] as any} />;
  };

  const actionTemplate = (rowData: CitizenClaim) => {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => handleViewDetails(rowData)}
          tooltip={t('common.viewDetails')}
        />
        {rowData.status === 'pending' && (
          <Button
            icon="pi pi-reply"
            className="p-button-rounded p-button-success p-button-sm"
            onClick={() => handleAnswerClick(rowData)}
            tooltip={t('claims.answer')}
          />
        )}
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => handleDelete(rowData)}
          tooltip={t('common.delete')}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <div style={{ marginBottom: '1rem' }}>
        <h1>{t('claims.citizenClaims')}</h1>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Dropdown
            value={selectedStatus}
            options={[
              { label: t('common.all'), value: '' },
              { label: t('claims.pending'), value: 'pending' },
              { label: t('claims.answered'), value: 'answered' },
              { label: t('claims.archived'), value: 'archived' },
            ]}
            onChange={(e) => handleStatusChange(e.value)}
            placeholder={t('claims.filterByStatus')}
          />
        </div>
      </div>

      <DataTable
        value={claims}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
      >
        <Column field="id" header={t('common.id')} style={{ width: '80px' }} />
        <Column field="reference_number" header={t('common.refNumber')} style={{ width: '140px' }} />
        <Column
          field="firstname"
          header={t('common.name')}
          body={(row) => `${row.firstname} ${row.lastname}`}
        />
        <Column field="email" header={t('common.email')} />
        <Column field="phone" header={t('common.phone')} />
        <Column field="nin" header={t('common.nin')} style={{ width: '120px' }} />
        <Column field="status" header={t('common.status')} body={statusTemplate} />
        <Column field="created_at" header={t('common.created')} style={{ width: '150px' }} />
        <Column body={actionTemplate} header={t('common.actions')} style={{ width: '150px' }} />
      </DataTable>

      {/* Detail Dialog */}
      <Dialog
        visible={showDetailDialog}
        onHide={() => setShowDetailDialog(false)}
        header={`${t('claims.claimDetails')} - ${selectedClaim?.firstname} ${selectedClaim?.lastname}`}
        modal
        style={{ width: '90vw', maxWidth: '800px' }}
      >
        {selectedClaim && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h3>{t('claims.personalInformation')}</h3>
              <p><strong>{t('common.name')}:</strong> {selectedClaim.firstname} {selectedClaim.lastname}</p>
              <p><strong>{t('common.email')}:</strong> {selectedClaim.email}</p>
              <p><strong>{t('common.phone')}:</strong> {selectedClaim.phone}</p>
              <p><strong>{t('common.nin')}:</strong> {selectedClaim.nin}</p>
              <p><strong>{t('common.address')}:</strong> {selectedClaim.address}</p>
            </div>

            <hr />

            <div style={{ marginBottom: '1rem' }}>
              <h3>{t('claims.claimContent')}</h3>
              <p>{selectedClaim.content}</p>
            </div>

            {selectedClaim.answer && (
              <>
                <hr />
                <div style={{ marginBottom: '1rem' }}>
                  <h3>{t('claims.ourResponse')}</h3>
                  <p>{selectedClaim.answer}</p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {t('claims.answeredOn')}: {new Date(selectedClaim.answered_at || '').toLocaleString()}
                  </p>
                </div>
              </>
            )}

            {selectedClaim.files && selectedClaim.files.length > 0 && (
              <>
                <hr />
                <div>
                  <h3>{t('claims.attachedFiles')}</h3>
                  <ul>
                    {selectedClaim.files.map((file, idx) => (
                      <li key={idx}>
                        <a href={file} target="_blank" rel="noopener noreferrer">
                          {file.split('/').pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </Dialog>

      {/* Answer Dialog */}
      <Dialog
        visible={showAnswerDialog}
        onHide={() => setShowAnswerDialog(false)}
        header={t('claims.answerClaim')}
        modal
        style={{ width: '90vw', maxWidth: '600px' }}
      >
        <div>
          <label htmlFor="answer" style={{ display: 'block', marginBottom: '0.5rem' }}>
            {t('claims.yourResponse')} *
          </label>
          <InputTextarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            style={{ width: '100%' }}
            placeholder={t('claims.enterResponse')}
          />
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <Button
              label={t('common.send')}
              onClick={handleSubmitAnswer}
              loading={answerLoading}
              icon="pi pi-send"
            />
            <Button
              label={t('common.cancel')}
              onClick={() => setShowAnswerDialog(false)}
              className="p-button-secondary"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CitizenClaimPage;
