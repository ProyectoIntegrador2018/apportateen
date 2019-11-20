import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import {NgxPageScrollModule} from 'ngx-page-scroll';

@NgModule({
    imports: [
        CommonModule, RouterModule, FormsModule, MatIconModule, MatToolbarModule,
        MatMenuModule,
        NgxPageScrollModule
    ],
    declarations: [LayoutComponent, HeaderComponent, FooterComponent],
    exports: [LayoutComponent]
})
export class UiModule { }