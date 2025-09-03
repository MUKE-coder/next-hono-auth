import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { UserDetail } from "@/actions/user-detail";

// Register fonts (optional - you can use default fonts)
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: 2,
    borderBottomColor: "#dc2626",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#dc2626",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  memberInfo: {
    backgroundColor: "#f8fafc",
    padding: 20,
    marginBottom: 25,
    borderRadius: 8,
    borderLeft: 4,
    borderLeftColor: "#dc2626",
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    backgroundColor: "#e5e7eb",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 5,
  },
  memberTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  memberMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginRight: 5,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 500,
    color: "#374151",
  },
  statusBadge: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 500,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  column: {
    flex: 1,
    marginRight: 20,
  },
  label: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 3,
    fontWeight: 500,
  },
  value: {
    fontSize: 12,
    color: "#111827",
    fontWeight: 400,
  },
  fullWidth: {
    marginBottom: 12,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: "#e5e7eb",
  },
  footerText: {
    fontSize: 10,
    color: "#9ca3af",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 60,
    color: "#f3f4f6",
    fontWeight: 700,
    zIndex: -1,
  },
});

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatSalary = (salary: number) => {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
  }).format(salary);
};

const getAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const getCategoryLabel = (category: string) => {
  const labels = {
    PUBLIC_SERVICE: "Public Service",
    PRIVATE_SECTOR: "Private Sector",
    NON_PROFIT: "Non-Profit Organization",
    RETIRED: "Retired",
    CLINICS: "Private Clinics",
  };
  return labels[category as keyof typeof labels] || category;
};

const getTitleLabel = (title: string) => {
  return title
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const getMembershipDuration = (createdAt: string) => {
  const createdDate = new Date(createdAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return `${years} year${years > 1 ? "s" : ""}${
      remainingMonths > 0
        ? ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`
        : ""
    }`;
  }
};

interface UserDetailPDFProps {
  user: UserDetail;
}

export const UserDetailPDF: React.FC<UserDetailPDFProps> = ({ user }) => {
  const fullName = user.name || `${user.surname} ${user.otherNames}`.trim();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <View style={styles.watermark}>
          <Text>UNMU</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Uganda Nurses & Midwives Union</Text>
            <Text style={styles.subtitle}>Member Profile Report</Text>
            <Text style={styles.subtitle}>
              Generated on {formatDate(new Date().toISOString())}
            </Text>
          </View>
        </View>

        {/* Member Information Card */}
        <View style={styles.memberInfo}>
          <View style={styles.memberHeader}>
            {user.image && <Image style={styles.avatar} src={user.image} />}
            <View style={styles.memberDetails}>
              <Text style={styles.memberName}>{fullName}</Text>
              <Text style={styles.memberTitle}>
                {getTitleLabel(user.profile.title)}
              </Text>

              <View style={styles.memberMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Member #:</Text>
                  <Text style={styles.metaValue}>
                    {user.profile.memberNumber}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Category:</Text>
                  <Text style={styles.metaValue}>
                    {getCategoryLabel(user.profile.category)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Member for:</Text>
                  <Text style={styles.metaValue}>
                    {getMembershipDuration(user.createdAt)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      user.status === "ACTIVE"
                        ? "#10b981"
                        : user.status === "PENDING"
                        ? "#f59e0b"
                        : user.status === "SUSPENDED"
                        ? "#ef4444"
                        : "#6b7280",
                  },
                ]}
              >
                <Text>{user.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Surname</Text>
              <Text style={styles.value}>{user.surname}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Other Names</Text>
              <Text style={styles.value}>{user.otherNames}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{user.profile.gender}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>
                {getAge(user.profile.dateOfBirth)} years old
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Date of Birth</Text>
              <Text style={styles.value}>
                {formatDate(user.profile.dateOfBirth)}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>National ID (NIN)</Text>
              <Text style={styles.value}>{user.profile.ninNumber}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>District</Text>
              <Text style={styles.value}>{user.profile.district}</Text>
            </View>
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>Home Address</Text>
            <Text style={styles.value}>{user.profile.homeAddress}</Text>
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>Workplace Address</Text>
            <Text style={styles.value}>{user.profile.workplaceAddress}</Text>
          </View>
        </View>

        {/* Employment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment Information</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Professional Title</Text>
              <Text style={styles.value}>
                {getTitleLabel(user.profile.title)}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>
                {getCategoryLabel(user.profile.category)}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Employee Number</Text>
              <Text style={styles.value}>{user.profile.employeeNo}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Computer Number</Text>
              <Text style={styles.value}>{user.profile.computerNumber}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Present Salary</Text>
              <Text style={styles.value}>
                {formatSalary(user.profile.presentSalary)}
              </Text>
            </View>
          </View>
        </View>

        {/* Membership Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership Information</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Member Number</Text>
              <Text style={styles.value}>{user.profile.memberNumber}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Tracking Number</Text>
              <Text style={styles.value}>{user.profile.trackingNumber}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Registration Date</Text>
              <Text style={styles.value}>{formatDate(user.createdAt)}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Membership Duration</Text>
              <Text style={styles.value}>
                {getMembershipDuration(user.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{user.status}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Verification Status</Text>
              <Text style={styles.value}>
                {user.isVerified ? "Verified" : "Pending Verification"}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This document was generated by the UNMU Management System
          </Text>
          <Text style={styles.footerText}>
            © 2025 Uganda Nurses & Midwives Union. All rights reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
