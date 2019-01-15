export interface Alert {
  duration?: number;
  title: string;
  body: string;
  icon?: string;
  placement: string
  alert_type?: 'success' | 'error' | 'warning' | 'info' | 'question'
}
