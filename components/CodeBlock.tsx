"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Clipboard, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden my-4 border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] text-text-code text-xs font-mono">
        <span className="opacity-70">{title || language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-text-code/70 hover:text-text-code transition-colors cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-4 overflow-x-auto text-sm leading-relaxed"
            style={{ ...style, background: "#1E1E2E", margin: 0 }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
