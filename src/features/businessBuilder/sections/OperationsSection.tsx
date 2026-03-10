import React, { useState } from 'react';
import { SettingsOutlined as OpsIcon } from '@mui/icons-material';
import { useAppDispatch } from '../../../app/hooks';
import { updateSection } from '../../businessModel/slice';
import { OperationsModel } from '../../businessModel/types';
import BuilderSection from '../components/BuilderSection';
import FieldRow from '../components/FieldRow';

interface OperationsSectionProps {
  businessId: string;
  data: OperationsModel;
}

function computeCompleteness(d: OperationsModel): number {
  const fields = [
    d.teamStructure,
    d.keyResources,
    d.suppliersOrPartners,
    d.operationalComplexity,
    d.capacityConstraints,
  ];
  const filled = fields.filter((f) => f.trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

const OperationsSection: React.FC<OperationsSectionProps> = ({ businessId, data }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<OperationsModel>(data);

  const handleEdit = () => {
    setDraft(data);
    setEditing(true);
  };

  const handleSave = () => {
    dispatch(updateSection({ businessId, section: 'operations', data: draft }));
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const update = (field: keyof OperationsModel) => (value: string) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const display = editing ? draft : data;

  return (
    <BuilderSection
      title="Operations"
      subtitle="How the business operates"
      icon={<OpsIcon fontSize="small" />}
      iconColor="#0891B2"
      isEditing={editing}
      completeness={computeCompleteness(data)}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <FieldRow
        label="Team Structure"
        value={display.teamStructure}
        editing={editing}
        onChange={update('teamStructure')}
        placeholder="Describe roles and headcount"
        multiline
        rows={2}
      />
      <FieldRow
        label="Key Resources"
        value={display.keyResources}
        editing={editing}
        onChange={update('keyResources')}
        placeholder="Equipment, tools, software, facilities needed"
        multiline
        rows={2}
      />
      <FieldRow
        label="Suppliers / Partners"
        value={display.suppliersOrPartners}
        editing={editing}
        onChange={update('suppliersOrPartners')}
        placeholder="Key vendors, suppliers, or strategic partners"
      />
      <FieldRow
        label="Operational Complexity"
        value={display.operationalComplexity}
        editing={editing}
        onChange={update('operationalComplexity')}
        placeholder="e.g. Low / moderate / high — brief description"
      />
      <FieldRow
        label="Capacity Constraints"
        value={display.capacityConstraints}
        editing={editing}
        onChange={update('capacityConstraints')}
        placeholder="What limits output or growth in the near term?"
      />
    </BuilderSection>
  );
};

export default OperationsSection;
