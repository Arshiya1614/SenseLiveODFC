import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { StandardComponent } from './standard/standard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SelectComponent } from './standard/components/select/select.component';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { ConfirmSnackBarComponent } from './components/confirm-snack-bar/confirm-snack-bar.component';
import { SubmitReportComponent } from './standard/components/submit-report/submit-report.component';
import { DisplayListComponent } from './standard/components/display-list/display-list.component';
import { DatePipe } from '@angular/common';
import { ViewReportComponent } from './standard/components/view-report/view-report.component';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'dashboard.senselive.in',
  port: 9001,
  protocol: 'ws',
  username: 'Sense2023',
  password: 'sense123'
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    StandardComponent,
    SelectComponent,
    ConfirmSnackBarComponent,
    SubmitReportComponent,
    DisplayListComponent,
    ViewReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule ,
    ReactiveFormsModule,
    FormsModule ,
    HttpClientModule ,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
