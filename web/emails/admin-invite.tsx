import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface IProps {
  role: string;
  link: string;
}

export const AdminInvite = ({ role, link }: IProps) => {
  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
            * {
              font-family: 'DM Sans', Arial, sans-serif;
              box-sizing: border-box;
            }
            
            /* Mobile First Responsive Design */
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 10px !important;
              }
              
              .mobile-full-width {
                width: 100% !important;
                display: block !important;
                padding: 0 !important;
              }
              
              .mobile-center {
                text-align: center !important;
              }
              
              .mobile-padding {
                padding: 20px 15px !important;
              }
              
              .mobile-stack {
                display: block !important;
                width: 100% !important;
                padding: 0 !important;
                margin-bottom: 15px !important;
              }
              
              .mobile-hide {
                display: none !important;
              }
              
              .mobile-header-text {
                font-size: 12px !important;
                text-align: center !important;
                margin-bottom: 10px !important;
              }
              
              .mobile-hero-image {
                width: 100% !important;
                max-width: 300px !important;
                height: auto !important;
                margin: 0 auto 25px auto !important;
                display: block !important;
              }
              
              .mobile-content-text {
                font-size: 14px !important;
                line-height: 1.6 !important;
                text-align: left !important;
              }
              
              .mobile-greeting {
                font-size: 18px !important;
                text-align: left !important;
              }
              
              .mobile-signature {
                font-size: 14px !important;
                text-align: left !important;
              }
              
              .mobile-section-padding {
                padding: 25px 20px !important;
              }
              
              .mobile-footer-padding {
                padding: 30px 20px !important;
              }
              
              .mobile-social-icons {
                margin: 0 8px !important;
              }
              
              .mobile-footer-text {
                font-size: 12px !important;
                line-height: 1.5 !important;
                text-align: center !important;
              }
            }
            
            /* Tablet Responsive */
            @media only screen and (min-width: 601px) and (max-width: 768px) {
              .tablet-padding {
                padding: 30px 25px !important;
              }
              
              .tablet-hero-image {
                max-width: 350px !important;
              }
            }
          `}
        </style>
      </Head>
      <Preview>Important Business Update - Unlayer LLC</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle} className="container">
          {/* Header Section */}
          <Section
            style={headerSectionStyle}
            className="mobile-section-padding"
          >
            <Row>
              <Column
                style={phoneColumnStyle}
                className="mobile-stack mobile-center"
              >
                <Text style={phoneTextStyle} className="mobile-header-text">
                  +123-456-789
                </Text>
              </Column>
              <Column
                style={viewOnlineColumnStyle}
                className="mobile-stack mobile-center"
              >
                <Link
                  href="#"
                  style={viewOnlineLinkStyle}
                  className="mobile-header-text"
                >
                  View Online
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Hero Image Section */}
          <Section
            style={heroSectionStyle}
            className="mobile-section-padding mobile-center"
          >
            <Img
              src="https://cdn.templates.unlayer.com/assets/1635863849995-ref.jpg"
              alt="Business collaboration illustration"
              style={heroImageStyle}
              className="mobile-hero-image tablet-hero-image object-cover"
            />
          </Section>

          {/* Content Section */}
          <Section
            style={contentSectionStyle}
            className="mobile-section-padding"
          >
            <Text style={greetingStyle} className="mobile-greeting">
              Hi there,
            </Text>

            <Text style={contentTextStyle} className="mobile-content-text">
              You have been invited to be part of the unmu {role} team. Please
              follow the link below to get your account active with in 1-2
              bussiness working days
            </Text>

            <Link
              href={link}
              style={{
                backgroundColor: '#f97316',

                color: '#ffffff',

                padding: '12px 24px',

                textDecoration: 'none',

                borderRadius: '4px',

                fontSize: '14px',

                fontWeight: '600',

                fontFamily: 'Inter, sans-serif',

                display: 'inline-block',

                textTransform: 'uppercase',

                letterSpacing: '0.5px',
              }}
              className="mobile-text-sm"
            >
              Register Now Using This Link
            </Link>

            <Text style={signatureStyle} className="mobile-signature">
              Best Regards,
              <br />
              Admin, Unlayer LLC.
            </Text>
          </Section>

          {/* Footer Section */}
          <Section style={footerSectionStyle} className="mobile-footer-padding">
            {/* Social Media Icons */}
            <Row style={socialRowStyle}>
              <Column style={socialColumnStyle} className="mobile-center">
                <Link
                  href="#"
                  style={socialLinkStyle}
                  className="mobile-social-icons"
                >
                  <Img
                    src="https://cdn.tools.unlayer.com/social/icons/circle-white/facebook.png"
                    alt="Facebook"
                    style={socialIconStyle}
                  />
                </Link>
                <Link
                  href="#"
                  style={socialLinkStyle}
                  className="mobile-social-icons"
                >
                  <Img
                    src="https://cdn.tools.unlayer.com/social/icons/circle-white/twitter.png"
                    alt="Twitter"
                    style={socialIconStyle}
                  />
                </Link>
                <Link
                  href="#"
                  style={socialLinkStyle}
                  className="mobile-social-icons"
                >
                  <Img
                    src="https://cdn.tools.unlayer.com/social/icons/circle-white/linkedin.png"
                    alt="LinkedIn"
                    style={socialIconStyle}
                  />
                </Link>
                <Link
                  href="#"
                  style={socialLinkStyle}
                  className="mobile-social-icons"
                >
                  <Img
                    src="https://cdn.tools.unlayer.com/social/icons/circle-white/instagram.png"
                    alt="Instagram"
                    style={socialIconStyle}
                  />
                </Link>
              </Column>
            </Row>

            {/* Company Information */}
            <Text style={companyInfoStyle} className="mobile-footer-text">
              Unlayer LLC, HR Manager
              <br />
              388 Market St, Suite 1300
              <br />
              San Francisco, CA 94111
            </Text>

            {/* Copyright */}
            <Text style={copyrightStyle} className="mobile-footer-text">
              © All rights reserved Unlayer
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminInvite;

// Enhanced Responsive Styles with DM Sans
const bodyStyle = {
  fontFamily: "'DM Sans', Arial, sans-serif",
  backgroundColor: '#f8f9fa',
  margin: '0',
  padding: '20px 0',
  lineHeight: '1.6',
  WebkitTextSizeAdjust: '100%',
  msTextSizeAdjust: '100%',
};

const containerStyle = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  width: '100%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  borderRadius: '0',
  overflow: 'hidden',
};

const headerSectionStyle = {
  backgroundColor: '#ffffff',
  padding: '20px 40px',
  borderBottom: '1px solid #e9ecef',
};

const phoneColumnStyle = {
  width: '50%',
  verticalAlign: 'middle' as const,
};

const viewOnlineColumnStyle = {
  width: '50%',
  verticalAlign: 'middle' as const,
  textAlign: 'right' as const,
};

const phoneTextStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#6c757d',
  margin: '0',
  textDecoration: 'none',
};

const viewOnlineLinkStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#4f46e5',
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  transition: 'border-color 0.3s ease',
};

const heroSectionStyle = {
  backgroundColor: '#ffffff',
  padding: '40px 40px 20px 40px',
  textAlign: 'center' as const,
};

const heroImageStyle = {
  width: '100%',
  height: 'auto',
  // maxWidth: "400px",
  display: 'block',
  margin: '0 auto',
};

const contentSectionStyle = {
  backgroundColor: '#ffffff',
  padding: '20px 40px 40px 40px',
};

const greetingStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#212529',
  margin: '0 0 25px 0',
  lineHeight: '1.3',
};

const contentTextStyle = {
  fontSize: '16px',
  fontWeight: '400',
  color: '#495057',
  margin: '0 0 20px 0',
  lineHeight: '1.7',
  textAlign: 'justify' as const,
};

const signatureStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#212529',
  margin: '35px 0 0 0',
  lineHeight: '1.5',
};

const footerSectionStyle = {
  backgroundColor: '#4f46e5',
  padding: '40px 40px 30px 40px',
  textAlign: 'center' as const,
};

const socialRowStyle = {
  marginBottom: '25px',
};

const socialColumnStyle = {
  width: '100%',
  textAlign: 'center' as const,
};

const socialLinkStyle = {
  textDecoration: 'none',
  margin: '0 12px',
  display: 'inline-block',
  transition: 'transform 0.3s ease',
};

const socialIconStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
};

const companyInfoStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#ffffff',
  margin: '0 0 20px 0',
  lineHeight: '1.6',
  opacity: '0.9',
};

const copyrightStyle = {
  fontSize: '12px',
  fontWeight: '400',
  color: '#ffffff',
  margin: '0',
  opacity: '0.7',
};
