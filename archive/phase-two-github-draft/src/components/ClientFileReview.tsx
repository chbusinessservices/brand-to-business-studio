import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface FileVersionItem {
  id: string;
  file_name: string;
  file_path: string;
  version_number: number;
  review_status: 'pending' | 'approved' | 'revision_requested';
  feedback?: string;
  created_at: string;
}

interface ClientFileReviewProps {
  file: FileVersionItem;
  onStatusUpdated: () => void;
}

export function ClientFileReview({ file, onStatusUpdated }: ClientFileReviewProps) {
  const [feedback, setFeedback] = useState(file.feedback || '');
  const [submitting, setSubmitting] = useState(false);

  async function handleReviewAction(status: 'approved' | 'revision_requested') {
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('file_versions')
        .update({
          review_status: status,
          feedback: feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', file.id);

      if (error) throw error;
      onStatusUpdated();
    } catch (err: any) {
      alert(`Error updating review status: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border rounded-xl p-4 bg-card shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-sm">{file.file_name}</h4>
          <p className="text-xs text-muted-foreground">
            Version {file.version_number} · Uploaded {new Date(file.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${
          file.review_status === 'approved' ? 'bg-green-100 text-green-800' :
          file.review_status === 'revision_requested' ? 'bg-amber-100 text-amber-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {file.review_status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Client Feedback / Notes</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Leave notes or requested changes here..."
          className="w-full text-sm border rounded-lg p-2.5 bg-background"
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <button
          onClick={() => handleReviewAction('revision_requested')}
          disabled={submitting}
          className="px-3 py-1.5 text-xs font-medium border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
        >
          Request Revision
        </button>
        <button
          onClick={() => handleReviewAction('approved')}
          disabled={submitting}
          className="px-4 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          {submitting ? 'Saving...' : 'Approve Deliverable'}
        </button>
      </div>
    </div>
  );
}
