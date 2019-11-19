import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    route: string;
    constructor(loc: Location, private _router: Router) {
        this._router.events.subscribe((val) => {
            if (loc.path() !== '') {
                this.route = loc.path();
            }
        });
    }

    ngOnInit() {
    }
}
