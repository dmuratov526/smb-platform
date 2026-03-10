import React, { useState } from 'react';
import { LocalOfferOutlined as OfferIcon } from '@mui/icons-material';
import { useAppDispatch } from '../../../app/hooks';
import { updateSection } from '../../businessModel/slice';
import { OfferConfig } from '../../businessModel/types';
import BuilderSection from '../components/BuilderSection';
import FieldRow from '../components/FieldRow';

interface OfferSectionProps {
  businessId: string;
  data: OfferConfig;
}

function computeCompleteness(d: OfferConfig): number {
  const fields = [d.productName, d.valueProposition, d.keyFeatures, d.pricingApproach];
  const filled = fields.filter((f) => f.trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

const OfferSection: React.FC<OfferSectionProps> = ({ businessId, data }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<OfferConfig>(data);

  const handleEdit = () => {
    setDraft(data);
    setEditing(true);
  };

  const handleSave = () => {
    dispatch(updateSection({ businessId, section: 'offer', data: draft }));
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const update = (field: keyof OfferConfig) => (value: string) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const display = editing ? draft : data;

  return (
    <BuilderSection
      title="Offer"
      subtitle="What the business sells"
      icon={<OfferIcon fontSize="small" />}
      iconColor="#7C3AED"
      isEditing={editing}
      completeness={computeCompleteness(data)}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <FieldRow
        label="Product / Service Name"
        value={display.productName}
        editing={editing}
        onChange={update('productName')}
        placeholder="What is your core product or service?"
      />
      <FieldRow
        label="Value Proposition"
        value={display.valueProposition}
        editing={editing}
        onChange={update('valueProposition')}
        placeholder="Why do customers choose you over alternatives?"
        multiline
        rows={2}
      />
      <FieldRow
        label="Key Features"
        value={display.keyFeatures}
        editing={editing}
        onChange={update('keyFeatures')}
        placeholder="List the standout features or differentiators"
        multiline
        rows={2}
      />
      <FieldRow
        label="Pricing Approach"
        value={display.pricingApproach}
        editing={editing}
        onChange={update('pricingApproach')}
        placeholder="e.g. Premium, competitive, value-based"
      />
    </BuilderSection>
  );
};

export default OfferSection;
