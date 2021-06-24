export interface IProps {
    loading?: React.ReactElement | string;
    error?: React.ReactElement | string;
    onDataLoad?: () => void;
    onDataError?: () => void;
    formatter?: (value: React.ReactElement | string | number) => React.ReactElement | string;
}

export interface IGitHubData {
    fetchedAt?: Date;
}