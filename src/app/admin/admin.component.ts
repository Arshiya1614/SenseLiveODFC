import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
   // Dropdown options for components
   components: string[] = [
    'BODY,(MARKING) FOR FUZE PERCN.DA NO 162 MK8(M-2)',
    'BASE,PLATE, FOR FUZE PERCN.DA NO 162 MK8(M-2)',
    'COVER,FOR FUZE PERCN.DA NO 162 MK8(M-2)'
  ];
  gaugeOptions: string[] = [
    'Gauge 1',
    'Gauge 2',
    'Gauge 3'
  ];

  gaugeDataMap: { [key: string]: { characteristic: string; ofdcGaugeNo: string } } = {
    'Gauge 1': { characteristic: 'Characteristic 1', ofdcGaugeNo: 'OFDC001' },
    'Gauge 2': { characteristic: 'Characteristic 2', ofdcGaugeNo: 'OFDC002' },
    'Gauge 3': { characteristic: 'Characteristic 3', ofdcGaugeNo: 'OFDC003' }
  };
  // Selected component (default to the first one)
  selectedComponent: string = this.components[0];

  reportData = {
    title: 'BODY,(MARKING) FOR FUZE PERCN.DA NO 162 MK8(M-2) FOR FUZE PERCN.DA NO 162 MK8(M-2)',
    endStore: 'FUZE PERCUSSION,DA, NO.162 MK8(M-2) BRASS WITH CAP',
    component: 'BODY,(MARKING) FOR FUZE PERCN.DA NO 162 MK8(M-2)',
    characteristics: [
      {
        srNo: 1,
        timestamp: new Date().toISOString(),
        refNo: 'REF1',
        characteristic: 'Characteristic',
        gauge: 'Guage',
        ofdcGaugeNo: 'OFDC no',
        actualNo: 0,
        remark: ' Remark',
        otherRemark: ' Other Remark',
        isStopped: true, // Initially the counter is running
        interval: null, // No interval running initially
        isDefault: true // Default row
      }
    ] as any[]
  };
   // Handle component change from dropdown
   onComponentChange() {
    this.updateReportData(this.selectedComponent);
  }
  onGaugeChange(row: any) {
    // Fetch characteristic and OFDC Gauge No from the mapping based on selected gauge
    const gaugeData = this.gaugeDataMap[row.gauge];
    if (gaugeData) {
      row.characteristic = gaugeData.characteristic;
      row.ofdcGaugeNo = gaugeData.ofdcGaugeNo;
    } else {
      row.characteristic = 'No characteristic available';
      row.ofdcGaugeNo = 'No OFDC Gauge No available';
    }
  }
  // Update report data dynamically based on the selected component
  updateReportData(component: string) {
    this.reportData = {
      title: component,
      endStore: 'FUZE PERCUSSION,DA, NO.162 MK8(M-2) BRASS WITH CAP',
      component: component,
      characteristics: [
        {
          srNo: 1,
          timestamp: new Date().toISOString(),
          refNo: 'REF1',
          characteristic: '',
          gauge: '',
          ofdcGaugeNo: '',
          actualNo: 0,
          remark: 'Default Remark',
          otherRemark: 'Other Remark',
          isStopped: true, // Initially the counter is running
          interval: null, // No interval running initially
          isDefault: true // Default row
        }
      ]
    };
  } 
  // Add a new row
  addRow() {
    const newRow = {
      srNo: this.reportData.characteristics.length + 1,
      timestamp: new Date().toISOString(),
      refNo: `REF${this.reportData.characteristics.length + 1}`,
      characteristic: '',
      gauge: '',
      ofdcGaugeNo: '',
      actualNo: 0, // Counter starts from 0
      remark: '',
      otherRemark: '',
      isStopped: true, // Track if counter is stopped
      interval: null // Store the interval ID
    };
    this.reportData.characteristics.push(newRow);
  }

  toggleCounter(index: number) {
    const row = this.reportData.characteristics[index];
    if (row.isStopped) {
      // Start the counter
      row.interval = setInterval(() => {
        row.actualNo++;
      }, 100);
    } else {
      // Stop the counter
      if (row.interval) {
        clearInterval(row.interval);
        row.interval = null;
      }
    }
    row.isStopped = !row.isStopped; // Toggle the state
  }
  // Delete a row
  deleteRow(index: number) {
    this.reportData.characteristics.splice(index, 1); // Remove row from array
  }
}
