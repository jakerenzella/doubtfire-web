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
  public externalName: ExternalNameResponseFormat = { externalName: "Loading..." };
  private _externalNamePromise: Promise<ExternalNameResponseFormat>;

  get loadExternalName(): Promise<ExternalNameResponseFormat> {
    if (this.externalName.externalName == "Loading...") {
      this._externalNamePromise = this.http.get<ExternalNameResponseFormat>(`${this.apiURL}/settings`).toPromise();
      this._externalNamePromise.then(res => {
        // Cache the externalName in a private field when you get it back
        var that = this;
        setTimeout(function () {
          that.externalName.externalName = res.externalName;
          console.log("Name changed");

          //your code to be executed after 1 second
        }, 4000)
      });
      return this._externalNamePromise;
    }
    //Using cached promise
    return this._externalNamePromise;
  }


}

