import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputTextarea } from 'primereact/inputtextarea';
import axiosClient from '../../api/axiosClient';

interface OrganizationClaim {
  id: number;
  company: string;
  email: string;
  phone: string;
  address: string;
  content: string;
  status: 'pending' | 'answered' | 'archived';
  answer?: string;
  files?: string[];
  created_at: string;
  answered_at?: string;
}

const OrganizationClaimPage: React.FC = () => {
  const [claims, setClaims] = useState<OrganizationClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAnswerDialog, setShowAnswerDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<OrganizationClaim | null>(null);
  const [answer, setAnswer] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  const toastRef = useRef<Toast>(null);

  const fetchClaims = async (status?: string) => {
    try {
      setLoading(true);
      const url = status ? `/admin/claims/organization?status=${status}` : '/admin/claims/organization';
      const response = await axiosClient.get(url);
      setClaims(response.data.data);
    } catch (error) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch claims',
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

  const handleViewDetails = (claim: OrganizationClaim) => {
    setSelectedClaim(claim);
    setShowDetailDialog(true);
  };

  const handleAnswerClick = (claim: OrganizationClaim) => {
    setSelectedClaim(claim);
    setAnswer('');
    setShowAnswerDialog(true);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedClaim || !answer.trim()) {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please provide an answer',
      });
      return;
    }

    try {
      setAnswerLoading(true);
      await axiosClient.put(`/admin/claims/organization/${selectedClaim.id}/answer`, {
        answer: answer.trim(),
      });

      toastRef.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Claim answered successfully',
      });

      setShowAnswerDialog(false);
      fetchClaims(selectedStatus || undefined);
    } catch (error) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to answer claim',
      });
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleDelete = (claim: OrganizationClaim) => {
    confirmDialog({
      message: 'Are you sure you want to delete this claim?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axiosClient.delete(`/admin/claims/organization/${claim.id}`);
          toastRef.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Claim deleted successfully',
          });
          fetchClaims(selectedStatus || undefined);
        } catch (error) {
          toastRef.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete claim',
          });
        }
      },
    });
  };

  const statusTemplate = (rowData: OrganizationClaim) => {
    const statusOptions = {
      pending: 'warning',
      answered: 'success',
      archived: 'info',
    };
    return <Tag value={rowData.status} severity={statusOptions[rowData.status] as any} />;
  };

  const actionTemplate = (rowData: OrganizationClaim) => {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => handleViewDetails(rowData)}
          tooltip="View Details"
        />
        {rowData.status === 'pending' && (
          <Button
            icon="pi pi-reply"
            className="p-button-rounded p-button-success p-button-sm"
            onClick={() => handleAnswerClick(rowData)}
            tooltip="Answer"
          />
        )}
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => handleDelete(rowData)}
          tooltip="Delete"
        />
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <div style={{ marginBottom: '1rem' }}>
        <h1>Organization Claims</h1>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Dropdown
            value={selectedStatus}
            options={[
              { label: 'All', value: '' },
              { label: 'Pending', value: 'pending' },
              { label: 'Answered', value: 'answered' },
              { label: 'Archived', value: 'archived' },
            ]}
            onChange={(e) => handleStatusChange(e.value)}
            placeholder="Filter by status"
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
        <Column field="id" header="ID" style={{ width: '80px' }} />
        <Column field="reference_number" header="Ref #" style={{ width: '140px' }} />
        <Column field="company" header="Organization" />
        <Column field="email" header="Email" />
        <Column field="phone" header="Phone" style={{ width: '120px' }} />
        <Column field="status" header="Status" body={statusTemplate} />
        <Column field="created_at" header="Created" style={{ width: '150px' }} />
        <Column body={actionTemplate} header="Actions" style={{ width: '150px' }} />
      </DataTable>

      {/* Detail Dialog */}
      <Dialog
        visible={showDetailDialog}
        onHide={() => setShowDetailDialog(false)}
        header={`Claim Details - ${selectedClaim?.company}`}
        modal
        style={{ width: '90vw', maxWidth: '800px' }}
      >
        {selectedClaim && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h3>Organization Information</h3>
              <p><strong>Organization:</strong> {selectedClaim.company}</p>
              <p><strong>Email:</strong> {selectedClaim.email}</p>
              <p><strong>Phone:</strong> {selectedClaim.phone}</p>
              <p><strong>Address:</strong> {selectedClaim.address}</p>
            </div>

            <hr />

            <div style={{ marginBottom: '1rem' }}>
              <h3>Claim Content</h3>
              <p>{selectedClaim.content}</p>
            </div>

            {selectedClaim.answer && (
              <>
                <hr />
                <div style={{ marginBottom: '1rem' }}>
                  <h3>Our Response</h3>
                  <p>{selectedClaim.answer}</p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Answered on: {new Date(selectedClaim.answered_at || '').toLocaleString()}
                  </p>
                </div>
              </>
            )}

            {selectedClaim.files && selectedClaim.files.length > 0 && (
              <>
                <hr />
                <div>
                  <h3>Attached Files</h3>
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
        header="Answer Claim"
        modal
        style={{ width: '90vw', maxWidth: '600px' }}
      >
        <div>
          <label htmlFor="answer" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Your Response *
          </label>
          <InputTextarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            style={{ width: '100%' }}
            placeholder="Enter your response to this claim"
          />
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <Button
              label="Send"
              onClick={handleSubmitAnswer}
              loading={answerLoading}
              icon="pi pi-send"
            />
            <Button
              label="Cancel"
              onClick={() => setShowAnswerDialog(false)}
              className="p-button-secondary"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default OrganizationClaimPage;
