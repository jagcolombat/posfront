import {EStationStatus} from '../utils/station-status.enum';

export interface Station {
  id: string;
  label: string;
  host: string;
  status: EStationStatus;
}
