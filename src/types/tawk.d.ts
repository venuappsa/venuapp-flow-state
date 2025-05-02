
interface TawkToAPI {
  onLoad: () => void;
  onStatusChange: (status: string) => void;
  addEvent: (event: string, metadata: any, callback: () => void) => void;
  addTags: (tags: string[], callback: (error: any) => void) => void;
  setAttributes: (attributes: Record<string, string>, callback: (error: any) => void) => void;
  hideWidget: () => void;
  showWidget: () => void;
  toggle: () => void;
  popup: () => void;
  getWindowType: () => string;
  maximize: () => void;
  minimize: () => void;
  isVisitorEngaged: () => boolean;
  endChat: () => void;
  visitor: {
    name: string;
    email: string;
  };
}

interface Window {
  Tawk_API?: TawkToAPI;
  Tawk_LoadStart?: Date;
}
