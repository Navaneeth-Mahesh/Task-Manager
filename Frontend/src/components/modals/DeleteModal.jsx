import { Modal } from '../ui/Modal'
import { useApp } from '../../context/AppContext'
import { RiErrorWarningLine } from 'react-icons/ri'
import { useState } from 'react'

export function DeleteModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
}) {
  const { deleteTask } = useApp()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!taskId) return

    try {
      setLoading(true)

      await deleteTask(taskId)

      onClose()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to delete task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      size="sm"
    >
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-status-danger/10 border border-status-danger/20 flex items-center justify-center mx-auto">
          <RiErrorWarningLine
            size={22}
            className="text-status-danger"
          />
        </div>

        <div>
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete{' '}
            <span className="text-white font-medium">
              "{taskTitle}"
            </span>
            ?
          </p>

          <p className="text-xs text-text-muted mt-1">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={onClose}
            className="btn-ghost"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-status-danger/10 border border-status-danger/30 text-status-danger hover:bg-status-danger/20 font-medium text-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </Modal>
  )
}