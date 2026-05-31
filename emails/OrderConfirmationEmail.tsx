import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface OrderItem {
  name: string;
  variant: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
}

export default function OrderConfirmationEmail({
  orderNumber = 'LUX-2026-12345',
  customerName,
  items = [
    { name: 'Extension Lisse Naturelle', variant: '40cm - Noir Naturel', quantity: 1, price: 890 },
  ],
  subtotal = 890,
  shipping = 0,
  discount = 0,
  total = 890,
  shippingAddress = {
    firstName: 'Fatima',
    lastName: 'Alaoui',
    address: '12 Rue Hassan II',
    city: 'Casablanca',
    postalCode: '20000',
    country: 'MA',
  },
  shippingMethod = 'STANDARD',
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre commande {orderNumber} est confirmée — Ritual Glowry</Preview>
      <Body style={bodyStyle}>
        {/* Header */}
        <Section style={headerStyle}>
          <Text style={logoStyle}>Ritual Glowry</Text>
          <Text style={taglineStyle}>Premium Hair — Maroc</Text>
        </Section>

        <Container style={containerStyle}>
          {/* Hero */}
          <Section style={heroStyle}>
            <Heading style={h1Style}>
              Merci pour votre commande&nbsp;!
            </Heading>
            {customerName && (
              <Text style={subTextStyle}>Bonjour {customerName},</Text>
            )}
            <Text style={subTextStyle}>
              Votre commande a bien été reçue et est en cours de traitement.
            </Text>
          </Section>

          {/* Order number badge */}
          <Section style={badgeContainerStyle}>
            <Text style={badgeLabelStyle}>Numéro de commande</Text>
            <Text style={badgeValueStyle}>{orderNumber}</Text>
          </Section>

          <Hr style={hrStyle} />

          {/* Items table */}
          <Section>
            <Heading style={h2Style}>Votre commande</Heading>
            {items.map((item, idx) => (
              <Row key={idx} style={tableRowStyle}>
                <Column style={tableColMainStyle}>
                  <Text style={itemNameStyle}>{item.name}</Text>
                  <Text style={itemVariantStyle}>{item.variant} × {item.quantity}</Text>
                </Column>
                <Column style={tableColPriceStyle}>
                  <Text style={itemPriceStyle}>
                    {(item.price * item.quantity).toLocaleString('fr-MA')} MAD
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={hrStyle} />

          {/* Totals */}
          <Section>
            <Row style={totalRowStyle}>
              <Column><Text style={totalLabelStyle}>Sous-total</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalValueStyle}>{subtotal.toLocaleString('fr-MA')} MAD</Text>
              </Column>
            </Row>
            <Row style={totalRowStyle}>
              <Column><Text style={totalLabelStyle}>Livraison ({shippingMethod})</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalValueStyle}>
                  {shipping === 0 ? 'Offert' : `${shipping.toLocaleString('fr-MA')} MAD`}
                </Text>
              </Column>
            </Row>
            {discount > 0 && (
              <Row style={totalRowStyle}>
                <Column><Text style={discountLabelStyle}>Code promo</Text></Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={discountValueStyle}>−{discount.toLocaleString('fr-MA')} MAD</Text>
                </Column>
              </Row>
            )}
            <Hr style={hrStyle} />
            <Row>
              <Column>
                <Text style={grandTotalLabelStyle}>Total</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={grandTotalValueStyle}>
                  {total.toLocaleString('fr-MA')} MAD
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hrStyle} />

          {/* Shipping address */}
          <Section>
            <Heading style={h2Style}>Adresse de livraison</Heading>
            <Text style={addressStyle}>
              {shippingAddress.firstName} {shippingAddress.lastName}
              <br />
              {shippingAddress.address}
              <br />
              {shippingAddress.postalCode} {shippingAddress.city}
              <br />
              {shippingAddress.country}
            </Text>
          </Section>

          <Hr style={hrStyle} />

          {/* CTA */}
          <Section style={{ textAlign: 'center', padding: '24px 0' }}>
            <Button href="https://ritualglowry.com/compte/commandes" style={buttonStyle}>
              Suivre ma commande
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={hrStyle} />
          <Section>
            <Text style={footerStyle}>
              © {new Date().getFullYear()} Ritual Glowry · Maroc
            </Text>
            <Text style={footerStyle}>
              Instagram · TikTok · Facebook
            </Text>
            <Text style={footerLinkStyle}>
              Se désabonner
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const bodyStyle = {
  backgroundColor: '#FAF6EF',
  fontFamily: 'Inter, -apple-system, sans-serif',
  margin: '0',
  padding: '0',
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
  paddingBottom: '24px',
};

const h1Style = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '28px',
  color: '#3D2B1F',
  margin: '0 0 8px',
};

const subTextStyle = {
  fontSize: '14px',
  color: '#3D2B1F',
  opacity: 0.7,
  margin: '4px 0',
};

const badgeContainerStyle = {
  backgroundColor: '#F5EDE0',
  padding: '16px 20px',
  borderLeft: '4px solid #C9A875',
  margin: '0 0 24px',
};

const badgeLabelStyle = {
  fontSize: '11px',
  color: '#3D2B1F',
  opacity: 0.6,
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  margin: '0 0 4px',
};

const badgeValueStyle = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '22px',
  color: '#C9A875',
  fontWeight: 'bold',
  margin: '0',
};

const hrStyle = {
  borderColor: '#F5EDE0',
  margin: '20px 0',
};

const h2Style = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '18px',
  color: '#3D2B1F',
  margin: '0 0 16px',
};

const tableRowStyle = {
  borderBottom: '1px solid #F5EDE0',
  padding: '12px 0',
};

const tableColMainStyle = {
  width: '70%',
};

const tableColPriceStyle = {
  width: '30%',
  textAlign: 'right' as const,
};

const itemNameStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#3D2B1F',
  margin: '0 0 2px',
};

const itemVariantStyle = {
  fontSize: '12px',
  color: '#3D2B1F',
  opacity: 0.5,
  margin: '0',
};

const itemPriceStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#C9A875',
  margin: '0',
};

const totalRowStyle = {
  padding: '4px 0',
};

const totalLabelStyle = {
  fontSize: '13px',
  color: '#3D2B1F',
  opacity: 0.6,
  margin: '0',
};

const totalValueStyle = {
  fontSize: '13px',
  color: '#3D2B1F',
  margin: '0',
};

const discountLabelStyle = {
  ...totalLabelStyle,
  color: '#C9A8A0',
};

const discountValueStyle = {
  ...totalValueStyle,
  color: '#C9A8A0',
};

const grandTotalLabelStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#3D2B1F',
  margin: '0',
};

const grandTotalValueStyle = {
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#1A1410',
  margin: '0',
};

const addressStyle = {
  fontSize: '13px',
  color: '#3D2B1F',
  lineHeight: '1.6',
  opacity: 0.8,
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
  cursor: 'pointer',
};
