import React, { useState } from 'react';
import { AttachMoneyOutlined as RevenueIcon } from '@mui/icons-material';
import { useAppDispatch } from '../../../app/hooks';
import { updateSection } from '../../businessModel/slice';
import { RevenueModel } from '../../businessModel/types';
import BuilderSection from '../components/BuilderSection';
import FieldRow from '../components/FieldRow';

interface RevenueSectionProps {
  businessId: string;
  data: RevenueModel;
}

function computeCompleteness(d: RevenueModel): number {
  const fields = [
    d.pricingModel,
    d.revenueStreams,
    d.averageTransactionValue !== null ? String(d.averageTransactionValue) : '',
    d.expectedSalesVolume,
  ];
  const filled = fields.filter((f) => f.trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

const RevenueSection: React.FC<RevenueSectionProps> = ({ businessId, data }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RevenueModel>(data);

  const handleEdit = () => {
    setDraft(data);
    setEditing(true);
  };

  const handleSave = () => {
    dispatch(updateSection({ businessId, section: 'revenue', data: draft }));
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const updateField = (field: keyof RevenueModel) => (value: string) =>
    setDraft((prev) => ({
      ...prev,
      [field]: field === 'averageTransactionValue' ? (value === '' ? null : Number(value)) : value,
    }));

  const display = editing ? draft : data;

  return (
    <BuilderSection
      title="Revenue Model"
      subtitle="How the business makes money"
      icon={<RevenueIcon fontSize="small" />}
      iconColor="#059669"
      isEditing={editing}
      completeness={computeCompleteness(data)}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <FieldRow
        label="Pricing Model"
        value={display.pricingModel}
        editing={editing}
        onChange={updateField('pricingModel')}
        placeholder="e.g. Subscription, transactional, retainer, freemium"
      />
      <FieldRow
        label="Revenue Streams"
        value={display.revenueStreams}
        editing={editing}
        onChange={updateField('revenueStreams')}
        placeholder="List all sources of revenue"
        multiline
        rows={2}
      />
      <FieldRow
        label="Avg. Transaction Value"
        value={display.averageTransactionValue}
        editing={editing}
        onChange={updateField('averageTransactionValue')}
        placeholder="0"
        type="number"
        prefix="$"
        hint={editing ? 'Average value per sale or transaction' : undefined}
      />
      <FieldRow
        label="Expected Sales Volume"
        value={display.expectedSalesVolume}
        editing={editing}
        onChange={updateField('expectedSalesVolume')}
        placeholder="e.g. 200 orders/month, 15 clients/quarter"
      />
    </BuilderSection>
  );
};

export default RevenueSection;
