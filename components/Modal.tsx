import React, { ReactNode } from 'react';
import XIcon from './icons/XIcon';
interface ModalProps {
isOpen: boolean;
onClose: () => void;
title: string;
children: ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
if (!isOpen) {
return null;
}
return (
<div
className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
onClick={onClose}
>
<div
className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative"
onClick={(e) => e.stopPropagation()}
>
<div className="flex justify-between items-center border-b pb-3 mb-4">
<h2 className="text-xl font-semibold text-text-main">{title}</h2>
<button
onClick={onClose}
className="text-gray-400 hover:text-gray-600"
>
<XIcon />
</button>
</div>
<div>
{children}
</div>
</div>
</div>
);
};
export default Modal;