// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { $generateHtmlFromNodes } from '@lexical/html';
// import { useLayoutEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { COMMAND_PRIORITY_NORMAL, createCommand } from 'lexical';
// import MinifyCss from 'minify-css-string';
// import css from '@/pages/editDocument/Editor.css';
// import { VITE_BASE_URL } from '@/constants';

// export const PRINT_COMMAND = createCommand('print-command');

// const PrintPlugin = () => {
//   const [editor] = useLexicalComposerContext();
//   const { id } = useParams();

//   useLayoutEffect(() => {
//     return editor.registerCommand(
//       PRINT_COMMAND,
//       () => {
//         editor.update(() => {
//           // convert editor state into html
//           const htmlString = $generateHtmlFromNodes(editor, null);

//           const minifiedCss = MinifyCss(css);
//           fetch(`${VITE_BASE_URL}/api/scripts/export`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               css: minifiedCss,
//               html: htmlString,
//               docFormat: 'pdf',
//             }),
//           })
//             .then((response) => {
//               if (response.ok) {
//                 return response.blob();
//               } else {
//                 throw new Error('Request Failed');
//               }
//             })
//             .then((pdfBlob) => {
//               const pdfUrl = URL.createObjectURL(pdfBlob);
//               const downloadLink = document.createElement('a');
//               downloadLink.href = pdfUrl;
//               downloadLink.download = 'untitled document.pdf';

//               downloadLink.click();

//               URL.revokeObjectURL(pdfUrl);
//             })
//             .catch((err) => console.error('ERROR: ', err));
//         });
//       },
//       COMMAND_PRIORITY_NORMAL,
//     );
//   }, [editor, id]);
//   return null;
// };

// export default PrintPlugin;



import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { COMMAND_PRIORITY_NORMAL, createCommand } from 'lexical';
import MinifyCss from 'minify-css-string';
import css from '@/pages/editDocument/Editor.css';
import { VITE_BASE_URL } from '@/constants';
import { $generateHtmlFromNodes } from '@lexical/html';

export const PRINT_COMMAND = createCommand('print-command');

const PrintPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const { id } = useParams();

  useLayoutEffect(() => {
    return editor.registerCommand(
      PRINT_COMMAND,
      () => {
        editor.update(() => {
          // convert editor state into html
          const htmlString = $generateHtmlFromNodes(editor, null);

          const minifiedCss = MinifyCss(css);

          // Open a new window with the print content
          const printWindow = window.open('', '_blank');

          // Write the necessary content with print-specific styles
          printWindow.document.write(`
            <html>
              <head>
                <style>
                  ${minifiedCss}
                  @media print {
                    /* Hide headers and footers */
                    @page {
                      size: auto;
                    }

                    body {
                      margin: 0;
                    }
                  }
                </style>
              </head>
              <body>${htmlString}</body>
            </html>
          `);

          // Close the document after printing
          printWindow.document.close();

          // Trigger the print dialog
          printWindow.print();
        });
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [editor, id]);

  return null;
};

export default PrintPlugin;
