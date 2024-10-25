import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';

function App() {
  const [copied, setCopiedId] = useState<string>();
  const [copiedText, setCopiedText] = useState<string>();
  const [copiedImage, setCopiedImage] = useState<string>();

  useEffect(() => {
    (async function run() {
      if ( copied?.includes('text') ) {
        
        // Reading text with readText

        const text = await navigator.clipboard.readText();
        setCopiedText(text);

      } else if ( copied?.includes('image') ) {

        // Reading image data with read

        const clipboard = await navigator.clipboard.read();

        const images = await Promise.all(
          clipboard
            .filter(clipboardItem => clipboardItem.types.includes('image/png'))
            .map(clipboardItem => clipboardItem.getType('image/png'))
        );

        // UI supports one image, so only set one

        setCopiedImage(URL.createObjectURL(images[0]));
      }
    })();
    setTimeout(() => {
      setCopiedId(undefined);
      setCopiedText(undefined);
    }, 3000)
  }, [copied]);

  return (
    <div className="max-w-3xl mx-auto px-6 my-12">
      <h2 className="text-2xl font-bold mb-6">Code Snippets</h2>

      <div className="relative mockup-code mb-6">
        <button
          className="absolute top-2 right-3 text-slate-200 hover:text-white cursor-pointer"
          onClick={async () => {
            // Writing text with writeText and a fallback using copy-to-clipboard
            
            if ( 'clipboard' in navigator ) {
              await navigator.clipboard.writeText('navigator.clipboard.writeText()')
            } else {
              copy('await navigator.clipboard.writeText()');
            }

            setCopiedId('write-text')
          }}
        >
          {copied === 'write-text' ? '✅ Copied' : 'Copy'}
        </button>
        <pre><code>{`navigator.clipboard.writeText()`}</code></pre>
      </div>

      <div className="relative mockup-code mb-6">
        <button
          className="absolute top-2 right-3 text-slate-200 hover:text-white cursor-pointer"
          onClick={async () => {
            
            // Writing text with writeText

            await navigator.clipboard.writeText('navigator.clipboard.readText()')

            setCopiedId('read-text')
          }}
        >
          {copied === 'read-text' ? '✅ Copied' : 'Copy'}
        </button>
        <pre><code>{`navigator.clipboard.readText()`}</code></pre>
      </div>

      {copiedText && (
        <>
          <h3 className="text-xl font-semibold mt-6 mb-6">Copied Text</h3>
          <p>{ copiedText }</p>
        </>
      )}

      <h2 className="text-2xl font-bold mt-12 mb-6">Cool Images</h2>

      <div className="grid grid-cols-2">
        <img width="240" height="240" src="https://res.cloudinary.com/fay/image/upload/v1729824220/tutorials/my-clipboard/Windows_11_Clippy_paperclip_emoji_rlnfod.png" />
        <button className="btn" onClick={async () => {

          // Downloading an image Blob

          const response = await fetch('https://res.cloudinary.com/fay/image/upload/v1729824220/tutorials/my-clipboard/Windows_11_Clippy_paperclip_emoji_rlnfod.png');
          const contentType = response.headers.get('Content-Type');
          const blob = await response.blob();

          // Creating and writing a new ClipboardItem from image Blob
          
          const data = [new ClipboardItem({ [String(contentType)]: blob })];
          await navigator.clipboard.write(data);

          setCopiedId('write-image')
        }}>
          {copied === 'write-image' ? '✅ Copied' : 'Copy'}
        </button>
      </div>

      {copiedImage && (
        <>
          <h3 className="text-xl font-semibold mt-6 mb-6">Copied Image</h3>
          <p><img width="240" height="240" src={ copiedImage } /></p>
        </>
      )}

    </div>
  )
}

export default App
