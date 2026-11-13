import React from 'react';
import {
  AlertTriangle,
  Download,
  FileDown,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { EXPORT_CONTENT, NAV_TABS } from '../../data/content';
import {
  exportElementAsPdf,
  exportElementAsPng,
  exportSectionsAsOnePdf,
} from '../../lib/exportUtils';
import { mergeWithDefaults } from '../../lib/storage';
import { toDateKey } from '../../lib/utils';
import type { DesignDojoState, TabId } from '../../types/dojo';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface ExportTabProps {
  state: DesignDojoState;
  activeTab: TabId;
  tabContainerRef: React.RefObject<HTMLDivElement | null>;
  printSectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onReplaceState: (next: DesignDojoState) => void;
  onResetAll: () => void;
}

export function ExportTab({
  state,
  activeTab,
  tabContainerRef,
  printSectionRefs,
  onReplaceState,
  onResetAll,
}: ExportTabProps) {
  const [busyAction, setBusyAction] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [resetOpen, setResetOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentTabSlug = NAV_TABS.find((t) => t.id === activeTab)?.id ?? 'export';

  const handleExportTabPdf = async () => {
    if (!tabContainerRef.current) return;
    setBusyAction('pdf');
    setFeedback(null);
    try {
      await exportElementAsPdf(tabContainerRef.current, currentTabSlug);
      setFeedback({ type: 'success', text: 'PDF downloaded.' });
    } catch {
      setFeedback({ type: 'error', text: 'Could not generate PDF. Try again or use Print.' });
    } finally {
      setBusyAction(null);
    }
  };

  const handleExportTabPng = async () => {
    if (!tabContainerRef.current) return;
    setBusyAction('png');
    setFeedback(null);
    try {
      await exportElementAsPng(tabContainerRef.current, currentTabSlug);
      setFeedback({ type: 'success', text: 'PNG image downloaded.' });
    } catch {
      setFeedback({ type: 'error', text: 'Could not generate PNG image.' });
    } finally {
      setBusyAction(null);
    }
  };

  const handleExportAllPdf = async () => {
    const sections = printSectionRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (sections.length === 0) return;
    setBusyAction('all-pdf');
    setFeedback(null);
    try {
      await exportSectionsAsOnePdf(sections, 'all-tabs');
      setFeedback({ type: 'success', text: 'Complete Design Dojo PDF downloaded.' });
    } catch {
      setFeedback({ type: 'error', text: 'Could not generate full PDF.' });
    } finally {
      setBusyAction(null);
    }
  };

  const handleBackupJson = () => {
    try {
      const json = JSON.stringify(state, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `design-dojo-backup-${toDateKey()}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setFeedback({ type: 'success', text: 'Backup JSON downloaded.' });
    } catch {
      setFeedback({ type: 'error', text: 'Failed to create backup file.' });
    }
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFeedback(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }
      const merged = mergeWithDefaults(parsed);
      onReplaceState(merged);
      setFeedback({ type: 'success', text: 'Backup restored successfully.' });
    } catch {
      setFeedback({ type: 'error', text: 'Invalid backup file. Please choose a valid Design Dojo JSON.' });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmReset = () => {
    onResetAll();
    setResetOpen(false);
    setFeedback({ type: 'success', text: 'All local data reset to defaults.' });
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          role="status"
          className={
            feedback.type === 'success'
              ? 'rounded-2xl border border-[#0b3d2e]/20 bg-[#e6eee9] px-5 py-3.5 text-sm font-medium text-[#0b3d2e]'
              : 'rounded-2xl border border-[#b91c1c]/30 bg-[#fee2e2] px-5 py-3.5 text-sm font-medium text-[#991b1b]'
          }
        >
          {feedback.text}
        </div>
      )}

      {/* Export PDF & PNG */}
      <Card>
        <CardHeader>
          <CardTitle>{EXPORT_CONTENT.pdfPngTitle}</CardTitle>
          <CardDescription>{EXPORT_CONTENT.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              type="button"
              variant="default"
              onClick={handleExportTabPdf}
              disabled={busyAction !== null}
              className="w-full"
            >
              <FileText className="h-4 w-4" />
              {busyAction === 'pdf' ? 'Generating...' : EXPORT_CONTENT.downloadTabPdfLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExportTabPng}
              disabled={busyAction !== null}
              className="w-full"
            >
              <ImageIcon className="h-4 w-4" />
              {busyAction === 'png' ? 'Generating...' : EXPORT_CONTENT.downloadTabPngLabel}
            </Button>
            <Button
              type="button"
              variant="amber"
              onClick={handleExportAllPdf}
              disabled={busyAction !== null}
              className="w-full"
            >
              <FileDown className="h-4 w-4" />
              {busyAction === 'all-pdf' ? 'Building PDF...' : EXPORT_CONTENT.downloadAllPdfLabel}
            </Button>
          </div>
          <p className="text-xs text-[#52615a]">
            Tip: You can also tap the download icon in the top-right corner of any tab to export that tab directly as PDF or PNG.
          </p>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle>{EXPORT_CONTENT.backupTitle}</CardTitle>
          <CardDescription>{EXPORT_CONTENT.backupDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="default" onClick={handleBackupJson} className="sm:w-auto">
            <Download className="h-4 w-4" />
            {EXPORT_CONTENT.backupButton}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleRestoreFile}
            className="hidden"
            aria-label="Upload JSON backup"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="sm:w-auto"
          >
            <Upload className="h-4 w-4" />
            {EXPORT_CONTENT.restoreButton}
          </Button>
        </CardContent>
      </Card>

      {/* Reset All Data */}
      <Card className="border-[#b91c1c]/25">
        <CardHeader>
          <CardTitle className="text-[#991b1b]">{EXPORT_CONTENT.resetTitle}</CardTitle>
          <CardDescription>{EXPORT_CONTENT.resetDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setResetOpen(true)}
          >
            <RotateCcw className="h-4 w-4" />
            {EXPORT_CONTENT.resetButton}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-[#b91c1c]">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <DialogTitle>{EXPORT_CONTENT.resetConfirmTitle}</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {EXPORT_CONTENT.resetConfirmBody}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setResetOpen(false)}>
              {EXPORT_CONTENT.resetCancelAction}
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmReset}>
              {EXPORT_CONTENT.resetConfirmAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
