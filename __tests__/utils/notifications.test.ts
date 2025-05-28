import { notificationTemplates } from '@/lib/notifications';

describe('Notification Templates', () => {
  test('should generate inquiry received template', () => {
    const template = notificationTemplates.INQUIRY_RECEIVED({
      propertyTitle: 'Beautiful House',
      userName: 'John Doe'
    });

    expect(template.title).toBe('New Property Inquiry');
    expect(template.message).toContain('John Doe');
    expect(template.message).toContain('Beautiful House');
  });

  test('should generate property approved template', () => {
    const template = notificationTemplates.PROPERTY_APPROVED({
      propertyTitle: 'Modern Apartment'
    });

    expect(template.title).toBe('Property Approved');
    expect(template.message).toContain('Modern Apartment');
    expect(template.message).toContain('approved');
  });

  test('should generate agent verified template', () => {
    const template = notificationTemplates.AGENT_VERIFIED();

    expect(template.title).toBe('Agent Verification Complete');
    expect(template.message).toContain('Congratulations');
  });

  test('should generate property rejected template with reason', () => {
    const template = notificationTemplates.PROPERTY_REJECTED({
      propertyTitle: 'Test Property',
      reason: 'Missing required documents'
    });

    expect(template.title).toBe('Property Rejected');
    expect(template.message).toContain('Test Property');
    expect(template.message).toContain('Missing required documents');
  });

  test('should generate property rejected template without reason', () => {
    const template = notificationTemplates.PROPERTY_REJECTED({
      propertyTitle: 'Test Property'
    });

    expect(template.title).toBe('Property Rejected');
    expect(template.message).toContain('Test Property');
    expect(template.message).toContain('contact support');
  });
});
