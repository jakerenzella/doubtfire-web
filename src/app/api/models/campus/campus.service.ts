import { Campus } from './campus';
import { EntityService } from '../entity.service';
import { Injectable } from '@angular/core';


export class CampusService extends EntityService<Campus> {

  protected readonly endpointFormat = 'campuses/:id:';

  protected createInstanceFrom(json: any): Campus {
    let campus = new Campus();
    campus.updateFromJson(json);
    return campus;
  }

  public keyForJson(json: any): string {
    return json.id;
  }
}
