import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import apiURL from 'src/app/config/constants/apiURL';
interface ExternalNameResponseFormat {
  externalName: string;
};

@Injectable({
  providedIn: 'root',
})

export class DoubtfireConstants {
  constructor(private http: HttpClient) { }
  public mainContributors: string[] = [
    'macite',              // Andrew Cain
    'alexcu',              // Alex Cummaudo
    'jakerenzella'         // Jake Renzella
  ];
  public apiURL: string = apiURL;
  private _externalName: string = "Loading...";
  private _externalNamePromise: Promise<ExternalNameResponseFormat>;

  get externalName(): Promise<ExternalNameResponseFormat> {
    if (this._externalName == "Loading...") {
      this._externalNamePromise = this.http.get<ExternalNameResponseFormat>(`${this.apiURL}/settings`).toPromise();
      this._externalNamePromise.then(res => {
        // Cache the externalName in a private field when you get it back
        this._externalName = res.externalName
      });
      return this._externalNamePromise;
    }
    //Using cached promise
    return this._externalNamePromise;
  }


}

