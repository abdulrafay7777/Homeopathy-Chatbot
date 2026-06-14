// Centralized configuration for ReactMarkdown components
export const markdownComponents = {
  a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noreferrer" {...props} />,
  code: ({ node, inline, ...props }) => 
    inline 
      ? <code className="bg-gray-100 rounded px-1 text-sm font-mono" {...props} />
      : <code className="block bg-[#1e1e1e] text-gray-100 p-4 rounded-lg my-2 overflow-x-auto text-sm font-mono" {...props} />,
};