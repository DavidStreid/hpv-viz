import {TestBed} from '@angular/core/testing';
import {DiagnosticSnpsService} from './diagnostic-snps-service';

// Straight Jasmine testing without Angular's testing support
describe('Diagnostic SNPs Service', () => {
  let service: DiagnosticSnpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [DiagnosticSnpsService]});
  });

  it('Returns lineage if detected from SNP info', () => {
    /*
    'CHROM': 'HPV16_E(p)',
    'POS': '1842',
    'ID': '1',
    'REF': '.',
    'ALT': 'A',
    'QUAL': '.',
    'FILTER': '.',
    'INFO': '.'
     */
    service = TestBed.get(DiagnosticSnpsService);
    const expectedLineage = 'HPV16_E(p)';
    const inputPos = '1842';
    const inputAlt = 'A';
    const detectedLineage = service.getDetectedLineageFromVariant(inputAlt, inputPos);
    expect(detectedLineage).toBe(expectedLineage);
  });

  it('Returns null if lineage is not detected', () => {
    service = new DiagnosticSnpsService();
    const expectedLineage = null;
    const inputPos = 'BAD_POS';
    const inputAlt = 'BAD_ALT';
    const detectedLineage = service.getDetectedLineageFromVariant(inputAlt, inputPos);
    expect(detectedLineage).toBe(expectedLineage);
  });
});
