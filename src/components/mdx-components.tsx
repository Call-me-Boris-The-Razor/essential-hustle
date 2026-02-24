import type { MDXComponents } from "mdx/types";

/** Custom MDX component overrides for blog posts */
export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="mb-6 mt-10 font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl" {...props} />
  ),
  h2: (props) => (
    <h2 className="mb-4 mt-8 font-display text-2xl font-bold tracking-tight text-text-primary" {...props} />
  ),
  h3: (props) => (
    <h3 className="mb-3 mt-6 font-display text-xl font-semibold text-text-primary" {...props} />
  ),
  p: (props) => (
    <p className="mb-4 text-lg leading-relaxed text-text-secondary" {...props} />
  ),
  ul: (props) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-text-secondary" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-text-secondary" {...props} />
  ),
  li: (props) => (
    <li className="text-lg leading-relaxed" {...props} />
  ),
  a: (props) => (
    <a
      className="text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="my-6 border-l-4 border-accent pl-4 italic text-text-muted" {...props} />
  ),
  code: (props) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-accent" {...props} />
  ),
  pre: (props) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-surface-1 p-4 font-mono text-sm" {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-6 rounded-xl" alt={props.alt ?? ""} {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
};
