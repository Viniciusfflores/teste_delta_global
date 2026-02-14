import { Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmModal = ({
   message,
    onConfirm, 
    onCancel,
    isLoading = false,
  }: ConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[200] flex justify-center items-center"
      onClick={!isLoading ? onCancel : undefined}
    >
      <div
        className="bg-white w-full max-w-[400px] rounded-xl shadow-lg overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
          <h2 className="font-['DM_Sans',sans-serif] text-lg font-bold m-0">Confirmação</h2>
          <button
            className="border-none bg-transparent cursor-pointer text-slate-400 p-1 transition-colors hover:text-red-500"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              className="px-5 py-2.5 rounded-lg border-none bg-red-500 text-white text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-red-600"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};