import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OrderShippedEmailProps {
  orderNumber?: string;
  customerName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  shippingMethod?: string;
}

export default function OrderShippedEmail({
  orderNumber = 'LUX-2026-12345',
  customerName,
  trackingNumber = 'MA123456789',
  trackingUrl = 'https://track.example.com/MA123456789',
  estimatedDelivery = '3-5 jours ouvrés',
  shippingMethod = 'STANDARD',
}: OrderShippedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre commande {orderNumber} est en route — Ritual Glowry 🚚</Preview>
      <Body style={bodyStyle}>
        {/* Header */}
        <Section style={headerStyle}>
          <Text style={logoStyle}>Ritual Glowry</Text>
          <Text style={taglineStyle}>Premium Hair — Maroc</Text>
        </Section>

        <Container style={containerStyle}>
          {/* Hero */}
          <Section style={heroStyle}>
            <Text style={shippingIconStyle}>🚚</Text>
            <Heading style={h1Style}>
              Votre commande est en route&nbsp;!
            </Heading>
            {customerName && (
              <Text style={subTextStyle}>Bonjour {customerName},</Text>
            )}
            <Text style={subTextStyle}>
              Bonne nouvelle — votre commande <strong>{orderNumber}</strong> vient d&apos;être expédiée.
            </Text>
          </Section>

          {/* Tracking info */}
          <Section style={trackingBoxStyle}>
            <Text style={trackingLabelStyle}>Numéro de suivi</Text>
            <Text style={trackingNumberStyle}>{trackingNumber}</Text>
            <Text style={trackingMethodStyle}>
              {shippingMethod} · Livraison estimée : {estimatedDelivery}
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <Button href={trackingUrl} style={buttonStyle}>
              Suivre mon colis
            </Button>
          </Section>

          <Hr style={hrStyle} />

          <Text style={helpTextStyle}>
            Une question ? Contactez-nous à{' '}
            <span style={{ color: '#C9A875' }}>contact@ritualglowry.com</span>
          </Text>

          <Hr style={hrStyle} />
          <Text style={footerStyle}>
            © {new Date().getFullYear()} Ritual Glowry · Maroc
          </Text>
          <Text style={footerLinkStyle}>Se désabonner</Text>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: '#FAF6EF',
  fontFamily: 'Inter, -apple-system, sans-serif',
};

const headerStyle = {
  backgroundColor: '#C9A875',
  padding: '24px 40px',
  textAlign: 'center' as const,
};

const logoStyle = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1A1410',
  margin: '0',
};

const taglineStyle = {
  fontSize: '11px',
  color: '#1A1410',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  margin: '4px 0 0',
};

const containerStyle = {
  backgroundColor: '#ffffff',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px',
};

const heroStyle = {
  paddingBottom: '8px',
  textAlign: 'center' as const,
};

const shippingIconStyle = {
  fontSize: '48px',
  margin: '0 0 8px',
};

const h1Style = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '26px',
  color: '#3D2B1F',
  margin: '0 0 8px',
};

const subTextStyle = {
  fontSize: '14px',
  color: '#3D2B1F',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const trackingBoxStyle = {
  backgroundColor: '#F5EDE0',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '24px 0',
  borderLeft: '4px solid #C9A875',
};

const trackingLabelStyle = {
  fontSize: '11px',
  color: '#3D2B1F',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '0 0 6px',
  opacity: 0.6,
};

const trackingNumberStyle = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#C9A875',
  margin: '0 0 8px',
};

const trackingMethodStyle = {
  fontSize: '13px',
  color: '#3D2B1F',
  opacity: 0.7,
  margin: '0',
};

const hrStyle = {
  borderColor: '#F5EDE0',
  margin: '20px 0',
};

const buttonStyle = {
  backgroundColor: '#C9A875',
  color: '#1A1410',
  padding: '14px 32px',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  textDecoration: 'none',
  display: 'inline-block',
};

const helpTextStyle = {
  fontSize: '13px',
  color: '#3D2B1F',
  textAlign: 'center' as const,
  opacity: 0.7,
};

const footerStyle = {
  fontSize: '11px',
  color: '#3D2B1F',
  opacity: 0.4,
  textAlign: 'center' as const,
  margin: '4px 0',
};

const footerLinkStyle = {
  ...footerStyle,
  textDecoration: 'underline',
};
