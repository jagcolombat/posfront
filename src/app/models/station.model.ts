import {EStationStatus} from '../utils/station-status.enum';

export class StationModel {
  id: string;
  label: string;
  host: string;
  status?: EStationStatus;
}
