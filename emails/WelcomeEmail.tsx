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

interface WelcomeEmailProps {
  name?: string;
}

export default function WelcomeEmail({ name = 'Chère Glowry' }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue dans le Club Glowry — votre code cadeau vous attend ✨</Preview>
      <Body style={bodyStyle}>
        {/* Header */}
        <Section style={headerStyle}>
          <Text style={logoStyle}>Ritual Glowry</Text>
          <Text style={taglineStyle}>Premium Hair — Maroc</Text>
        </Section>

        <Container style={containerStyle}>
          <Heading style={h1Style}>
            Bienvenue dans le Club Glowry&nbsp;!
          </Heading>

          <Text style={bodyTextStyle}>
            Bonjour {name},
          </Text>
          <Text style={bodyTextStyle}>
            Nous sommes ravis de vous accueillir dans la communauté Ritual Glowry.
            Vous avez maintenant accès aux meilleures extensions capillaires 100% naturelles du Maroc.
          </Text>

          {/* Promo code */}
          <Section style={promoBoxStyle}>
            <Text style={promoLabelStyle}>Votre cadeau de bienvenue</Text>
            <Text style={promoCodeStyle}>BIENVENUE10</Text>
            <Text style={promoDescStyle}>15% de réduction sur votre première commande dès 500 MAD</Text>
          </Section>

          {/* Brand values */}
          <Section style={{ padding: '24px 0' }}>
            <Heading style={h2Style}>Nos engagements</Heading>
            <Section style={valueRowStyle}>
              <Text style={valueIconStyle}>💎</Text>
              <Text style={valueTitleStyle}>Qualité Premium</Text>
              <Text style={valueTextStyle}>100% cheveux Remy naturels, certifiés et traçables</Text>
            </Section>
            <Section style={valueRowStyle}>
              <Text style={valueIconStyle}>🌿</Text>
              <Text style={valueTitleStyle}>Naturel & Éthique</Text>
              <Text style={valueTextStyle}>Sans produits chimiques agressifs, sourcing responsable</Text>
            </Section>
            <Section style={valueRowStyle}>
              <Text style={valueIconStyle}>✨</Text>
              <Text style={valueTitleStyle}>Service d&apos;Exception</Text>
              <Text style={valueTextStyle}>Livraison express, conseils personnalisés, retours faciles</Text>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          <Section style={{ textAlign: 'center', padding: '8px 0 24px' }}>
            <Button href="https://ritualglowry.com/boutique" style={buttonStyle}>
              Découvrir la boutique
            </Button>
          </Section>

          <Hr style={hrStyle} />
          <Text style={footerStyle}>
            © {new Date().getFullYear()} Ritual Glowry · Maroc · Instagram · TikTok
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

const h1Style = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '26px',
  color: '#3D2B1F',
  margin: '0 0 16px',
};

const h2Style = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '18px',
  color: '#3D2B1F',
  margin: '0 0 16px',
};

const bodyTextStyle = {
  fontSize: '14px',
  color: '#3D2B1F',
  lineHeight: '1.6',
  margin: '0 0 12px',
};

const promoBoxStyle = {
  backgroundColor: '#C9A875',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const promoLabelStyle = {
  fontSize: '11px',
  color: '#1A1410',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const promoCodeStyle = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#1A1410',
  letterSpacing: '4px',
  margin: '0 0 8px',
};

const promoDescStyle = {
  fontSize: '13px',
  color: '#1A1410',
  margin: '0',
};

const valueRowStyle = {
  borderLeft: '3px solid #C9A875',
  paddingLeft: '16px',
  marginBottom: '16px',
};

const valueIconStyle = {
  fontSize: '20px',
  margin: '0 0 4px',
};

const valueTitleStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#3D2B1F',
  margin: '0 0 2px',
};

const valueTextStyle = {
  fontSize: '13px',
  color: '#3D2B1F',
  opacity: 0.6,
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
