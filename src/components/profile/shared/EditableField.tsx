"use client";

import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import { cn } from '@/lib/utils';
import { EditableFieldProps } from '@/types/profile';

export const EditableField: React.FC<EditableFieldProps> = ({
    value,
    onChange,
    onSave,
    onCancel,
    isEditing,
    isLoading = false,
    error,
    config
}) => {
    const renderInput = () => {
        const commonProps = {
            id: config.id,
            value,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
            placeholder: config.placeholder,
            disabled: isLoading || config.disabled,
            className: cn(error && "border-destructive"),
            dir: config.type === 'email' || config.type === 'tel' ? 'ltr' : 'rtl'
        };

        if (config.type === 'textarea') {
            return <Textarea {...commonProps} rows={4} />;
        }

        return <Input {...commonProps} type={config.type} />;
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={config.id} className="text-base font-bold text-foreground">
                    {config.label}
                    {config.required && <span className="text-destructive mr-1">*</span>}
                </Label>
            </div>

            {isEditing ? (
                <div className="space-y-2">
                    {renderInput()}
                    {error && (
                        <p className="text-xs text-destructive font-semibold text-right">
                            {error}
                        </p>
                    )}
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            <X className="w-4 h-4 ml-1" />
                            إلغاء
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={onSave}
                            disabled={isLoading}
                        >
                            <Save className="w-4 h-4 ml-1" />
                            حفظ
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-base text-muted-foreground text-right">
                    {value || '-'}
                </div>
            )}
        </div>
    );
};
