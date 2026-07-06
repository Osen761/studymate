"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownOutput({ content }: { content: string }) {
  return (
    <div className="text-sm leading-7 text-ink">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="mb-3 mt-5 text-2xl font-bold leading-tight text-ink first:mt-0" {...props} />,
          h2: (props) => <h2 className="mb-3 mt-5 text-xl font-bold leading-tight text-ink first:mt-0" {...props} />,
          h3: (props) => <h3 className="mb-2 mt-4 text-lg font-bold leading-tight text-ink first:mt-0" {...props} />,
          h4: (props) => <h4 className="mb-2 mt-4 text-base font-bold leading-tight text-ink first:mt-0" {...props} />,
          p: (props) => <p className="my-3 first:mt-0 last:mb-0" {...props} />,
          strong: (props) => <strong className="font-bold text-ink" {...props} />,
          em: (props) => <em className="italic" {...props} />,
          ul: (props) => <ul className="my-3 list-disc space-y-1 pl-6" {...props} />,
          ol: (props) => <ol className="my-3 list-decimal space-y-1 pl-6" {...props} />,
          li: (props) => <li className="pl-1" {...props} />,
          blockquote: (props) => <blockquote className="my-4 border-l-4 border-teal bg-paper py-2 pl-4 text-ink/80" {...props} />,
          a: (props) => <a className="font-semibold text-teal underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />,
          hr: (props) => <hr className="my-5 border-line" {...props} />,
          table: (props) => (
            <div className="my-4 overflow-x-auto rounded-md border border-line">
              <table className="w-full border-collapse text-left text-sm" {...props} />
            </div>
          ),
          th: (props) => <th className="border-b border-line bg-paper px-3 py-2 font-bold" {...props} />,
          td: (props) => <td className="border-b border-line px-3 py-2 align-top last:border-b-0" {...props} />,
          pre: (props) => <pre className="my-4 overflow-x-auto rounded-md bg-ink p-4 text-xs leading-6 text-white" {...props} />,
          code: (props) => <code className="rounded bg-paper px-1.5 py-0.5 text-[0.92em] font-semibold text-coral" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
