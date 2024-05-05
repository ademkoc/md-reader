import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import debounce from "lodash.debounce";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { useCallback, useEffect, useState } from "preact/hooks";

marked.use(gfmHeadingId());

export function Home() {
  const [url, setURL] = useState<string>();
  const [content, setContent] = useState<string>();

  const handleInput = useCallback(
    debounce((event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        setURL(event.target.value);
      }
    }, 500),
    []
  );

  const fetchDocument = async () => {
    if (!url) return;
    const response = await fetch(url);
    const documentText = await response.text();
    setContent(await marked.parse(documentText));

    const raw = DOMPurify.sanitize(marked.parse(documentText, { gfm: true }));
    setContent(raw);
  };

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  useEffect(() => {
    fetchDocument();
  }, [url]);

  return (
    <div>
      <label for="contentAddress">Enter content address</label>

      <input
        type="text"
        id="contentAddress"
        name="contentAddress"
        onInput={handleInput}
      />

      {content && (
        <div
          id="_html"
          class="markdown-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
