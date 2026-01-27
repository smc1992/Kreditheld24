import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface CaseUpdateEmailProps {
  customerName: string;
  caseNumber: string;
  status: string;
  message: string;
  advisorName?: string;
}

export const CaseUpdateEmail = ({
  customerName = 'Kunde',
  caseNumber = 'VG-12345678',
  status = 'In Bearbeitung',
  message = 'Ihr Vorgang wird bearbeitet.',
  advisorName = 'Ihr Kreditheld24 Team',
}: CaseUpdateEmailProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'genehmigt':
      case 'approved':
        return '#10b981';
      case 'in bearbeitung':
      case 'in_progress':
        return '#f59e0b';
      case 'abgelehnt':
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'Offen';
      case 'in_progress':
        return 'In Bearbeitung';
      case 'approved':
        return 'Genehmigt';
      case 'rejected':
        return 'Abgelehnt';
      case 'closed':
        return 'Geschlossen';
      default:
        return status;
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Update zu Ihrem Vorgang {caseNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Kreditheld24</Heading>
            <Text style={tagline}>Ihr zuverlässiger Kreditvergleich</Text>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Hallo {customerName},</Heading>
            
            <Text style={text}>
              Es gibt ein Update zu Ihrem Vorgang:
            </Text>

            <Section style={statusBox}>
              <Text style={statusLabel}>Vorgangsnummer</Text>
              <Text style={statusValue}>{caseNumber}</Text>
              
              <Text style={statusLabel}>Status</Text>
              <Section style={{
                ...statusBadge,
                backgroundColor: `${getStatusColor(status)}15`,
              }}>
                <Text style={{
                  ...statusBadgeText,
                  color: getStatusColor(status),
                }}>
                  {getStatusLabel(status)}
                </Text>
              </Section>
            </Section>

            <Text style={text}>
              {message}
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href="https://kreditheld24.de">
                Zum Dashboard
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Bei Fragen steht Ihnen {advisorName} gerne zur Verfügung.<br />
              <Link href="mailto:info@kreditheld24.de" style={link}>
                info@kreditheld24.de
              </Link>
            </Text>

            <Text style={footer}>
              Mit freundlichen Grüßen<br />
              Ihr Kreditheld24 Team
            </Text>
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Kreditheld24. Alle Rechte vorbehalten.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CaseUpdateEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 48px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  padding: '0',
};

const tagline = {
  color: '#d1fae5',
  fontSize: '14px',
  margin: '8px 0 0 0',
};

const content = {
  padding: '0 48px',
};

const h2 = {
  color: '#111827',
  fontSize: '24px',
  fontWeight: '700',
  margin: '32px 0 16px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const statusBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const statusLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
};

const statusValue = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 16px 0',
};

const statusBadge = {
  display: 'inline-block',
  padding: '8px 16px',
  borderRadius: '12px',
  margin: '8px 0',
};

const statusBadgeText = {
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const buttonContainer = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#10b981',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const link = {
  color: '#10b981',
  textDecoration: 'underline',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
};

const footerSection = {
  padding: '24px 48px',
  backgroundColor: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
};
