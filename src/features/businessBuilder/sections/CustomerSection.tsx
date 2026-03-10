import React, { useState } from 'react';
import { PeopleOutlined as CustomerIcon } from '@mui/icons-material';
import { useAppDispatch } from '../../../app/hooks';
import { updateSection } from '../../businessModel/slice';
import { CustomerConfig } from '../../businessModel/types';
import BuilderSection from '../components/BuilderSection';
import FieldRow from '../components/FieldRow';

interface CustomerSectionProps {
  businessId: string;
  data: CustomerConfig;
}

function computeCompleteness(d: CustomerConfig): number {
  const fields = [d.targetSegment, d.customerProblem, d.willingnessToPay, d.geographicFocus];
  const filled = fields.filter((f) => f.trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

const CustomerSection: React.FC<CustomerSectionProps> = ({ businessId, data }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CustomerConfig>(data);

  const handleEdit = () => {
    setDraft(data);
    setEditing(true);
  };

  const handleSave = () => {
    dispatch(updateSection({ businessId, section: 'customer', data: draft }));
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const update = (field: keyof CustomerConfig) => (value: string) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const display = editing ? draft : data;

  return (
    <BuilderSection
      title="Customer"
      subtitle="Who the business serves"
      icon={<CustomerIcon fontSize="small" />}
      iconColor="#2563EB"
      isEditing={editing}
      completeness={computeCompleteness(data)}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <FieldRow
        label="Target Customer Segment"
        value={display.targetSegment}
        editing={editing}
        onChange={update('targetSegment')}
        placeholder="Who are your primary customers?"
        multiline
        rows={2}
      />
      <FieldRow
        label="Customer Problem"
        value={display.customerProblem}
        editing={editing}
        onChange={update('customerProblem')}
        placeholder="What problem does your business solve for them?"
        multiline
        rows={2}
      />
      <FieldRow
        label="Willingness to Pay"
        value={display.willingnessToPay}
        editing={editing}
        onChange={update('willingnessToPay')}
        placeholder="e.g. $10–$50 per session, $200–$500 per item"
      />
      <FieldRow
        label="Geographic Focus"
        value={display.geographicFocus}
        editing={editing}
        onChange={update('geographicFocus')}
        placeholder="e.g. Local city, national, remote/global"
      />
    </BuilderSection>
  );
};

export default CustomerSection;
