export const generateTrackingNumber = (): string => {
  // Generate 8-digit tracking number
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return (timestamp.slice(-5) + random).slice(0, 8);
};

// Utility functions for member number generation
export const generateMemberNumber = (
  category: string,
  voteCode: number,
  sequence: number,
  gender: "MALE" | "FEMALE"
): string => {
  const genderPrefix = gender === "MALE" ? "M" : "F";
  const paddedSequence = sequence.toString().padStart(5, "0");

  // Map category to prefix
  const categoryPrefix =
    {
      PUBLIC_SERVICE: "GU",
      PRIVATE_SECTOR: "PS",
      NON_PROFIT: "NFP",
      RETIRED: "RTD",
      CLINICS: "CL"
    }[category] || "GU";

  return `${categoryPrefix}${voteCode}${paddedSequence}${genderPrefix}`;
};
