import {NgModule} from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {FuseConfirmDialogModule, FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule} from '../../../@fuse/components';
import {RouterModule} from '@angular/router';
import {AgmCoreModule} from '@agm/core';

@NgModule({
    imports: [
        AgmCoreModule,

        RouterModule,

        // Mat modules
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatChipsModule,

        FormsModule,
        ReactiveFormsModule,
        // Fuse shared Module
        FuseSharedModule,
        MatMomentDateModule,
        // Other key fuse modules
        FuseConfirmDialogModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseThemeOptionsModule
    ],
    exports: [
        AgmCoreModule,

        RouterModule,

        // Mat modules
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatChipsModule,

        FormsModule,
        ReactiveFormsModule,
        // Fuse shared Module
        FuseSharedModule,
        MatMomentDateModule,
        // Other key fuse modules
        FuseConfirmDialogModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseThemeOptionsModule
    ]
})
export class AdminSharedModule {
}