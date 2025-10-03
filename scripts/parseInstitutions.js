/**
 * Script to parse institution names and generate JSON data
 * Run with: node scripts/parseInstitutions.js
 */

const fs = require('fs');
const path = require('path');

// Raw institution data from your list
const rawInstitutionData = {
  Odisha: [
    "Siksha 'O' Anusandhan (SOA University), Bhubaneswar",
    "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar",
    "Utkal University, Bhubaneswar",
    "Berhampur University, Berhampur",
    "Sambalpur University, Sambalpur",
    "Fakir Mohan University, Balasore",
    "Orissa University of Agriculture & Technology (OUAT), Bhubaneswar",
    "Veer Surendra Sai University of Technology (VSSUT), Burla",
    "College of Engineering & Technology (CET), Bhubaneswar",
    "Gandhi Institute for Technology (GIFT), Bhubaneswar",
    "Centurion University of Technology & Management, Bhubaneswar",
    "Trident Academy of Technology, Bhubaneswar",
    "Silicon Institute of Technology (SIT), Bhubaneswar",
    "Orissa Engineering College (OEC), Bhubaneswar",
    "Parala Maharaja Engineering College, Berhampur",
    "Padmanava College of Engineering, Rourkela",
    "Roland Institute of Technology, Berhampur",
    "Government College of Engineering, Keonjhar",
    "Government College of Engineering, Kalahandi (Bhawanipatna)",
    "Bhubanananda Odisha School of Engineering (BOSE), Cuttack",
    "Bhadrak Institute of Engineering & Technology (BIET), Bhadrak",
    "Balasore College of Engineering and Technology (BCET), Balasore",
    "Rourkela Institute of Technology, Rourkela",
    "Government Polytechnic, Bhubaneswar",
    "Government Polytechnic, Rourkela",
    "Government Polytechnic, Balasore",
    "NLUO, Cuttack",
    "KIIT School of Law, Bhubaneswar",
    "XIMB, Bhubaneswar",
    "IMIS, Bhubaneswar",
    "Ravenshaw University, Cuttack",
    "Fakir Mohan Autonomous College, Balasore",
    "Khallikote College, Berhampur",
    "Government College, Angul",
    "Jatiya Kabi Bira Kishore Govt College, Cuttack",
    "Bhadrak Autonomous College, Bhadrak",
    "Kendrapara Autonomous College, Kendrapara",
    "Laxminarayana College, Jharsuguda",
    "RIE Bhubaneswar",
    "DAV College of Teacher Education, Koraput",
    "Rajendra College of Education, Balangir",
    "Kalinga College of Education, Bhubaneswar",
    "College of Pharmaceutical Sciences, Bhubaneswar",
    "College of Nursing, SCB Hospital, Cuttack",
    "College of Agriculture (OUAT), Bhubaneswar",
    "Veterinary College & Research Institute, Bhubaneswar",
    "Ramadevi Women's University, Bhubaneswar",
    "N.C. Autonomous College, Jajpur",
    "Maharaja Sriram Chandra Bhanja Deo University, Baripada",
    "Odisha State Open University, Sambalpur",
    "Government Women's Degree College, Titlagarh",
    "Narasingh Choudhury College, Jajpur",
    "Shailabala Women's College, Cuttack",
    "Model Degree College, Deogarh",
    "DRIEMS University, Cuttack",
    "GIET University, Gunupur",
    "SB Women's Government College, Cuttack",
    "Municipal College Rourkela, Rourkela",
    "Utkal University of Culture, Bhubaneswar",
    "College of Dairy Technology, OUAT, Bhubaneswar",
    "Fisheries College, OUAT, Berhampur",
    "Krishi Vigyan Kendra, Khordha",
    "SOA National Institute of Law, Bhubaneswar",
    "SOA Institute of Medical Sciences, Bhubaneswar",
    "KIIT School of Management, Bhubaneswar",
    "KIIT School of Biotechnology, Bhubaneswar",
    "Centurion University School of Agriculture, Paralakhemundi",
    "Indira Gandhi Institute of Technology (IGIT), Sarang",
    "College of Engineering Bhubaneswar (CEB), Bhubaneswar",
    "Hi-Tech Institute of Technology, Bhubaneswar",
    "Institute of Technical Education & Research (ITER), SOA, Bhubaneswar",
    "Capital Engineering College, Bhubaneswar",
    "Aryan Institute of Engineering & Technology, Bhubaneswar",
    "Synergy Institute of Engineering & Technology, Dhenkanal",
    "International Institute of Information Technology (IIIT), Bhubaneswar"
  ]
  // Add other states similarly
};

console.log('Institution data parser ready. Add remaining state data and run to generate JSON files.');
console.log(`Currently loaded: ${rawInstitutionData.Odisha.length} Odisha institutions`);
