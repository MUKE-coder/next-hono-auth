import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Tailwind,
  Img,
} from "@react-email/components";

const UNMUPendingRegistrationEmail = ({
  name = "Member",
  trackingNumber = "TRK-789456123",
  email = "member@example.com",
  phone = "+256 700 000 000",
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-50 font-sans py-[40px]">
          <Container className="bg-white rounded-[12px] shadow-xl max-w-[650px] mx-auto overflow-hidden">
            {/* Header with Gradient */}
            <Section className="bg-gradient-to-r from-red-600 to-red-700 px-[40px] py-[40px] text-center relative">
              <div className="absolute inset-0 bg-black opacity-5"></div>
              <div className="relative z-10">
                <Img
                  src="https://new.email/static/app/placeholder.png"
                  alt="UNMU Logo"
                  width="90"
                  height="90"
                  className="mx-auto mb-[20px] rounded-full bg-white p-2 shadow-lg"
                />
                <Heading className="text-[32px] font-bold text-white mb-[8px] mt-0 tracking-wide">
                  UNMU
                </Heading>
                <Text className="text-[16px] text-red-100 m-0 font-medium">
                  Uganda Nurses & Midwives Union
                </Text>
                <Text className="text-[14px] text-red-200 mt-[8px] mb-0 italic">
                  "Advancing Healthcare Excellence Together"
                </Text>
              </div>
            </Section>

            {/* Status Indicator */}
            <Section className="px-[40px] pt-[32px] pb-[16px]">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-[12px] px-[24px] py-[20px] text-center">
                <div className="inline-flex items-center justify-center w-[60px] h-[60px] bg-yellow-400 rounded-full mb-[16px]">
                  <Text className="text-[24px] m-0">⏳</Text>
                </div>
                <Heading className="text-[20px] font-bold text-yellow-800 mb-[8px] mt-0">
                  Registration Under Review
                </Heading>
                <Text className="text-[14px] text-yellow-700 m-0">
                  Your application is being processed by our team
                </Text>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="px-[40px] py-[24px]">
              <Heading className="text-[28px] font-bold text-gray-900 mb-[20px] mt-0 leading-[1.3]">
                Thank you, {name}! 🙏
              </Heading>

              <Text className="text-[18px] text-gray-700 mb-[24px] mt-0 leading-[28px] font-light">
                We have successfully received your membership application for
                the Uganda Nurses and Midwives Union. Your dedication to
                advancing healthcare in Uganda is truly appreciated.
              </Text>

              <Text className="text-[16px] text-gray-600 mb-[32px] mt-0 leading-[26px]">
                Your registration is currently being reviewed by our membership
                committee. This process typically takes{" "}
                <strong>3-5 business days</strong>. You will receive an email
                notification once your application has been approved and your
                membership is activated.
              </Text>

              {/* Registration Details Card */}
              <Section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-[16px] px-[32px] py-[28px] mb-[32px] shadow-sm">
                <Heading className="text-[20px] font-bold text-blue-900 mb-[20px] mt-0 flex items-center">
                  📋 Your Registration Details
                </Heading>

                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-blue-100 pb-[12px]">
                    <Text className="text-[14px] text-blue-700 m-0 font-medium">
                      Tracking Number:
                    </Text>
                    <Text className="text-[14px] text-blue-900 m-0 font-bold font-mono bg-blue-100 px-[12px] py-[4px] rounded-[6px]">
                      {trackingNumber}
                    </Text>
                  </div>

                  <div className="flex justify-between items-center border-b border-blue-100 pb-[12px]">
                    <Text className="text-[14px] text-blue-700 m-0 font-medium">
                      Email Address:
                    </Text>
                    <Text className="text-[14px] text-blue-900 m-0 font-semibold">
                      {email}
                    </Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className="text-[14px] text-blue-700 m-0 font-medium">
                      Phone Number:
                    </Text>
                    <Text className="text-[14px] text-blue-900 m-0 font-semibold">
                      {phone}
                    </Text>
                  </div>
                </div>

                <Section className="bg-blue-100 rounded-[8px] px-[16px] py-[12px] mt-[20px]">
                  <Text className="text-[13px] text-blue-800 m-0 text-center">
                    💡 <strong>Important:</strong> Save your tracking number for
                    checking your application status
                  </Text>
                </Section>
              </Section>

              {/* Action Buttons */}
              <Section className="text-center mb-[32px]">
                <Text className="text-[16px] text-gray-700 mb-[24px] mt-0">
                  Track your application status and stay updated on your
                  membership progress:
                </Text>

                <div className="flex flex-col gap-[12px] items-center">
                  <Button
                    href={`https://portal.unmu.org/track?number=${trackingNumber}`}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-[40px] py-[16px] rounded-[10px] text-[16px] font-semibold no-underline shadow-lg hover:from-green-700 hover:to-green-800 transition-all"
                  >
                    🔍 Track Application Status
                  </Button>

                  <Button
                    href="https://portal.unmu.org"
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-[40px] py-[16px] rounded-[10px] text-[16px] font-semibold no-underline shadow-lg hover:from-red-700 hover:to-red-800 transition-all"
                  >
                    🏠 Visit Member Portal
                  </Button>
                </div>
              </Section>

              <Hr className="border-gray-200 my-[32px]" />

              {/* What Happens Next */}
              <Section className="mb-[32px]">
                <Heading className="text-[20px] font-bold text-gray-900 mb-[20px] mt-0">
                  What Happens Next? 📅
                </Heading>

                <div className="space-y-4">
                  <div className="flex items-start gap-[16px]">
                    <div className="w-[32px] h-[32px] bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-[4px]">
                      <Text className="text-[14px] text-white font-bold m-0">
                        1
                      </Text>
                    </div>
                    <div>
                      <Text className="text-[16px] text-gray-900 font-semibold mb-[4px] mt-0">
                        Document Review
                      </Text>
                      <Text className="text-[14px] text-gray-600 m-0">
                        Our team will verify your credentials and supporting
                        documents
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-[16px]">
                    <div className="w-[32px] h-[32px] bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-[4px]">
                      <Text className="text-[14px] text-white font-bold m-0">
                        2
                      </Text>
                    </div>
                    <div>
                      <Text className="text-[16px] text-gray-900 font-semibold mb-[4px] mt-0">
                        Committee Approval
                      </Text>
                      <Text className="text-[14px] text-gray-600 m-0">
                        Membership committee reviews and approves your
                        application
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-[16px]">
                    <div className="w-[32px] h-[32px] bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-[4px]">
                      <Text className="text-[14px] text-white font-bold m-0">
                        3
                      </Text>
                    </div>
                    <div>
                      <Text className="text-[16px] text-gray-900 font-semibold mb-[4px] mt-0">
                        Welcome Email
                      </Text>
                      <Text className="text-[14px] text-gray-600 m-0">
                        You'll receive your member number and login credentials
                      </Text>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Contact Information */}
              <Section>
                <Heading className="text-[20px] font-bold text-gray-900 mb-[20px] mt-0">
                  Need Assistance? 💬
                </Heading>

                <Text className="text-[16px] text-gray-700 mb-[20px] mt-0 leading-[24px]">
                  If you have questions about your application or need to update
                  any information, our support team is ready to help:
                </Text>

                <Section className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-[12px] px-[24px] py-[20px] mb-[24px]">
                  <div className="grid grid-cols-1 gap-[12px]">
                    <div className="flex items-center gap-[12px]">
                      <Text className="text-[24px] m-0">📧</Text>
                      <div>
                        <Text className="text-[14px] text-gray-700 font-semibold mb-[2px] mt-0">
                          Email Support
                        </Text>
                        <Text className="text-[14px] text-blue-600 m-0 underline">
                          membership@unmu.org
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center gap-[12px]">
                      <Text className="text-[24px] m-0">📞</Text>
                      <div>
                        <Text className="text-[14px] text-gray-700 font-semibold mb-[2px] mt-0">
                          Phone Support
                        </Text>
                        <Text className="text-[14px] text-gray-600 m-0">
                          +256 414 123 456 | +256 700 123 456
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center gap-[12px]">
                      <Text className="text-[24px] m-0">🏢</Text>
                      <div>
                        <Text className="text-[14px] text-gray-700 font-semibold mb-[2px] mt-0">
                          Office Address
                        </Text>
                        <Text className="text-[14px] text-gray-600 m-0">
                          UNMU House, Plot 123 Kampala Road, Kampala
                        </Text>
                      </div>
                    </div>
                  </div>
                </Section>

                <Section className="bg-green-50 border border-green-200 rounded-[8px] px-[20px] py-[16px]">
                  <Text className="text-[14px] text-green-800 m-0 text-center">
                    <strong>Office Hours:</strong> Monday - Friday, 8:00 AM -
                    5:00 PM (EAT)
                  </Text>
                </Section>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="bg-gradient-to-r from-gray-800 to-gray-900 px-[40px] py-[32px] text-center">
              <Heading className="text-[18px] font-bold text-white mb-[16px] mt-0">
                Uganda Nurses & Midwives Union
              </Heading>
              <Text className="text-[14px] text-gray-300 mb-[16px] mt-0">
                Empowering healthcare professionals across Uganda since 1970
              </Text>
              <Text className="text-[12px] text-gray-400 mb-[16px] mt-0">
                © 2025 Uganda Nurses and Midwives Union (UNMU). All rights
                reserved.
              </Text>
              <Text className="text-[12px] text-gray-400 m-0">
                <a
                  href="#"
                  className="text-gray-400 underline hover:text-white"
                >
                  Privacy Policy
                </a>
                <span className="mx-[8px]">|</span>
                <a
                  href="#"
                  className="text-gray-400 underline hover:text-white"
                >
                  Terms of Service
                </a>
                <span className="mx-[8px]">|</span>
                <a
                  href="#"
                  className="text-gray-400 underline hover:text-white"
                >
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

UNMUPendingRegistrationEmail.PreviewProps = {
  firstName: "Sarah",
  lastName: "Nakato",
  trackingNumber: "TRK-789456123",
  email: "sarah.nakato@example.com",
  phone: "+256 700 123 456",
  submissionDate: "15 December 2024",
};

export default UNMUPendingRegistrationEmail;
