declare global {
  interface IOptions {
    mergePages?: boolean;
    maxPages?: number;
  }

  type IArgs = IOptions;

  interface IExtract {
    text: string | string[];
    numpages: number;
    metadata?: Record<string, any>;
  }
}

export {};
