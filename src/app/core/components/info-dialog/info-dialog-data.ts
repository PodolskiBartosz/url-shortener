export type InfoDialogData = {
  title: string;
  description: string;
  actionButtonText: string;
};

export const UNAUTHORIZED_DIALOG_DATA: InfoDialogData = {
  actionButtonText: 'Okay',
  description: 'Please log in again.',
  title: 'Your session has run out',
};
