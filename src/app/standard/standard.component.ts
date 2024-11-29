import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './components/data.service';
import { CookieService } from 'ngx-cookie-service';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../login/auth/auth.service';
import { ConfirmSnackBarComponent } from '../components/confirm-snack-bar/confirm-snack-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { SubmitReportComponent } from './components/submit-report/submit-report.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.css']
})
export class StandardComponent implements OnInit, OnDestroy {
  endStore: string = '';
  endStoreId: string = '';
  selectedComponent: any = '';

  displayedColumns: string[] = [
    'srNo',
    'gauge',
    'characteristic',
    'ofdcGaugeNo',
    'actualNo',
    'remark',
    'otherRemark',
    'actions'
  ];

  components: any[] = [];
  gauges: any[] = [];

  reportData = {
    endStore: this.endStore,
    endStoreId: this.endStoreId,
    component: this.selectedComponent,
    characteristics: [] as any[]
  };

  constructor(
    private service: DataService,
    private cookieService: CookieService,
    private mqttService: MqttService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.addRow(); // Initialize with one row
  }

  ngOnInit(): void {
    const orgId = this.cookieService.get('_organization_id');

    forkJoin([
      this.service.getEndStoresForOrganization(orgId),
      this.service.getComponentsForOrganization(orgId),
      this.service.getGaugesForOrganization(orgId)
    ]).subscribe(
      ([endStoresData, componentsData, gaugesData]) => {
        this.endStore = endStoresData.endStores[0].end_store_name;
        this.endStoreId = endStoresData.endStores[0].end_store_id;
        this.components = componentsData.components;
        this.selectedComponent = this.components[0]?.value || '';
        this.gauges = gaugesData.gauges;
      },
      (error) => {
        this.snackBar.open('Error fetching data', 'Close', { duration: 3000 });
      }
    );
  }

  ngOnDestroy(): void {
    this.reportData.characteristics.forEach((row) => {
      if (row.subscription) {
        row.subscription.unsubscribe();
      }
    });
  }

  onGaugeChange(row: any) {
    const gaugeData = this.gauges.find(g => g.value === row.gauge);
    if (gaugeData) {
      row.availableCharacteristics = gaugeData.characteristics;
      row.characteristic = gaugeData.characteristics.length > 0 ? gaugeData.characteristics[0].value : '';
      row.ofdcGaugeNo = gaugeData.ofdcGaugeNo;
    } else {
      row.availableCharacteristics = [];
      row.characteristic = '';
      row.ofdcGaugeNo = '';
    }
  }

  addRow() {
    const newRow = {
      srNo: this.reportData.characteristics.length + 1,
      timestamp: new Date().toISOString(),
      gauge: '',
      characteristic: '',
      availableCharacteristics: [],
      ofdcGaugeNo: '',
      actualNo: 0,
      remark: 'Satisfactory',
      otherRemark: '',
      isStopped: true,
      subscription: null
    };
    this.reportData.characteristics.push(newRow);
  }

  toggleCounter(index: number) {
    const row = this.reportData.characteristics[index];

    if (!row.gauge || !row.characteristic) {
      this.snackBar.open(`Please select both Gauge and Characteristic for Row ${index + 1}`, 'Close', { duration: 3000 });
      return;
    }

    if (row.isStopped) {
      const topic = `gauge/${row.gauge}/${row.characteristic}`;

      row.subscription = this.mqttService.observe(topic).subscribe({
        next: (message: IMqttMessage) => {
          try {
            const data = JSON.parse(message.payload.toString());
            if (data.value !== undefined) {
              row.actualNo = data.value;
            } else {
              this.snackBar.open(`Row ${index + 1}: Received message has no 'value' field`, 'Close', { duration: 3000 });
            }
          } catch (e) {
            this.snackBar.open(`Row ${index + 1}: Error parsing MQTT message`, 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open(`Row ${index + 1}: Error receiving MQTT data`, 'Close', { duration: 3000 });
        }
      });
    } else {
      if (row.subscription) {
        row.subscription.unsubscribe();
        row.subscription = null;
      }
    }

    row.isStopped = !row.isStopped;
  }

  deleteRow(index: number) {
    if (this.reportData.characteristics.length > 1) {
      const row = this.reportData.characteristics[index];
      if (row.subscription) {
        row.subscription.unsubscribe();
      }
      this.reportData.characteristics.splice(index, 1);
    } else {
      this.snackBar.open('Cannot delete the last row.', 'Close', { duration: 3000 });
    }
  }

  logout() {
    this.authService.logout();
  }

  submit() {
    // Collect the report data, including endStore, component, and all characteristics
    const reportDetails = {
      endStore: this.endStoreId,
      component: this.selectedComponent,
      reportData: this.reportData.characteristics.map((row) => ({
        srNo: row.srNo,
        gauge: row.gauge,
        characteristic: row.characteristic,
        ofdcGaugeNo: row.ofdcGaugeNo,
        actualNo: row.actualNo,
        remark: row.remark,
        otherRemark: row.otherRemark,
        timestamp: row.timestamp
      }))
    };
    
    const snackBarRef = this.snackBar.openFromComponent(ConfirmSnackBarComponent, {
      duration: 3000,
    });

    snackBarRef.onAction().subscribe(() => {
      const dialogRef = this.dialog.open(SubmitReportComponent, {
        data: reportDetails // Pass the data to the modal
      });
    });
  }

  redirectToDisplay(){
    this.router.navigate(['/display']);
  }

}
