import { Injectable }  from '@angular/core';
import { INIT_DATA_POINTS }    from '../../test/mock-data/mock-viz';

@Injectable()
export class HpvDataService {
  getHpvData(): Object[] {
    return INIT_DATA_POINTS;
  }
}
