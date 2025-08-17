"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import codes from "@/app/frontend/components/most_recent_occupations.json" assert { type: "json" };
import locales from "@/app/frontend/components/locales.json" assert { type: "json" };

export default function InfoPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [streetLine1, setStreetLine1] = useState("");
  const [streetLine2, setStreetLine2] = useState("");
  const [city, setCity] = useState("");
  const [nationalIdIssuingCountry, setnationalIdIssuingCountry] = useState("");
  const [nationalIdType, setnationalIdType] = useState("");
  const [nationalIdNumber, setnationalIdNumber] = useState("");
  const [stateRegionProvince, setStateRegionProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [locale, setLocale] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [mostRecentOccupation, setMostRecentOccupation] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [accountPurpose, setAccountPurpose] = useState("");
  const [expectedMonthlyPaymentsUsd, setExpectedMonthlyPaymentsUsd] = useState("");
  const [governmentIdNumber, setGovernmentIdNumber] = useState("");
  const [govIdIssuanceDate, setGovIdIssuanceDate] = useState("");
  const [govIdExpirationDate, setGovIdExpirationDate] = useState("");
  const [frontIdImage, setFrontIdImage] = useState<File | null>(null); // Ensure initial value is null for file inputs
  const [backIdImage, setBackIdImage] = useState<File | null>(null);   // Ensure initial value is null for file inputs
  const [proofOfAddressImage, setProofOfAddressImage] = useState<File | null>(null); // Ensure initial value is null for file inputs
  const router = useRouter();

  async function toBase64(file: File | null): Promise<string | null> {
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleSubmit() {
  // Convert files to base64
  const [frontBase64, backBase64, proofBase64] = await Promise.all([
    toBase64(frontIdImage),
    toBase64(backIdImage),
    toBase64(proofOfAddressImage),
  ]);

  const payload = {
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    address: {
      streetLine1,
      streetLine2,
      city,
      stateRegionProvince,
      postalCode,
      countryCode,
      locale,
    },
    nationalIdIssuingCountry,
    nationalIdType,
    nationalIdNumber,
    employmentStatus,
    mostRecentOccupation,
    sourceOfFunds,
    accountPurpose,
    expectedMonthlyPaymentsUsd,
    governmentIdNumber,
    govIdIssuanceDate,
    govIdExpirationDate,
    frontIdImage: frontBase64,
    backIdImage: backBase64,
    proofOfAddressImage: proofBase64,
  };

  try {
    const res = await fetch("http://localhost:3000/api/create_account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to create account");
    }

    handleContinue();
  } catch (err) {
    alert("Error creating account: " + (err as Error).message);
  }
}

  const handleContinue = () => {
    if (firstName.trim() && lastName.trim() && email.trim()) {
      router.push("/frontend/signup/verify_id");
    } else {
      alert("Please fill in first name, last name, and email");
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      {/* Soft brand overlay to keep text readable */}
      <div className="absolute inset-0"/>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md border border-pink-200/70 rounded-3xl shadow-xl p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#582A55] tracking-tight" style={{ fontFamily: "'Moirai One', cursive" }}>
              Create your private profile
            </h1>
            <p className="mt-2 text-base sm:text-lg text-[#8B6F74]" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
              Set up your tea account - spill safely.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
            {/* First/Last */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-[black]">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Belly"

                  autoComplete="given-name"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-[black]">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Fisher"
                  autoComplete="family-name"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[black]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bellyfisher@tea.app"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                           focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
              />
              <p className="text-xs text-[#8B6F74] mt-1">
                For secure access & recovery only. Never shown publicly.
              </p>
            </div>

            {/* UserName */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-[black]">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="jerfisher123"
                autoComplete="name"
                required
                className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                           focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
              />
              <p className="text-xs text-[#8B6F74] mt-1">
                This is the only info that Tea On-Chain will store.
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phonenumber" className="block text-sm font-medium text-[black]">
                Phone Number
              </label>
              <input
                id="phonenumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(123) 456-7890"
                autoComplete="tel"
                required
                className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                        focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-[black]">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                           focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="streetLine1" className="block text-sm font-medium text-[black]">Street Address Line 1</label>
                <input
                  id="streetLine1"
                  type="text"
                  value={streetLine1}
                  onChange={(e) => setStreetLine1(e.target.value)}
                  placeholder="123 Main St"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                            focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="streetLine2" className="block text-sm font-medium text-[black]">Street Address Line 2</label>
                <input
                  id="streetLine2"
                  type="text"
                  value={streetLine2}
                  onChange={(e) => setStreetLine2(e.target.value)}
                  placeholder="Apt 101"
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                            focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-[black]">City</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stateRegionProvince" className="block text-sm font-medium text-[black]">State/Region/Province</label>
                <input
                  id="stateRegionProvince"
                  type="text"
                  value={stateRegionProvince}
                  onChange={(e) => setStateRegionProvince(e.target.value)}
                  placeholder="NY"
                  maxLength={2}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="postalCode" className="block text-sm font-medium text-[black]">Postal Code</label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10001"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
            </div>

            {/* National ID Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="nationalIdIssuingCountry"
                  className="block text-sm font-medium text-[black]"
                >
                  National ID Issuing Country
                </label>
                <select
                  id="nationalIdIssuingCountry"
                  value={nationalIdIssuingCountry}
                  onChange={(e) => setnationalIdIssuingCountry(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                            focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                >
                  <option value="" disabled>
                    Select country
                  </option>
                  {[
                    "AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AZ",
                    "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BM","BN","BO","BQ","BR",
                    "BS","BT","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL",
                    "CM","CN","CO","CR","CU","CV","CW","CY","CZ","DE","DJ","DK","DM","DO",
                    "DZ","EC","EE","EG","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA",
                    "GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GT",
                    "GU","GW","GY","HK","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO",
                    "IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN",
                    "KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU",
                    "LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO",
                    "MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE",
                    "NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG",
                    "PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS",
                    "RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM",
                    "SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH",
                    "TJ","TK","TL","TM","TN","TO","TR","TT","TV","TZ","UA","UG","UM","US",
                    "UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA",
                    "ZM","ZW"
                  ].map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="nationalIdType" className="block text-sm font-medium text-[black]">
                  National ID Type
                </label>
                <input
                  id="nationalIdType"
                  type="text"
                  value={nationalIdType}
                  onChange={(e) => setnationalIdType(e.target.value)}
                  placeholder="ssn, tin, cpf, etc."
                  maxLength={3}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="nationalIdNumber" className="block text-sm font-medium text-[black]">
                  National ID Number
                </label>
                <input
                  id="nationalIdNumber"
                  type="text"
                  value={nationalIdNumber}
                  onChange={(e) => setnationalIdNumber(e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
            </div>

            {/* Country Code and Locale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="countryCode" className="block text-sm font-medium text-[black]">Country Code</label>
                <select
    id="countryCode"
    value={countryCode}
    onChange={(e) => setCountryCode(e.target.value)}
    required
    className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B]
               focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
  >
    <option value="" disabled>Select country</option>
    {[
      "AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AZ",
      "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BM","BN","BO","BQ","BR",
      "BS","BT","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL",
      "CM","CN","CO","CR","CU","CV","CW","CY","CZ","DE","DJ","DK","DM","DO",
      "DZ","EC","EE","EG","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA",
      "GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GT",
      "GU","GW","GY","HK","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO",
      "IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN",
      "KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU",
      "LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO",
      "MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE",
      "NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG",
      "PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS",
      "RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM",
      "SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH",
      "TJ","TK","TL","TM","TN","TO","TR","TT","TV","TZ","UA","UG","UM","US",
      "UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA",
      "ZM","ZW"
    ].map((code) => (
      <option key={code} value={code}>{code}</option>
    ))}
  </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="locale" className="block text-sm font-medium text-[black]">Locale</label>
                <select
                  id="locale"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B]
                            focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                >
                  <option value="" disabled>Select locale</option>
                  {locales.locales.map((loc: string) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Employment Status and Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
              <label htmlFor="employmentStatus" className="block text-sm font-medium text-[black]">Employment Status</label>
              <select
                id="employmentStatus"
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                required
                className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
              >
                <option value="" disabled>Select status</option>
                <option value="EMPLOYED">EMPLOYED</option>
                <option value="SELF_EMPLOYED">SELF_EMPLOYED</option>
                <option value="UNEMPLOYED">UNEMPLOYED</option>
                <option value="RETIRED">RETIRED</option>
                <option value="STUDENT">STUDENT</option>
                <option value="HOMEMAKER">HOMEMAKER</option>
              </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="mostRecentOccupation" className="block text-sm font-medium text-[black]">Most Recent Occupation</label>
                <select
                  id="occupationCode"
                  value={mostRecentOccupation}
                  onChange={(e) => setMostRecentOccupation(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 
                            text-[#1B1B1B] focus:outline-none focus:ring-2 
                            focus:ring-[#FF2D91] focus:border-transparent"
                >
                  <option value="" disabled>Select code</option>
                  {codes.codes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source of Funds and Account Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                <label htmlFor="sourceOfFunds" className="block text-sm font-medium text-[black]">Source of Funds</label>
                <select
                  id="sourceOfFunds"
                  value={sourceOfFunds}
                  onChange={(e) => setSourceOfFunds(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                >
                  <option value="" disabled>Select source</option>
                  <option value="COMPANY_FUNDS">COMPANY_FUNDS</option>
                  <option value="E_COMMERCE_RESELLER">E_COMMERCE_RESELLER</option>
                  <option value="GAMBLING_PROCEEDS">GAMBLING_PROCEEDS</option>
                  <option value="GIFTS">GIFTS</option>
                  <option value="GOVERNMENT_BENEFITS">GOVERNMENT_BENEFITS</option>
                  <option value="INHERITANCE">INHERITANCE</option>
                  <option value="INVESTMENTS_OR_LOANS">INVESTMENTS_OR_LOANS</option>
                  <option value="PENSION_RETIREMENT_FUNDS">PENSION_RETIREMENT_FUNDS</option>
                  <option value="PROCEEDS_FROM_REAL_ESTATE_SALES">PROCEEDS_FROM_REAL_ESTATE_SALES</option>
                  <option value="SALARY">SALARY</option>
                  <option value="SAVINGS">SAVINGS</option>
                  <option value="SOMEONE_ELSES_FUNDS">SOMEONE_ELSES_FUNDS</option>
                  <option value="BUSINESS_LOANS">BUSINESS_LOANS</option>
                  <option value="GRANTS">GRANTS</option>
                  <option value="INTER_COMPANY_FUNDS">INTER_COMPANY_FUNDS</option>
                  <option value="INVESTMENT_PROCEEDS">INVESTMENT_PROCEEDS</option>
                  <option value="LEGAL_SETTLEMENT">LEGAL_SETTLEMENT</option>
                  <option value="OWNERS_CAPITAL">OWNERS_CAPITAL</option>
                  <option value="PENSION_OR_RETIREMENT">PENSION_OR_RETIREMENT</option>
                  <option value="SALE_OF_ASSETS">SALE_OF_ASSETS</option>
                  <option value="SALE_OF_GOODS_AND_SERVICES">SALE_OF_GOODS_AND_SERVICES</option>
                  <option value="TAX_REFUND">TAX_REFUND</option>
                  <option value="THIRD_PARTY_FUNDS">THIRD_PARTY_FUNDS</option>
                  <option value="TREASURY_RESERVES">TREASURY_RESERVES</option>
                </select>
                </div>
              <div className="space-y-2">
                <label htmlFor="accountPurpose" className="block text-sm font-medium text-[black]">Account Purpose</label>
                <select
                  id="accountPurpose"
                  value={accountPurpose}
                  onChange={(e) => setAccountPurpose(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                >
                  <option value="" disabled>Select purpose</option>
                  <option value="CHARITABLE_DONATIONS">CHARITABLE_DONATIONS</option>
                  <option value="COMPANY_OPERATIONS">COMPANY_OPERATIONS</option>
                  <option value="E_COMMERCE_PAYMENTS">E_COMMERCE_PAYMENTS</option>
                  <option value="FREELANCE_PAYMENTS">FREELANCE_PAYMENTS</option>
                  <option value="INVESTMENT">INVESTMENT</option>
                  <option value="PAYMENTS_TO_FRIENDS_FAMILY_ABROAD">PAYMENTS_TO_FRIENDS_FAMILY_ABROAD</option>
                  <option value="PERSONAL_EXPENSES">PERSONAL_EXPENSES</option>
                  <option value="PURCHASING_GOODS_OR_SERVICES">PURCHASING_GOODS_OR_SERVICES</option>
                  <option value="SALARY_PAYMENTS">SALARY_PAYMENTS</option>
                  <option value="WEALTH_PROTECTION">WEALTH_PROTECTION</option>
                  <option value="OTHER">OTHER</option>
                  <option value="PAYROLL">PAYROLL</option>
                  <option value="RECEIVING_GOODS_OR_SERVICES">RECEIVING_GOODS_OR_SERVICES</option>
                  <option value="TAX_OPTIMIZATION">TAX_OPTIMIZATION</option>
                  <option value="THIRD_PARTY_PAYMENTS">THIRD_PARTY_PAYMENTS</option>
                  <option value="TREASURY_MANAGEMENT">TREASURY_MANAGEMENT</option>
                </select>
              </div>
            </div>

            {/* Expected Monthly Payments */}
            <div className="space-y-2">
              <label htmlFor="expectedMonthlyPaymentsUsd" className="block text-sm font-medium text-[black]">
              Expected Monthly Payments (USD)
              </label>
              <select
              id="expectedMonthlyPaymentsUsd"
              value={expectedMonthlyPaymentsUsd}
              onChange={(e) => setExpectedMonthlyPaymentsUsd(e.target.value)}
              required
              className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
              >
              <option value="" disabled>Select range</option>
              <option value="LESS_THAN_5000">Less than $5,000</option>
              <option value="BETWEEN_5000_9999">$5,000 - $9,999</option>
              <option value="BETWEEN_10000_49999">$10,000 - $49,999</option>
              <option value="OVER_50000">Over $50,000</option>
              <option value="LESS_THAN_10000">Less than $10,000</option>
              <option value="BETWEEN_10000_99999">$10,000 - $99,999</option>
              <option value="BETWEEN_100000_999999">$100,000 - $999,999</option>
              <option value="BETWEEN_1000000_9999999">$1,000,000 - $9,999,999</option>
              <option value="OVER_10000000">Over $10,000,000</option>
              </select>
            </div>

            {/* Government ID and Images */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="governmentIdNumber" className="block text-sm font-medium text-[black]">Government ID Number</label>
                <input
                  id="governmentIdNumber"
                  type="text"
                  value={governmentIdNumber}
                  onChange={(e) => setGovernmentIdNumber(e.target.value)}
                  placeholder="123456789"
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="govIdIssuanceDate" className="block text-sm font-medium text-[black]">Issuance Date</label>
                <input
                  id="govIdIssuanceDate"
                  type="date"
                  value={govIdIssuanceDate}
                  onChange={(e) => setGovIdIssuanceDate(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="govIdExpirationDate" className="block text-sm font-medium text-[black]">Expiration Date</label>
                <input
                  id="govIdExpirationDate"
                  type="date"
                  value={govIdExpirationDate}
                  onChange={(e) => setGovIdExpirationDate(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60
                             focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
                />
              </div>
            </div>

            {/* File Inputs */}
            <div className="space-y-2">
              <label
              htmlFor="frontIdImage"
              className="block text-sm font-medium text-[black]"
              >
              Front ID Image
              <span className="ml-1 text-xs text-[#8B6F74]">(e.g. driver's license, passport)</span>
              </label>
              <div className="flex items-center gap-4">
              <input
                id="frontIdImage"
                type="file"
                accept="image/*"
                onChange={(e) => setFrontIdImage(e.target.files ? e.target.files[0] : null)}
                required
                className="flex-1 rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-2 text-[#1B1B1B] placeholder-[#8B6F74]/60
                focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:bg-[#FF2D91]/10 file:text-[#582A55] file:font-semibold
                file:transition-colors file:duration-200
                file:hover:bg-[#FF2D91]/30 file:hover:text-[#1B1B1B]
                file:cursor-pointer cursor-pointer"
              />
              {frontIdImage && (
                <span className="text-xs text-[#8B6F74] truncate max-w-[120px]">
                {frontIdImage.name}
                </span>
              )}
              </div>
              <p className="text-xs text-[#8B6F74]">
              Upload a clear photo of the front of your government-issued ID.
              </p>
            </div>

            <div className="space-y-2">
              <label
              htmlFor="backIdImage"
              className="block text-sm font-medium text-[black]"
              >
              Back ID Image
              <span className="ml-1 text-xs text-[#8B6F74]">(if applicable)</span>
              </label>
              <div className="flex items-center gap-4">
              <input
                id="backIdImage"
                type="file"
                accept="image/*"
                onChange={(e) => setBackIdImage(e.target.files ? e.target.files[0] : null)}
                required
                className="flex-1 rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-2 text-[#1B1B1B] placeholder-[#8B6F74]/60
                focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:bg-[#FF2D91]/10 file:text-[#582A55] file:font-semibold
                file:transition-colors file:duration-200
                file:hover:bg-[#FF2D91]/30 file:hover:text-[#1B1B1B]
                file:cursor-pointer cursor-pointer"
              />
              {backIdImage && (
                <span className="text-xs text-[#8B6F74] truncate max-w-[120px]">
                {backIdImage.name}
                </span>
              )}
              </div>
              <p className="text-xs text-[#8B6F74]">
              Upload a clear photo of the back of your government-issued ID (if required).
              </p>
            </div>

            <div className="space-y-2">
              <label
              htmlFor="proofOfAddressImage"
              className="block text-sm font-medium text-[black]"
              >
              Proof of Address Image
              <span className="ml-1 text-xs text-[#8B6F74]">(e.g. utility bill, bank statement)</span>
              </label>
              <div className="flex items-center gap-4">
              <input
                id="proofOfAddressImage"
                type="file"
                accept="image/*"
                onChange={(e) => setProofOfAddressImage(e.target.files ? e.target.files[0] : null)}
                required
                className="flex-1 rounded-2xl border border-pink-200/80 bg-white/70 px-4 py-2 text-[#1B1B1B] placeholder-[#8B6F74]/60
                focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:bg-[#FF2D91]/10 file:text-[#582A55] file:font-semibold
                file:transition-colors file:duration-200
                file:hover:bg-[#FF2D91]/30 file:hover:text-[#1B1B1B]
                file:cursor-pointer cursor-pointer"
              />
              {proofOfAddressImage && (
                <span className="text-xs text-[#8B6F74] truncate max-w-[120px]">
                {proofOfAddressImage.name}
                </span>
              )}
              </div>
              <p className="text-xs text-[#8B6F74]">
              Upload a recent document showing your name and address.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleSubmit}
                className="w-auto px-10 md:px-12 rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A]
                          text-white text-base md:text-lg font-semibold py-3.5
                          shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]
                          focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// Replace onClick={handleContinue} with onClick={handleSubmit} on the Continue button in your form.