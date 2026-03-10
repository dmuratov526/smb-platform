import React, { useState } from 'react';
import { CampaignOutlined as AcquisitionIcon } from '@mui/icons-material';
import { useAppDispatch } from '../../../app/hooks';
import { updateSection } from '../../businessModel/slice';
import { AcquisitionModel } from '../../businessModel/types';
import BuilderSection from '../components/BuilderSection';
import FieldRow from '../components/FieldRow';

interface AcquisitionSectionProps {
  businessId: string;
  data: AcquisitionModel;
}

function computeCompleteness(d: AcquisitionModel): number {
  const fields = [
    d.marketingChannels,
    d.salesModel,
    d.conversionAssumptions,
    d.estimatedAcquisitionCost !== null ? String(d.estimatedAcquisitionCost) : '',
  ];
  const filled = fields.filter((f) => f.trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

const AcquisitionSection: React.FC<AcquisitionSectionProps> = ({ businessId, data }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<AcquisitionModel>(data);

  const handleEdit = () => {
    setDraft(data);
    setEditing(true);
  };

  const handleSave = () => {
    dispatch(updateSection({ businessId, section: 'acquisition', data: draft }));
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const updateField = (field: keyof AcquisitionModel) => (value: string) =>
    setDraft((prev) => ({
      ...prev,
      [field]:
        field === 'estimatedAcquisitionCost' ? (value === '' ? null : Number(value)) : value,
    }));

  const display = editing ? draft : data;

  return (
    <BuilderSection
      title="Acquisition"
      subtitle="How customers are acquired"
      icon={<AcquisitionIcon fontSize="small" />}
      iconColor="#D97706"
      isEditing={editing}
      completeness={computeCompleteness(data)}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <FieldRow
        label="Marketing Channels"
        value={display.marketingChannels}
        editing={editing}
        onChange={updateField('marketingChannels')}
        placeholder="e.g. Instagram, Google Ads, referrals, cold outreach"
        multiline
        rows={2}
      />
      <FieldRow
        label="Sales Model"
        value={display.salesModel}
        editing={editing}
        onChange={updateField('salesModel')}
        placeholder="e.g. Self-serve, consultative, inbound, outbound"
      />
      <FieldRow
        label="Conversion Assumptions"
        value={display.conversionAssumptions}
        editing={editing}
        onChange={updateField('conversionAssumptions')}
        placeholder="e.g. 5% website visitors convert, 20% leads close"
        multiline
        rows={2}
      />
      <FieldRow
        label="Est. Acquisition Cost"
        value={display.estimatedAcquisitionCost}
        editing={editing}
        onChange={updateField('estimatedAcquisitionCost')}
        placeholder="0"
        type="number"
        prefix="$"
        hint={editing ? 'Average cost to acquire one customer' : undefined}
      />
    </BuilderSection>
  );
};

export default AcquisitionSection;
