// globals.d.ts
declare module '*.css' {
  const content: Record<string, unknown>;
  export default content;
}