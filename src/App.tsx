import React from 'react';
import {
  BookOpen,
  CalendarDays,
  Check,
  CheckSquare,
  Compass,
  Download,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  Layers,
  Sun,
  Target,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PrintAllView } from './components/PrintAllView';
import { ChecklistsTab } from './components/tabs/ChecklistsTab';
import { ExportTab } from './components/tabs/ExportTab';
import { FactSheetTab } from './components/tabs/FactSheetTab';
import { LogsTab } from './components/tabs/LogsTab';
import { PlanTab } from './components/tabs/PlanTab';
import { PracticeTab } from './components/tabs/PracticeTab';
import { TodayTab } from './components/tabs/TodayTab';
import { APP_META, NAV_TABS } from './data/content';
import { exportElementAsPdf, exportElementAsPng } from './lib/exportUtils';
import { clearDojoState, loadDojoState, saveDojoState } from './lib/storage';
import { cn, prefersReducedMotion } from './lib/utils';
import type { DesignDojoState, TabId } from './types/dojo';

const TAB_ICONS: Record<TabId, React.ComponentType<{ className?: string }>> = {
  today: Sun,
  checklists: CheckSquare,
  practice: Target,
  logs: BookOpen,
  export: Download,
  plan: CalendarDays,
  'fact-sheet': FileCheck2,
};

export default function App() {
  const [state, setState] = React.useState<DesignDojoState>(() => loadDojoState());
  const [activeTab, setActiveTab] = React.useState<TabId>('today');
  const [saveTick, setSaveTick] = React.useState<number>(0);
  const [downloadMenuOpen, setDownloadMenuOpen] = React.useState(false);
  const [exportBusy, setExportBusy] = React.useState<boolean>(false);

  const tabContentRef = React.useRef<HTMLDivElement | null>(null);
  const printSectionRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const downloadMenuRef = React.useRef<HTMLDivElement | null>(null);

  // Autosave to localStorage on every state update
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const ok = saveDojoState(state);
    if (ok) {
      setSaveTick(Date.now());
    }
  }, [state]);

  // Close top-right download menu on outside click or Escape
  React.useEffect(() => {
    if (!downloadMenuOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDownloadMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [downloadMenuOpen]);

  const handleUpdate = React.useCallback(
    (updater: (prev: DesignDojoState) => DesignDojoState) => {
      setState((prev) => updater(prev));
    },
    []
  );

  const handleReplaceState = React.useCallback((next: DesignDojoState) => {
    setState(next);
  }, []);

  const handleResetAll = React.useCallback(() => {
    const fresh = clearDojoState();
    setState(fresh);
  }, []);

  const handleQuickExport = async (format: 'pdf' | 'png') => {
    if (!tabContentRef.current || exportBusy) return;
    setExportBusy(true);
    try {
      if (format === 'pdf') {
        await exportElementAsPdf(tabContentRef.current, activeTab);
      } else {
        await exportElementAsPng(tabContentRef.current, activeTab);
      }
    } catch {
      // silent catch so UI never crashes
    } finally {
      setExportBusy(false);
      setDownloadMenuOpen(false);
    }
  };

  const activeMeta = NAV_TABS.find((t) => t.id === activeTab) ?? NAV_TABS[0];
  const reduceMotion = prefersReducedMotion();

  const renderTab = () => {
    switch (activeTab) {
      case 'today':
        return <TodayTab state={state} onUpdate={handleUpdate} />;
      case 'checklists':
        return <ChecklistsTab state={state} onUpdate={handleUpdate} />;
      case 'practice':
        return <PracticeTab state={state} onUpdate={handleUpdate} />;
      case 'logs':
        return <LogsTab state={state} onUpdate={handleUpdate} />;
      case 'export':
        return (
          <ExportTab
            state={state}
            activeTab={activeTab}
            tabContainerRef={tabContentRef}
            printSectionRefs={printSectionRefs}
            onReplaceState={handleReplaceState}
            onResetAll={handleResetAll}
          />
        );
      case 'plan':
        return <PlanTab state={state} onUpdate={handleUpdate} />;
      case 'fact-sheet':
        return <FactSheetTab state={state} onUpdate={handleUpdate} />;
      default:
        return <TodayTab state={state} onUpdate={handleUpdate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#13221c] flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar */}
      <aside
        data-no-print="true"
        className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:justify-between lg:sticky lg:top-0 lg:h-screen bg-[#0b3d2e] text-[#fcfbf8] px-4 py-6"
      >
        <div className="space-y-7">
          <div className="px-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f59e0b] text-[#13221c]">
                <Compass className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight whitespace-nowrap">
                {APP_META.title}
              </span>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-[#fcfbf8]/75">
              {APP_META.subtitle}
            </p>
          </div>

          <nav aria-label="Primary navigation" className="space-y-1">
            {NAV_TABS.map((tab) => {
              const Icon = TAB_ICONS[tab.id];
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98] motion-reduce:active:scale-100 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]',
                    isActive
                      ? 'bg-[#fcfbf8] text-[#0b3d2e] font-semibold shadow-xs'
                      : 'text-[#fcfbf8]/80 hover:bg-[#fcfbf8]/10 hover:text-[#fcfbf8]'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4.5 w-4.5 shrink-0',
                      isActive ? 'text-[#0b3d2e]' : 'text-[#f59e0b]'
                    )}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#fcfbf8]/12 px-2 pt-4 text-xs text-[#fcfbf8]/70">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-[#f59e0b]" />
            <span>Stored locally in browser</span>
          </div>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-8">
        {/* Top Header (Mobile + Desktop) */}
        <header
          data-no-print="true"
          className="sticky top-0 z-30 border-b border-[#0b3d2e]/12 bg-[#f4f1ea]/92 backdrop-blur-md"
        >
          <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="min-w-0 flex items-center gap-3">
              <div className="lg:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0b3d2e] text-[#f59e0b]">
                <Compass className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <h1 className="font-display text-base sm:text-xl font-bold tracking-tight text-[#13221c] truncate">
                    <span className="lg:hidden">{APP_META.title} · </span>
                    {activeMeta.label}
                  </h1>
                </div>
                <p className="hidden sm:block text-xs text-[#52615a] truncate">
                  {APP_META.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Saved Indicator */}
              <div
                key={saveTick}
                aria-live="polite"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0b3d2e]"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{APP_META.savedLabel}</span>
              </div>

              {/* Top-Right Download Icon on Every Tab */}
              <div ref={downloadMenuRef} className="relative">
                <button
                  type="button"
                  aria-label="Download current tab"
                  aria-expanded={downloadMenuOpen}
                  onClick={() => setDownloadMenuOpen((v) => !v)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#0b3d2e]/15 bg-[#fcfbf8] text-[#0b3d2e] hover:bg-[#ece7dc] active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d2e]"
                >
                  <Download className="h-4.5 w-4.5" />
                </button>

                {downloadMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 rounded-2xl border border-[#0b3d2e]/15 bg-[#fcfbf8] p-1.5 shadow-lg z-50"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      disabled={exportBusy}
                      onClick={() => handleQuickExport('pdf')}
                      className="flex min-h-[44px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#13221c] hover:bg-[#ece7dc]/70 cursor-pointer disabled:opacity-50"
                    >
                      <FileText className="h-4 w-4 text-[#0b3d2e]" />
                      <span>{exportBusy ? 'Generating...' : 'Download tab as PDF'}</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={exportBusy}
                      onClick={() => handleQuickExport('png')}
                      className="flex min-h-[44px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#13221c] hover:bg-[#ece7dc]/70 cursor-pointer disabled:opacity-50"
                    >
                      <ImageIcon className="h-4 w-4 text-[#0b3d2e]" />
                      <span>{exportBusy ? 'Generating...' : 'Download tab as PNG'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Viewport */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div ref={tabContentRef} className="rounded-2xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav
        data-no-print="true"
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#0b3d2e]/15 bg-[#fcfbf8]/95 backdrop-blur-md lg:hidden"
      >
        <div className="grid grid-cols-7 items-center px-1 py-1">
          {NAV_TABS.map((tab) => {
            const Icon = TAB_ICONS[tab.id];
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 transition-colors active:scale-[0.96] motion-reduce:active:scale-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d2e]',
                  isActive ? 'text-[#0b3d2e]' : 'text-[#52615a] hover:text-[#13221c]'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-9 items-center justify-center rounded-lg transition-colors',
                    isActive ? 'bg-[#e6eee9] text-[#0b3d2e]' : 'bg-transparent'
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span
                  className={cn(
                    'text-[10px] leading-tight whitespace-nowrap',
                    isActive ? 'font-bold text-[#0b3d2e]' : 'font-medium'
                  )}
                >
                  {tab.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Off-screen Print-Friendly All-Tabs Container for "Download everything as one PDF" */}
      <PrintAllView state={state} sectionRefs={printSectionRefs} />
    </div>
  );
}
