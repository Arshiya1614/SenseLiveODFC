import { Component } from '@angular/core';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.css']
})
export class StandardComponent {
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
  remarkOptions : string[] = [
    'satisfied',
    'Not satisfied'
  ]
  gaugeDataMap: { [key: string]: { characteristic: string; ofdcGaugeNo: string } } = {
    'Gauge 1': { characteristic: 'Characteristic 1', ofdcGaugeNo: 'OFDC001' },
    'Gauge 2': { characteristic: 'Characteristic 2', ofdcGaugeNo: 'OFDC002' },
    'Gauge 3': { characteristic: 'Characteristic 3', ofdcGaugeNo: 'OFDC003' }
  };
  selectedComponent: string = this.components[0];

  reportData = {
    title: 'BODY,(MARKING) FOR FUZE PERCN.DA NO 162 MK8(M-2) FOR FUZE PERCN.DA NO 162 MK8(M-2)',
    endStore: 'FUZE PERCUSSION,DA, NO.162 MK8(M-2) BRASS WITH CAP',
    component: 'BODY,(MARKING) FOR FUZE PERCN.DA NO 162 MK8(M-2)',
    characteristics: [
      {
        srNo: 1,
        timestamp: this.formatDate(new Date()),
        refNo: 'REF1',
        characteristic: 'Characteristic',
        gauge: 'Guage',
        ofdcGaugeNo: 'OFDC no',
        actualNo: 0,
        remark: ' Remark',
        otherRemark: ' Other Remark',
        isStopped: true, 
        interval: null,
        isDefault: true 
      }
    ] as any[]
  };


  formatDate(date: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); 
    const year = date.getFullYear().toString().slice(-2); 
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${day}-${month}-${year}  ${hours}:${minutes}:${seconds}`;
  }
  
   onComponentChange() {
    this.updateReportData(this.selectedComponent);
  }
  onGaugeChange(row: any) {
   
    const gaugeData = this.gaugeDataMap[row.gauge];
    if (gaugeData) {
      row.characteristic = gaugeData.characteristic;
      row.ofdcGaugeNo = gaugeData.ofdcGaugeNo;
    } else {
      row.characteristic = 'No characteristic available';
      row.ofdcGaugeNo = 'No OFDC Gauge No available';
    }
  }
 
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
          isStopped: true, 
          interval: null, 
          isDefault: true 
        }
      ]
    };
  } 
  
  addRow() {
    const newRow = {
      srNo: this.reportData.characteristics.length + 1,
      timestamp: this.formatDate(new Date()),
      refNo: `REF${this.reportData.characteristics.length + 1}`,
      characteristic: '',
      gauge: '',
      ofdcGaugeNo: '',
      actualNo: 0,
      remark: '',
      otherRemark: '',
      isStopped: true, 
      interval: null 
    };
    this.reportData.characteristics.push(newRow);
  }

  toggleCounter(index: number) {
    const row = this.reportData.characteristics[index];
    if (row.isStopped) {
      
      row.interval = setInterval(() => {
        row.actualNo++;
      }, 100);
    } else {
      if (row.interval) {
        clearInterval(row.interval);
        row.interval = null;
      }
    }
    row.isStopped = !row.isStopped; 
  }
  deleteRow(index: number) {
    this.reportData.characteristics.splice(index, 1); 
  }
}
