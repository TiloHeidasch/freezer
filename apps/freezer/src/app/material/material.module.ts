import { NgModule } from '@angular/core';
import { MatAutocompleteModule, } from '@angular/material/Autocomplete';
import { MatBadgeModule, } from '@angular/material/Badge';
import { MatBottomSheetModule, } from '@angular/material/bottom-sheet';
import { MatButtonModule, } from '@angular/material/Button';
import { MatButtonToggleModule, } from '@angular/material/button-toggle';
import { MatCardModule, } from '@angular/material/Card';
import { MatCheckboxModule, } from '@angular/material/Checkbox';
import { MatChipsModule, } from '@angular/material/Chips';
import { MatDatepickerModule, } from '@angular/material/Datepicker';
import { MatDialogModule, } from '@angular/material/Dialog';
import { MatDividerModule, } from '@angular/material/Divider';
import { MatExpansionModule, } from '@angular/material/Expansion';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatGridListModule, } from '@angular/material/grid-list';
import { MatIconModule, } from '@angular/material/Icon';
import { MatInputModule, } from '@angular/material/Input';
import { MatListModule, } from '@angular/material/List';
import { MatMenuModule, } from '@angular/material/Menu';
import { MatPaginatorModule, } from '@angular/material/Paginator';
import { MatProgressBarModule, } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule, } from '@angular/material/Progress-Spinner';
import { MatRadioModule, } from '@angular/material/Radio';
import { MatSelectModule, } from '@angular/material/Select';
import { MatSidenavModule, } from '@angular/material/Sidenav';
import { MatSliderModule, } from '@angular/material/Slider';
import { MatSlideToggleModule, } from '@angular/material/Slide-Toggle';
import { MatSnackBarModule, } from '@angular/material/snack-bar';
import { MatSortModule, } from '@angular/material/Sort';
import { MatStepperModule, } from '@angular/material/Stepper';
import { MatTableModule, } from '@angular/material/Table';
import { MatTabsModule, } from '@angular/material/Tabs';
import { MatToolbarModule, } from '@angular/material/Toolbar';
import { MatTooltipModule, } from '@angular/material/Tooltip';
import { MatTreeModule, } from '@angular/material/Tree';
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
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MaterialModule { }