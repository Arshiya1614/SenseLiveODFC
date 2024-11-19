import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  reportData = {
    title: 'BODY,(MARKING) FOR FUZE PERCN.DA NO 162 MK8(M-2) FOR FUZE PERCN.DA NO 162 MK8(M-2)',
    endStore: 'FUZE PERCUSSION,DA, NO.162 MK8(M-2) BRASS WITH CAP',
    component: 'BODY,(MARKING) FOR FUZE PERCN.DA NO 162 MK8(M-2)',
    characteristics: [
      {
        srNo: 1,
        timestamp: '2024-11-19 10:30:00',
        refNo: 'REF001',
        characteristic: 'Dia 31.50 ±0.25',
        gauge: 'Ring GO',
        ofdcGaugeNo: 'DMG-2609',
        actualNo: '1001',
        remark: 'SATISFACTORY' ,
        otherRemark: ''
      }
    ]
  };

  // Method to add a new row to characteristics
  addRow() {
    this.reportData.characteristics.push({
      srNo: this.reportData.characteristics.length + 1,
      timestamp: '',
      refNo: '',
      characteristic: '',
      gauge: '',
      ofdcGaugeNo: '',
      actualNo: '',
      remark: '',
      otherRemark: ''
    });
  }

  // Method to remove a selected row
  removeRow() {
    // Remove the last row, you can customize this logic for specific removals
    this.reportData.characteristics.pop();
  }
}
