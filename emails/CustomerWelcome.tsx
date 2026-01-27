import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface CustomerWelcomeEmailProps {
  customerName: string;
  advisorName?: string;
}

export const CustomerWelcomeEmail = ({
  customerName = 'Kunde',
  advisorName = 'Ihr Kreditheld24 Team',
}: CustomerWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Willkommen bei Kreditheld24 - Ihr Kreditvergleich</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Kreditheld24</Heading>
          <Text style={tagline}>Ihr zuverlässiger Kreditvergleich</Text>
        </Section>

        <Section style={content}>
          <Heading style={h2}>Willkommen, {customerName}!</Heading>
          
          <Text style={text}>
            Vielen Dank für Ihr Vertrauen in Kreditheld24. Wir freuen uns, Sie bei Ihrer Kreditsuche begleiten zu dürfen.
          </Text>

          <Text style={text}>
            Ihr persönlicher Berater <strong>{advisorName}</strong> wird sich in Kürze bei Ihnen melden, um die nächsten Schritte zu besprechen.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href="https://kreditheld24.de/kreditrechner">
              Zum Kreditrechner
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            <strong>Ihre Vorteile mit Kreditheld24:</strong>
          </Text>
          
          <ul style={list}>
            <li style={listItem}>✓ 100% kostenlos & unverbindlich</li>
            <li style={listItem}>✓ SCHUFA-neutral</li>
            <li style={listItem}>✓ Persönliche Beratung</li>
            <li style={listItem}>✓ Schnelle Bearbeitung</li>
          </ul>

          <Hr style={hr} />

          <Text style={footer}>
            Bei Fragen erreichen Sie uns jederzeit unter:<br />
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

export default CustomerWelcomeEmail;

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

const list = {
  paddingLeft: '20px',
  margin: '16px 0',
};

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '28px',
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
