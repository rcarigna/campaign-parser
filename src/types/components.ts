// Centralized component prop types for reusability

import { EntityKind, EntityWithId } from "./campaign";

export type FileUploadProps = {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    error: string | null;
    allowedExtensions: readonly string[];
};

export type ActionButtonsProps = {

    selectedFile: File | null;
    loading: boolean;
    onProcess: (file: File) => Promise<void>;
    onReset: () => void;
};


export type ProcessingWorkflowProps = {
    selectedFile: File | null;
    loading: boolean;
    error: string | null;
    hasContent: boolean; // New prop to determine if content is loaded
    onFileSelect: (file: File) => void;
    onProcess: (file: File) => Promise<void>;
    onReset: () => void;
    onClearError: () => void;
    additionalLoading?: boolean;
    additionalLoadingMessage?: string;
};
export type EntityCardProps = {
    entity: EntityWithId;
    isDuplicate: boolean;
    missingFields: string[];
    onClick: (entity: EntityWithId) => void;
    isSelectable?: boolean;
    isSelected?: boolean;
    onSelect?: (entityId: string, isSelected: boolean) => void;
    onDiscard?: (entity: EntityWithId) => void;
};

export type PrimaryEntitySelectorProps = {
    entities: EntityWithId[];
    primaryEntityId: string;
    setPrimaryEntityId: (id: string) => void;
    renderEntityDetail: (
        entity: EntityWithId,
        field: string,
        label: string
    ) => React.ReactNode;
};
export type ModalFooterProps = {
    onCancel: () => void;
    onConfirm: () => void;
    confirmLabel: string;
    cancelLabel?: string;
    disabled?: boolean;
};

export type ModalHeaderProps = {
    title: string;
    onClose: () => void;
};


export type MergedEntityPreviewProps = {
    primaryEntity: EntityWithId | undefined;
    allFields: string[];
    mergedFields: Record<string, unknown>;
};



export type InsufficientEntitiesMessageProps = {
    onClose: () => void;
};

export type FieldMergeSectionProps = {
    allFields: string[];
    getFieldValues: (
        fieldName: string
    ) => Array<{ entityId: string; entityTitle: string; value: string }>;
    onFieldChange: (fieldName: string, value: string) => void;
    entityKind: EntityKind;
};


export type FieldMergeGroupProps = {
    fieldName: string;
    fieldValues: Array<{ entityId: string; entityTitle: string; value: string }>;
    entityKind: EntityKind;
    onChange: (value: unknown) => void;
};

export type TextAreaFieldProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
};
