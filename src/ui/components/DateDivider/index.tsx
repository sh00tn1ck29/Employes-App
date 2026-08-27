import './index.scss';

interface Props {
  year: number;
}

export default function DateDivider({ year }: Props) {
  return <p className="date-divider">{year}</p>;
}
