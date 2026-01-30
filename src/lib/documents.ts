export const DOCUMENT_CATEGORIES = [
    { id: 'id_document', label: 'Personalausweis/Reisepass', required: true },
    { id: 'income_proof', label: 'Einkommensnachweise (3 Monate)', required: true },
    { id: 'bank_statements', label: 'Kontoauszüge (3 Monate)', required: true },
    { id: 'employment_contract', label: 'Arbeitsvertrag', required: false },
    { id: 'tax_return', label: 'Steuerbescheid', required: false },
    { id: 'property_documents', label: 'Grundbuchauszug', required: false },
    { id: 'other', label: 'Sonstige Unterlagen', required: false },
];

export const getCategoryLabel = (type: string) => {
    const category = DOCUMENT_CATEGORIES.find(cat => cat.id === type);
    return category?.label || type;
};
