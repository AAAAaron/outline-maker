import { RouteComponentProps } from 'react-router-dom';
import { Location } from '../../location/locationDec';

export interface LocationSectionProps extends RouteComponentProps {
  locations: Location[];
  novel_id: string;

  refreshLocation: (id: string) => void;
  onCreateLocation: () => void;
}