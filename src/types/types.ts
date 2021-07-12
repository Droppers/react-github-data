export interface IBaseProps<TData> {
  loading?: React.ReactElement | string;
  error?: React.ReactElement | string;
  onDataLoad?: () => void;
  onDataError?: () => void;
  content?: (data: TData) => React.ReactElement | string;
}
