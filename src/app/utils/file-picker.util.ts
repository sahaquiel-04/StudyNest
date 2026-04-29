/**
 * Opens a native file picker and resolves with the selected File objects.
 * @param accept  MIME types or extensions, e.g. '*' or '.pdf,.docx'
 * @param multiple Allow multiple file selection
 */
export function pickFiles(accept = '*', multiple = true): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = 'none';

    input.onchange = () => {
      resolve(input.files ? Array.from(input.files) : []);
      document.body.removeChild(input);
    };

    // Cancelled — no files selected
    window.addEventListener('focus', function onFocus() {
      window.removeEventListener('focus', onFocus);
      setTimeout(() => {
        if (!input.files?.length) resolve([]);
        try { document.body.removeChild(input); } catch {}
      }, 500);
    }, { once: true });

    document.body.appendChild(input);
    input.click();
  });
}