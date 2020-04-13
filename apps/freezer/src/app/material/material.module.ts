import { NgModule } from '@angular/core';
import { MatButtonModule, } from '@angular/material/button';
import { MatCardModule, } from '@angular/material/card';
import { MatDialogModule, } from '@angular/material/dialog';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatIconModule, } from '@angular/material/icon';
import { MatInputModule, } from '@angular/material/input';
import { MatListModule, } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule, } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, } from '@angular/material/table';
import { MatToolbarModule, } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';

/**
 * NgModule that includes all Material modules.
*/
@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    // Material
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MaterialModule { }