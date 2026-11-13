import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toDateKey } from './utils';

function sanitizeColorString(value: string): string {
  if (!value || (!value.includes('oklch') && !value.includes('oklab') && !value.includes('color-mix'))) {
    return value;
  }
  // Fallback canvas 1x1 conversion for modern CSS color functions html2canvas cannot parse
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return value;
    ctx.fillStyle = '#13221c';
    ctx.fillStyle = value;
    return ctx.fillStyle;
  } catch {
    return value;
  }
}

function normalizeCloneForHtml2Canvas(clonedDoc: Document, rootEl: HTMLElement): void {
  const allEls = [rootEl, ...Array.from(rootEl.querySelectorAll<HTMLElement>('*'))];
  const colorProps = [
    'color',
    'backgroundColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'fill',
    'stroke',
  ] as const;

  const win = clonedDoc.defaultView;
  if (!win) return;

  for (const el of allEls) {
    const computed = win.getComputedStyle(el);
    for (const prop of colorProps) {
      const val = computed[prop];
      if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('color-mix'))) {
        el.style[prop] = sanitizeColorString(val);
      }
    }
    // Disable shadows or gradients containing oklch/oklab
    if (computed.boxShadow && (computed.boxShadow.includes('oklch') || computed.boxShadow.includes('oklab'))) {
      el.style.boxShadow = 'none';
    }
    if (
      computed.backgroundImage &&
      (computed.backgroundImage.includes('oklch') || computed.backgroundImage.includes('oklab'))
    ) {
      el.style.backgroundImage = 'none';
    }
  }
}

async function captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc, clonedEl) => {
      normalizeCloneForHtml2Canvas(clonedDoc, clonedEl);
    },
  });
}

export function buildExportFilename(tabSlug: string, ext: 'pdf' | 'png'): string {
  const dateStr = toDateKey();
  const safeSlug = tabSlug.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  return `design-dojo-${safeSlug}-${dateStr}.${ext}`;
}

export async function exportElementAsPng(element: HTMLElement, tabSlug: string): Promise<void> {
  const canvas = await captureElement(element);
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = buildExportFilename(tabSlug, 'png');
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function appendCanvasToPdfA4(pdf: jsPDF, canvas: HTMLCanvasElement, startOnNewPage: boolean): void {
  const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const imgWidthPx = canvas.width;
  const imgHeightPx = canvas.height;
  const pxPerMm = imgWidthPx / contentWidth;
  const pageSliceHeightPx = Math.floor(contentHeight * pxPerMm);

  let offsetY = 0;
  let pageIndex = 0;

  while (offsetY < imgHeightPx) {
    if (startOnNewPage || pageIndex > 0) {
      pdf.addPage();
    }

    const sliceHeightPx = Math.min(pageSliceHeightPx, imgHeightPx - offsetY);
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = imgWidthPx;
    sliceCanvas.height = sliceHeightPx;

    const ctx = sliceCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        offsetY,
        imgWidthPx,
        sliceHeightPx,
        0,
        0,
        imgWidthPx,
        sliceHeightPx
      );
    }

    const sliceData = sliceCanvas.toDataURL('image/png');
    const sliceHeightMm = sliceHeightPx / pxPerMm;
    pdf.addImage(sliceData, 'PNG', margin, margin, contentWidth, sliceHeightMm, undefined, 'FAST');

    offsetY += sliceHeightPx;
    pageIndex += 1;
  }
}

export async function exportElementAsPdf(element: HTMLElement, tabSlug: string): Promise<void> {
  const canvas = await captureElement(element);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  appendCanvasToPdfA4(pdf, canvas, false);
  pdf.save(buildExportFilename(tabSlug, 'pdf'));
}

export async function exportSectionsAsOnePdf(
  sections: HTMLElement[],
  slug = 'all-tabs'
): Promise<void> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  for (let i = 0; i < sections.length; i++) {
    const canvas = await captureElement(sections[i]);
    appendCanvasToPdfA4(pdf, canvas, i > 0);
  }
  pdf.save(buildExportFilename(slug, 'pdf'));
}
