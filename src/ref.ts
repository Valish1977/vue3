/* "use strict";
import { App } from "vue";

export default class Ref {
    app: App<Element>;
    constructor(appData: App<Element>) {
        this.app = appData;
    }
    public testVersions(serverRefVersions: any): void { // проверка текущей версии справочников на актуальность
        const rv: string | null = localStorage.getItem("refVersions");
        let currentRefVersions = [];
        if (rv) {
            currentRefVersions = JSON.parse(rv);
        }
        const arrayLoadReferences = [];
        if (currentRefVersions.length < 1) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < serverRefVersions.length; i++) {
                // if (!serverRefVersions[i].local_update) {
                 //   continue;
                //} 
                arrayLoadReferences.push(serverRefVersions[i].name);
            }
        } else {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < serverRefVersions.length; i++) {
                // if (!serverRefVersions[i].local_update) {
                //    continue;
                //}
                let issetName = false;
                // tslint:disable-next-line:prefer-for-of
                for (let q = 0; q < currentRefVersions.length; q++) {
                    if (currentRefVersions[q].name === serverRefVersions[i].name) {
                        issetName = true;
                        if (currentRefVersions[q].version !== serverRefVersions[i].version) {
                            arrayLoadReferences.push(serverRefVersions[i].name);
                        }
                    }
                }
                if (issetName === false) {
                    arrayLoadReferences.push(serverRefVersions[i].name);
                }
            }
        }
        if (arrayLoadReferences.length > 0) {
            this.loadReferences(arrayLoadReferences).then( (data: any) => {
                if (data) {
                    const refVersions: any = JSON.stringify(serverRefVersions);
                    localStorage.setItem("refVersions", refVersions); // обновляем версии в localstorage
                }
            });
        }
    }
    private loadReferences(arrayLoadReferences: any): any {
        return new Promise((resolve, reject) => {
            let i = 0;
            for (const reference of arrayLoadReferences) {
                this.app.axios.get("/api/" + reference).then( (response: any) => {
                    // handle success
                    if (response.status === 200) {
                        i++;
                        const dataReference = JSON.stringify(response.data);
                        localStorage.setItem(reference, dataReference); // обновляем записи таблиц
                        if (i === arrayLoadReferences.length) {
                            resolve(true);
                        }
                    }
                }).catch((error: any) => {
                    // handle error
                    resolve(false);
                });
            }
        });
    }
} */