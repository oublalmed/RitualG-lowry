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

interface OrderDeliveredEmailProps {
  orderNumber?: string;
  customerName?: string;
  reviewUrl?: string;
}

export default function OrderDeliveredEmail({
  orderNumber = 'LUX-2026-12345',
  customerName,
  reviewUrl = 'https://ritualglowry.com/compte/commandes',
}: OrderDeliveredEmailProps) {
  const stars = '★★★★★';

  return (
    <Html>
      <Head />
      <Preview>Votre commande {orderNumber} est arrivée — partagez votre avis ✨</Preview>
      <Body style={bodyStyle}>
        {/* Header */}
        <Section style={headerStyle}>
          <Text style={logoStyle}>Ritual Glowry</Text>
          <Text style={taglineStyle}>Premium Hair — Maroc</Text>
        </Section>

        <Container style={containerStyle}>
          {/* Hero */}
          <Section style={heroStyle}>
            <Text style={deliveredIconStyle}>🎉</Text>
            <Heading style={h1Style}>
              Votre commande est arrivée&nbsp;!
            </Heading>
            {customerName && (
              <Text style={subTextStyle}>Bonjour {customerName},</Text>
            )}
            <Text style={subTextStyle}>
              Nous espérons que vous êtes ravie de votre commande <strong>{orderNumber}</strong>.
              Profitez bien de vos nouvelles extensions Ritual Glowry&nbsp;!
            </Text>
          </Section>

          {/* Review prompt */}
          <Section style={reviewBoxStyle}>
            <Text style={reviewTitleStyle}>Partagez votre expérience</Text>
            <Text style={starsStyle}>{stars}</Text>
            <Text style={reviewDescStyle}>
              Votre avis aide d&apos;autres femmes à faire le bon choix.
              Laissez un commentaire en quelques secondes&nbsp;!
            </Text>
            <Button href={reviewUrl} style={buttonStyle}>
              Laisser un avis
            </Button>
          </Section>

          <Hr style={hrStyle} />

          {/* Loyalty nudge */}
          <Section style={loyaltyBoxStyle}>
            <Text style={loyaltyTitleStyle}>
              💎 Vous avez gagné des points Glowry
            </Text>
            <Text style={loyaltyTextStyle}>
              Vos points fidélité ont été crédités. Découvrez vos avantages en vous connectant
              à votre espace client.
            </Text>
          </Section>

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

const deliveredIconStyle = {
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

const reviewBoxStyle = {
  backgroundColor: '#F5EDE0',
  padding: '28px 24px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const reviewTitleStyle = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '18px',
  color: '#3D2B1F',
  margin: '0 0 8px',
};

const starsStyle = {
  fontSize: '28px',
  color: '#C9A875',
  letterSpacing: '4px',
  margin: '0 0 12px',
};

const reviewDescStyle = {
  fontSize: '13px',
  color: '#3D2B1F',
  opacity: 0.7,
  margin: '0 0 20px',
  lineHeight: '1.5',
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

const loyaltyBoxStyle = {
  padding: '16px',
  borderLeft: '4px solid #C9A875',
  margin: '0 0 8px',
};

const loyaltyTitleStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#3D2B1F',
  margin: '0 0 4px',
};

const loyaltyTextStyle = {
  fontSize: '13px',
  color: '#3D2B1F',
  opacity: 0.65,
  margin: '0',
  lineHeight: '1.5',
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
