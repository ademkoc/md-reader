import { useEffect, useState, useCallback } from "preact/hooks";
import debounce from "lodash.debounce";
import { marked } from "marked";
import DOMPurify from "DOMPurify";

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
    fetchDocument();
  }, [url]);

  return (
    <section class="text-gray-600 body-font">
      <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div class="lg:flex-grow flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <div class="relative w-full mb-10">
            <label for="contentAddress" class="leading-7 text-sm text-gray-600">
              Enter content address
            </label>

            <input
              type="text"
              id="contentAddress"
              name="contentAddress"
              onInput={handleInput}
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          {content && (
            <div
              class="flex flex-col w-full mb-12"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
