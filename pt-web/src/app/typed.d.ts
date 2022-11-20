declare module '*.md' {
  const value: string;
  export default value;
}

declare interface Navigator {
  readonly userAgentData: any;
}
